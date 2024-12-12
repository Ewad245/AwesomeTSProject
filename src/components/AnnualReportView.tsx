import React from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Transaction } from '../database/database';
import { theme } from '../theme/theme';
import { CategoryTransactionList } from './CategoryTransactionList';

const screenWidth = Dimensions.get('window').width;

interface AnnualReportViewProps {
  selectedYear: number;
  selectedType: 'income' | 'expense';
  annualTotals: { income: number; expense: number };
  categoryData: Array<{
    category: string;
    total: number;
    color: string;
    type: 'income' | 'expense';
    transactions: Transaction[];
  }>;
  onTypeChange: (type: 'income' | 'expense') => void;
  formatCurrency: (value: number) => string;
}

export const AnnualReportView: React.FC<AnnualReportViewProps> = ({
  selectedYear,
  selectedType,
  annualTotals,
  categoryData,
  onTypeChange,
  formatCurrency,
}) => {
  const pieData = categoryData
    .filter(item => item.type === selectedType && item.total > 0)
    .map(item => ({
      name: item.category,
      value: item.total,
      color: item.color,
      legendFontColor: theme.colors.text,
      legendFontSize: 12,
    }));

  const categories = categoryData
    .filter(item => item.type === selectedType && item.total > 0)
    .map(item => ({
      category: item.category,
      total: item.total,
      color: item.color,
      transactions: item.transactions,
    }));

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
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Annual Income</Text>
          <Text style={[styles.summaryValue, { color: theme.colors.income }]}>
            {formatCurrency(annualTotals.income)}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Annual Expenses</Text>
          <Text style={[styles.summaryValue, { color: theme.colors.expense }]}>
            {formatCurrency(annualTotals.expense)}
          </Text>
        </View>
      </View>

      <View style={styles.savingsContainer}>
        <Text style={styles.savingsLabel}>Net Savings</Text>
        <Text
          style={[
            styles.savingsValue,
            {
              color:
                annualTotals.income - annualTotals.expense >= 0
                  ? theme.colors.income
                  : theme.colors.expense,
            },
          ]}
        >
          {formatCurrency(annualTotals.income - annualTotals.expense)}
        </Text>
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
            Annual {selectedType === 'income' ? 'Income' : 'Expenses'} by Category
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
            No {selectedType} data for {selectedYear}
          </Text>
        </View>
      )}

      {categories.length > 0 && (
        <CategoryTransactionList
          categories={categories}
          formatCurrency={formatCurrency}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
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
  savingsContainer: {
    margin: theme.spacing.md,
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  savingsLabel: {
    ...theme.typography.caption,
    color: theme.colors.secondary,
    marginBottom: theme.spacing.xs,
  },
  savingsValue: {
    ...theme.typography.h2,
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
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.secondary,
    textAlign: 'center',
    padding: theme.spacing.xl,
  },
});
