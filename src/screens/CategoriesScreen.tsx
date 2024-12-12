import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator } from 'react-native';
import * as Icons from 'lucide-react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { getCategories, Category } from '../database/database';
import { theme } from '../theme/theme';

// Helper function to convert kebab-case to PascalCase
const toPascalCase = (str: string) => {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
};

export const CategoriesScreen = ({ navigation }: any) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'income' | 'expense'>('expense');

  useEffect(() => {
    loadCategories();
  }, [selectedType]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCategories(selectedType);
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
      setError('Failed to load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderCategory = ({ item }: { item: Category }) => {
    let IconComponent;
    if (item.icon) {
      const iconName = toPascalCase(item.icon);
      IconComponent = (Icons as any)[iconName];
    }
    
    // Fallback to a default icon if the icon is not found
    if (!IconComponent) {
      IconComponent = item.type === 'income' ? Icons.ArrowDown : Icons.ArrowUp;
    }
    
    return (
      <Animated.View entering={FadeInRight} style={styles.categoryCard}>
        <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
          <IconComponent size={24} color={theme.colors.background} />
        </View>
        <Text style={styles.categoryName}>{item.name}</Text>
      </Animated.View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={loadCategories}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.typeSelector}>
        <Pressable
          style={[
            styles.typeButton,
            selectedType === 'income' && styles.selectedTypeButton,
          ]}
          onPress={() => setSelectedType('income')}
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
          ]}
          onPress={() => setSelectedType('expense')}
        >
          <Text
            style={[
              styles.typeButtonText,
              selectedType === 'expense' && styles.selectedTypeButtonText,
            ]}
          >
            Expense
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No categories found</Text>
          </View>
        }
      />

      <Pressable
        style={styles.addButton}
        onPress={() => navigation.navigate('AddCategory', { type: selectedType })}
      >
        <Icons.Plus size={24} color={theme.colors.background} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: theme.spacing.md,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    elevation: 2,
    shadowColor: theme.colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  categoryName: {
    ...theme.typography.body,
    color: theme.colors.text,
    flex: 1,
  },
  typeSelector: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  typeButton: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    backgroundColor: theme.colors.card,
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
  addButton: {
    position: 'absolute',
    right: theme.spacing.lg,
    bottom: theme.spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: theme.colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  errorText: {
    ...theme.typography.body,
    color: theme.colors.error,
    marginBottom: theme.spacing.md,
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  retryButtonText: {
    ...theme.typography.body,
    color: theme.colors.background,
  },
  emptyContainer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.secondary,
  },
});
