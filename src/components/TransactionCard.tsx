import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import * as Icons from 'lucide-react-native';
import { theme } from '../theme/theme';
import { Transaction } from '../database/database';

interface TransactionCardProps {
  transaction: Transaction & { icon?: string; color?: string };
  onPress?: () => void;
}

// Helper function to convert kebab-case to PascalCase
const toPascalCase = (str: string) => {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
};

export const TransactionCard = ({ transaction, onPress }: TransactionCardProps) => {
  const isIncome = transaction.type === 'income';
  
  // Get the icon component dynamically
  let IconComponent;
  if (transaction.icon) {
    // Convert kebab-case to PascalCase (e.g., 'shopping-bag' to 'ShoppingBag')
    const iconName = toPascalCase(transaction.icon);
    IconComponent = (Icons as any)[iconName];
  }
  
  // Fallback to default icons if the icon is not found
  if (!IconComponent) {
    IconComponent = isIncome ? Icons.ArrowDown : Icons.ArrowUp;
  }

  return (
    <Animated.View
      entering={FadeInRight}
      exiting={FadeOutLeft}
      style={styles.container}
    >
      <Pressable onPress={onPress} style={styles.pressable}>
        <View style={styles.leftContent}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: transaction.color || (isIncome ? theme.colors.income : theme.colors.expense) },
            ]}
          >
            <IconComponent
              size={24}
              color={theme.colors.background}
            />
          </View>
          <View>
            <Text style={styles.category}>{transaction.category}</Text>
            <Text style={styles.date}>{new Date(transaction.date).toLocaleDateString()}</Text>
          </View>
        </View>
        <Text
          style={[
            styles.amount,
            { color: isIncome ? theme.colors.income : theme.colors.expense },
          ]}
        >
          {isIncome ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    marginVertical: theme.spacing.xs,
    marginHorizontal: theme.spacing.md,
    shadowColor: theme.colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pressable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  category: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  date: {
    ...theme.typography.caption,
    color: theme.colors.secondary,
    marginTop: theme.spacing.xs,
  },
  amount: {
    ...theme.typography.h3,
  },
});
