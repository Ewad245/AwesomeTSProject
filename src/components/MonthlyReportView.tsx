import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, Pressable } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Transaction } from '../database/database';
import { TransactionCard } from './TransactionCard';
import { theme } from '../theme/theme';

const screenWidth = Dimensions.get('window').width;

const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

interface MonthlyReportViewProps {
  selectedYear: number;
  selectedMonth: number;
  selectedType: 'income' | 'expense';
  totals: { income: number; expense: number };
  pieData: Array<{
    name: string;
    value: number;
    color: string;
    legendFontColor: string;
    legendFontSize: number;
  }>;
  transactions: Transaction[];
  onMonthChange: (month: number) => void;
  onTypeChange: (type: 'income' | 'expense') => void;
  formatCurrency: (value: number) => string;
}

export const MonthlyReportView: React.FC<MonthlyReportViewProps> = ({
  selectedYear,
  selectedMonth,
  selectedType,
  totals,
  pieData,
  transactions,
  onMonthChange,
  onTypeChange,
  formatCurrency,
}) => {
  const filteredTransactions = transactions.filter(t => t.type === selectedType);

  const chartConfig = {
    backgroundColor: theme.colors.card,
    backgroundGradientFrom: theme.colors.card,
    backgroundGradientTo: theme.colors.card,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => theme.colors.text,
    style: {
      borderRadius: 16,
    },
  };

  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.monthSelector}
      >
        {months.map((month, index) => (
          <Pressable
            key={month}
            style={[
              styles.monthButton,
              selectedMonth === index + 1 && styles.selectedMonthButton,
            ]}
            onPress={() => onMonthChange(index + 1)}
          >
            <Text
              style={[
                styles.monthButtonText,
                selectedMonth === index + 1 && styles.selectedMonthButtonText,
              ]}
            >
              {month}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Income</Text>
          <Text style={[styles.summaryValue, { color: theme.colors.income }]}>
            {formatCurrency(totals.income)}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Expenses</Text>
          <Text style={[styles.summaryValue, { color: theme.colors.expense }]}>
            {formatCurrency(totals.expense)}
          </Text>
        </View>
      </View>

      <View style={styles.typeSelector}>
        <Pressable
          style={[
            styles.typeButton,
            selectedType === 'income' && styles.selectedTypeButton,
            { borderColor: theme.colors.income },
          ]}
          onPress={() => onTypeChange('income')}
        >
          <Text
            style={[
              styles.typeButtonText,
              selectedType === 'income' && styles.selectedTypeButtonText,
            ]}
          >
            Income
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.typeButton,
            selectedType === 'expense' && styles.selectedTypeButton,
            { borderColor: theme.colors.expense },
          ]}
          onPress={() => onTypeChange('expense')}
        >
          <Text
            style={[
              styles.typeButtonText,
              selectedType === 'expense' && styles.selectedTypeButtonText,
            ]}
          >
            Expenses
          </Text>
        </Pressable>
      </View>

      {pieData.length > 0 ? (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>
            {selectedType === 'income' ? 'Income' : 'Expenses'} by Category
          </Text>
          <PieChart
            data={pieData}
            width={screenWidth - theme.spacing.md * 2}
            height={220}
            chartConfig={chartConfig}
            accessor="value"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>
      ) : (
        <View style={styles.emptyChartContainer}>
          <Text style={styles.emptyText}>
            No {selectedType} data for this month
          </Text>
        </View>
      )}

      <View style={styles.transactionsContainer}>
        <Text style={styles.chartTitle}>
          {selectedType === 'income' ? 'Income' : 'Expense'} Transactions
        </Text>
        {filteredTransactions.length === 0 ? (
          <Text style={styles.emptyText}>
            No {selectedType} transactions for this month
          </Text>
        ) : (
          filteredTransactions.map(transaction => (
            <TransactionCard
              key={transaction.id?.toString() || Math.random().toString()}
              transaction={transaction}
            />
          ))
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  monthSelector: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  monthButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.card,
  },
  selectedMonthButton: {
    backgroundColor: theme.colors.primary,
  },
  monthButtonText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  selectedMonthButtonText: {
    color: theme.colors.background,
  },
  summaryContainer: {
    flexDirection: 'row',
    margin: theme.spacing.md,
    gap: theme.spacing.md,
  },
  summaryItem: {
    flex: 1,
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  summaryLabel: {
    ...theme.typography.caption,
    color: theme.colors.secondary,
    marginBottom: theme.spacing.xs,
  },
  summaryValue: {
    ...theme.typography.h3,
  },
  typeSelector: {
    flexDirection: 'row',
    margin: theme.spacing.md,
    gap: theme.spacing.md,
  },
  typeButton: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderWidth: 2,
  },
  selectedTypeButton: {
    backgroundColor: theme.colors.primary,
  },
  typeButtonText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  selectedTypeButtonText: {
    color: theme.colors.background,
  },
  chartContainer: {
    margin: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
  },
  emptyChartContainer: {
    margin: theme.spacing.md,
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
  },
  chartTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  transactionsContainer: {
    margin: theme.spacing.md,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.secondary,
    textAlign: 'center',
    padding: theme.spacing.xl,
  },
});
