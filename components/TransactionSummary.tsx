import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { formatCurrency } from '@/utils/dataUtils';
import { ArrowDownRight, ArrowUpRight, Wallet } from 'lucide-react-native';

type TransactionSummaryProps = {
  income: number;
  expense: number;
  currency?: string;
};

export default function TransactionSummary({
  income,
  expense,
  currency = 'USD',
}: TransactionSummaryProps) {
  const balance = income - expense;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={[styles.summaryItem, styles.balanceItem]}>
          <View style={styles.iconContainer}>
            <Wallet size={24} color={balance >= 0 ? Colors.light.income : Colors.light.expense} />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryLabel}>Balance</Text>
            <Text 
              style={[
                styles.summaryValue, 
                balance >= 0 ? styles.positiveBalance : styles.negativeBalance
              ]}
            >
              {formatCurrency(balance, currency)}
            </Text>
          </View>
        </View>
        
        <View style={styles.summaryRow}>
          <View style={[styles.summaryItem, styles.incomeItem]}>
            <View style={styles.iconContainer}>
              <ArrowUpRight size={20} color={Colors.light.income} />
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryLabel}>Income</Text>
              <Text style={[styles.summaryValue, styles.incomeValue]}>
                {formatCurrency(income, currency)}
              </Text>
            </View>
          </View>
          
          <View style={[styles.summaryItem, styles.expenseItem]}>
            <View style={styles.iconContainer}>
              <ArrowDownRight size={20} color={Colors.light.expense} />
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryLabel}>Expenses</Text>
              <Text style={[styles.summaryValue, styles.expenseValue]}>
                {formatCurrency(expense, currency)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.card,
  },
  incomeItem: {
    flex: 1,
    marginRight: 8,
  },
  expenseItem: {
    flex: 1,
    marginLeft: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  summaryContent: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    marginBottom: 4,
    fontFamily: 'Inter-Regular',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
  },
  incomeValue: {
    color: Colors.light.income,
  },
  expenseValue: {
    color: Colors.light.expense,
  },
  positiveBalance: {
    color: Colors.light.income,
  },
  negativeBalance: {
    color: Colors.light.expense,
  },
});