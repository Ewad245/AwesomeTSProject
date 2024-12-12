import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { getMonthlyTotals, getCategoryTotals, getTransactionsByDateRange } from '../database/database';
import { theme } from '../theme/theme';
import { MonthlyReportView } from '../components/MonthlyReportView';
import { AnnualReportView } from '../components/AnnualReportView';

const formatCurrency = (value: number) => {
  return `$${Math.abs(value).toFixed(2)}`;
};

type ReportPeriod = 'monthly' | 'annual';

export const ReportsScreen = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedType, setSelectedType] = useState<'income' | 'expense'>('expense');
  const [reportPeriod, setReportPeriod] = useState<ReportPeriod>('monthly');
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [monthlyTotals, setMonthlyTotals] = useState({ income: 0, expense: 0 });
  const [annualTotals, setAnnualTotals] = useState({ income: 0, expense: 0 });

  useEffect(() => {
    loadData();
  }, [selectedYear, selectedMonth, reportPeriod]);

  const loadData = async () => {
    try {
      if (reportPeriod === 'monthly') {
        // Load monthly data
        const startDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-01`;
        const lastDay = new Date(selectedYear, selectedMonth, 0).getDate();
        const endDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${lastDay}`;

        const categoryTotals = await getCategoryTotals(startDate, endDate);
        setCategoryData(categoryTotals);

        const monthTransactions = await getTransactionsByDateRange(startDate, endDate);
        setTransactions(monthTransactions);

        const income = monthTransactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
        const expense = monthTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
        setMonthlyTotals({ income, expense });
      } else {
        // Load annual data
        const yearlyTotals = await getMonthlyTotals(selectedYear);
        setMonthlyData(yearlyTotals);

        const income = yearlyTotals.reduce((sum, month) => sum + (month.income || 0), 0);
        const expense = yearlyTotals.reduce((sum, month) => sum + (month.expense || 0), 0);
        setAnnualTotals({ income, expense });

        // Get transactions and category totals for the entire year
        const startDate = `${selectedYear}-01-01`;
        const endDate = `${selectedYear}-12-31`;
        
        const yearTransactions = await getTransactionsByDateRange(startDate, endDate);
        setTransactions(yearTransactions);
        
        const categoryTotals = await getCategoryTotals(startDate, endDate);
        const categoriesWithTransactions = categoryTotals.map(category => ({
          ...category,
          transactions: yearTransactions.filter(
            t => t.category === category.category && t.type === category.type
          ),
        }));
        setCategoryData(categoriesWithTransactions);
      }
    } catch (error) {
      console.error('Error loading report data:', error);
    }
  };

  const pieData = categoryData
    .filter(item => item.type === selectedType && item.total > 0)
    .map(item => ({
      name: item.category,
      value: item.total,
      color: item.color || (selectedType === 'income' ? theme.colors.income : theme.colors.expense),
      legendFontColor: theme.colors.text,
      legendFontSize: 12,
    }));

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.yearButton}
          onPress={() => setSelectedYear(selectedYear - 1)}
        >
          <Text style={styles.yearButtonText}>←</Text>
        </Pressable>
        <Text style={styles.yearText}>{selectedYear}</Text>
        <Pressable
          style={styles.yearButton}
          onPress={() => setSelectedYear(selectedYear + 1)}
        >
          <Text style={styles.yearButtonText}>→</Text>
        </Pressable>
      </View>

      <View style={styles.periodSelector}>
        <Pressable
          style={[
            styles.periodButton,
            reportPeriod === 'monthly' && styles.selectedPeriodButton,
          ]}
          onPress={() => setReportPeriod('monthly')}
        >
          <Text
            style={[
              styles.periodButtonText,
              reportPeriod === 'monthly' && styles.selectedPeriodButtonText,
            ]}
          >
            Monthly
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.periodButton,
            reportPeriod === 'annual' && styles.selectedPeriodButton,
          ]}
          onPress={() => setReportPeriod('annual')}
        >
          <Text
            style={[
              styles.periodButtonText,
              reportPeriod === 'annual' && styles.selectedPeriodButtonText,
            ]}
          >
            Annual
          </Text>
        </Pressable>
      </View>

      {reportPeriod === 'monthly' ? (
        <MonthlyReportView
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          selectedType={selectedType}
          totals={monthlyTotals}
          pieData={pieData}
          transactions={transactions}
          onMonthChange={setSelectedMonth}
          onTypeChange={setSelectedType}
          formatCurrency={formatCurrency}
        />
      ) : (
        <AnnualReportView
          selectedYear={selectedYear}
          selectedType={selectedType}
          annualTotals={annualTotals}
          categoryData={categoryData}
          onTypeChange={setSelectedType}
          formatCurrency={formatCurrency}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
  },
  yearButton: {
    padding: theme.spacing.md,
  },
  yearButtonText: {
    ...theme.typography.h3,
    color: theme.colors.primary,
  },
  yearText: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginHorizontal: theme.spacing.lg,
  },
  periodSelector: {
    flexDirection: 'row',
    margin: theme.spacing.md,
    gap: theme.spacing.md,
  },
  periodButton: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    backgroundColor: theme.colors.card,
  },
  selectedPeriodButton: {
    backgroundColor: theme.colors.primary,
  },
  periodButtonText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  selectedPeriodButtonText: {
    color: theme.colors.background,
  },
});
