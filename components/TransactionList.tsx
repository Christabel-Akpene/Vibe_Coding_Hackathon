import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Transaction } from '@/types';
import { formatCurrency, formatDate, getCategoryById } from '@/utils/dataUtils';
import Colors from '@/constants/Colors';
import { TrendingUp, TrendingDown } from 'lucide-react-native';

type TransactionListProps = {
  transactions: Transaction[];
  currency?: string;
  onItemPress?: (transaction: Transaction) => void;
};

export default function TransactionList({
  transactions,
  currency = 'USD',
  onItemPress,
}: TransactionListProps) {
  const renderItem = ({ item }: { item: Transaction }) => {
    const category = getCategoryById(item.category);
    
    return (
      <TouchableOpacity 
        style={styles.transactionItem}
        onPress={() => onItemPress && onItemPress(item)}
      >
        <View style={styles.transactionIcon}>
          {item.type === 'income' ? (
            <TrendingUp color={Colors.light.income} size={24} />
          ) : (
            <TrendingDown color={Colors.light.expense} size={24} />
          )}
        </View>
        
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionNote}>{item.notes}</Text>
          <View style={styles.transactionMeta}>
            <Text style={styles.transactionCategory}>{category.name}</Text>
            <Text style={styles.transactionDate}>{formatDate(item.date)}</Text>
          </View>
        </View>
        
        <Text 
          style={[
            styles.transactionAmount,
            item.type === 'income' ? styles.incomeText : styles.expenseText
          ]}
        >
          {item.type === 'income' ? '+' : '-'} {formatCurrency(item.amount, currency)}
        </Text>
      </TouchableOpacity>
    );
  };

  const EmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No transactions yet</Text>
      <Text style={styles.emptySubtext}>
        Your transactions will appear here once you add them
      </Text>
    </View>
  );

  return (
    <FlatList
      data={transactions}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.listContainer}
      ListEmptyComponent={<EmptyList />}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionNote: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 4,
    fontFamily: 'Inter-Medium',
  },
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionCategory: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    marginRight: 8,
    fontFamily: 'Inter-Regular',
  },
  transactionDate: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    fontFamily: 'Inter-Regular',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
  },
  incomeText: {
    color: Colors.light.income,
  },
  expenseText: {
    color: Colors.light.expense,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 8,
    fontFamily: 'Inter-Bold',
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
});