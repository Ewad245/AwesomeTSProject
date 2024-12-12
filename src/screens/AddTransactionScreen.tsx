import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import { addTransaction } from '../database/database';
import { theme } from '../theme/theme';

const categories = {
  income: ['Salary', 'Freelance', 'Investments', 'Other'],
  expense: ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Other'],
};

export const AddTransactionScreen = ({ route, navigation }: any) => {
  const { type } = route.params;
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = async () => {
    if (!amount || !category) return;

    try {
      await addTransaction({
        amount: parseFloat(amount),
        type,
        category,
        date: date.toISOString(),
        note,
      });
      navigation.goBack();
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View entering={SlideInUp} style={styles.form}>
        <Text style={styles.title}>
          Add {type.charAt(0).toUpperCase() + type.slice(1)}
        </Text>

        <Animated.View entering={FadeIn.delay(100)} style={styles.inputContainer}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
          />
        </Animated.View>

        <Animated.View entering={FadeIn.delay(200)} style={styles.inputContainer}>
          <Text style={styles.label}>Category</Text>
          <Dropdown
            style={styles.dropdown}
            data={categories[type].map((cat) => ({ label: cat, value: cat }))}
            labelField="label"
            valueField="value"
            value={category}
            onChange={(item) => setCategory(item.value)}
            placeholder="Select category"
          />
        </Animated.View>

        <Animated.View entering={FadeIn.delay(300)} style={styles.inputContainer}>
          <Text style={styles.label}>Date</Text>
          <Pressable onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
            <Text>{date.toLocaleDateString()}</Text>
          </Pressable>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDate(selectedDate);
              }}
            />
          )}
        </Animated.View>

        <Animated.View entering={FadeIn.delay(400)} style={styles.inputContainer}>
          <Text style={styles.label}>Note (Optional)</Text>
          <TextInput
            style={[styles.input, styles.noteInput]}
            value={note}
            onChangeText={setNote}
            placeholder="Add a note"
            multiline
          />
        </Animated.View>

        <Animated.View entering={FadeIn.delay(500)} style={styles.buttonContainer}>
          <Pressable
            style={[
              styles.button,
              { backgroundColor: type === 'income' ? theme.colors.income : theme.colors.expense },
            ]}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>Add Transaction</Text>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </View>
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
  title: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    ...theme.typography.body,
    marginBottom: theme.spacing.xs,
    color: theme.colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.typography.body,
  },
  noteInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  buttonContainer: {
    marginTop: theme.spacing.xl,
  },
  button: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  buttonText: {
    ...theme.typography.body,
    color: theme.colors.background,
    fontWeight: 'bold',
  },
});
