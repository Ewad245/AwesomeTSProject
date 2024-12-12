import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView } from 'react-native';
import * as Icons from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { addCategory } from '../database/database';
import { theme } from '../theme/theme';

const iconNames = [
  'Briefcase', 'Laptop', 'TrendingUp', 'Coffee', 'Car', 'ShoppingBag',
  'FileText', 'Film', 'Gift', 'Home', 'Phone', 'DollarSign',
  'CreditCard', 'Book', 'Heart', 'Music', 'Plane', 'Smartphone',
  'Umbrella', 'Watch'
];

const colors = [
  '#00B894', '#00CEC9', '#6C5CE7', '#FF7675', '#FAB1A0', '#FD79A8',
  '#636E72', '#E84393', '#E17055', '#74B9FF', '#A8E6CF', '#DFE6E9',
  '#B2BEC3', '#FD79A8', '#6C5CE7', '#00B894', '#FF7675', '#74B9FF',
];

export const AddCategoryScreen = ({ route, navigation }: any) => {
  const { type } = route.params;
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Please enter a category name');
      return;
    }
    if (!selectedIcon) {
      setError('Please select an icon');
      return;
    }
    if (!selectedColor) {
      setError('Please select a color');
      return;
    }

    try {
      await addCategory({
        name: name.trim(),
        type,
        icon: selectedIcon,
        color: selectedColor,
      });
      navigation.goBack();
    } catch (error) {
      console.error('Error adding category:', error);
      setError('Failed to add category. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Animated.View entering={FadeIn} style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Category Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={(text) => {
              setName(text);
              setError('');
            }}
            placeholder="Enter category name"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Select Icon</Text>
          <View style={styles.iconGrid}>
            {iconNames.map((iconName) => {
              const IconComponent = (Icons as any)[iconName];
              return (
                <Pressable
                  key={iconName}
                  style={[
                    styles.iconButton,
                    selectedIcon === iconName.toLowerCase() && styles.selectedIconButton,
                  ]}
                  onPress={() => setSelectedIcon(iconName.toLowerCase())}
                >
                  <IconComponent
                    size={24}
                    color={
                      selectedIcon === iconName.toLowerCase()
                        ? theme.colors.background
                        : theme.colors.text
                    }
                  />
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Select Color</Text>
          <View style={styles.colorGrid}>
            {colors.map((color) => (
              <Pressable
                key={color}
                style={[
                  styles.colorButton,
                  { backgroundColor: color },
                  selectedColor === color && styles.selectedColorButton,
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </View>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Pressable style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Add Category</Text>
        </Pressable>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  form: {
    padding: theme.spacing.md,
  },
  inputContainer: {
    marginBottom: theme.spacing.xl,
  },
  label: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.typography.body,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
  },
  selectedIconButton: {
    backgroundColor: theme.colors.primary,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  colorButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  selectedColorButton: {
    borderWidth: 3,
    borderColor: theme.colors.text,
  },
  errorText: {
    ...theme.typography.body,
    color: theme.colors.error,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  submitButtonText: {
    ...theme.typography.body,
    color: theme.colors.background,
    fontWeight: 'bold',
  },
});
