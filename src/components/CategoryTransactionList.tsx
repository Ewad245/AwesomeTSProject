import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Transaction } from '../database/database';
import { TransactionCard } from './TransactionCard';
import { theme } from '../theme/theme';
import { X } from 'lucide-react-native';

interface CategoryItem {
  category: string;
  total: number;
  color: string;
  transactions: Transaction[];
}

interface CategoryTransactionListProps {
  categories: CategoryItem[];
  formatCurrency: (value: number) => string;
}

export const CategoryTransactionList: React.FC<CategoryTransactionListProps> = ({
  categories,
  formatCurrency,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null);

  return (
    <View style={styles.container}>
      {categories.map((category) => (
        <Pressable
          key={category.category}
          style={styles.categoryItem}
          onPress={() => setSelectedCategory(category)}
        >
          <View style={styles.categoryHeader}>
            <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
            <Text style={styles.categoryName}>{category.category}</Text>
          </View>
          <Text style={[styles.categoryAmount, { color: category.color }]}>
            {formatCurrency(category.total)}
          </Text>
        </Pressable>
      ))}

      <Modal
        visible={!!selectedCategory}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedCategory(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <View
                  style={[
                    styles.categoryDot,
                    { backgroundColor: selectedCategory?.color },
                  ]}
                />
                <Text style={styles.modalTitle}>{selectedCategory?.category}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setSelectedCategory(null)}
                style={styles.closeButton}
              >
                <X color={theme.colors.text} size={24} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.transactionList}>
              {selectedCategory?.transactions.map((transaction) => (
                <TransactionCard
                  key={transaction.id?.toString()}
                  transaction={transaction}
                />
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: theme.spacing.sm,
  },
  categoryName: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  categoryAmount: {
    ...theme.typography.h3,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },
  closeButton: {
    padding: theme.spacing.sm,
  },
  transactionList: {
    padding: theme.spacing.md,
  },
});
