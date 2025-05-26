import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { useTransactions } from '@/context/TransactionContext';
import Colors from '@/constants/Colors';
import Header from '@/components/Header';
import { Check, Calendar, Clipboard } from 'lucide-react-native';
import { categories, formatCurrency } from '@/utils/dataUtils';
import { router } from 'expo-router';
import { Transaction } from '@/types';

export default function ManualEntryScreen() {
  const { user } = useAuth();
  const { addTransaction } = useTransactions();
  const [amount, setAmount] = useState('0');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState<string>('other');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  
  const handleNumberPress = (num: string) => {
    if (amount === '0' && num !== '.') {
      setAmount(num);
    } else {
      // Prevent multiple decimal points
      if (num === '.' && amount.includes('.')) return;
      
      setAmount(amount + num);
    }
  };
  
  const handleDelete = () => {
    if (amount.length > 1) {
      setAmount(amount.slice(0, -1));
    } else {
      setAmount('0');
    }
  };
  
  const handleClear = () => {
    setAmount('0');
  };
  
  const handleSave = () => {
    if (parseFloat(amount) <= 0) return;
    
    const newTransaction: Omit<Transaction, 'id'> = {
      userId: user?.id || '',
      amount: parseFloat(amount),
      type,
      category,
      date: new Date(date).toISOString(),
      method: 'cash',
      notes: notes || 'Manual entry',
    };
    
    addTransaction(newTransaction);
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Manual Entry" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.amountContainer}>
          <Text style={styles.currencySymbol}>{user?.currency || '$'}</Text>
          <Text style={styles.amountText}>
            {parseFloat(amount).toLocaleString(undefined, {
              minimumFractionDigits: amount.includes('.') ? 2 : 0,
              maximumFractionDigits: 2
            })}
          </Text>
        </View>
        
        <View style={styles.typeContainer}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === 'expense' ? styles.typeButtonActive : null
            ]}
            onPress={() => setType('expense')}
          >
            <Text 
              style={[
                styles.typeButtonText,
                type === 'expense' ? styles.typeButtonTextActive : null
              ]}
            >
              Expense
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === 'income' ? styles.typeButtonActive : null
            ]}
            onPress={() => setType('income')}
          >
            <Text 
              style={[
                styles.typeButtonText,
                type === 'income' ? styles.typeButtonTextActive : null
              ]}
            >
              Income
            </Text>
          </TouchableOpacity>
        </View>
        
        {type === 'expense' && (
          <View style={styles.categoriesContainer}>
            <Text style={styles.sectionTitle}>Category</Text>
            <View style={styles.categoriesGrid}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryButton,
                    category === cat.id ? { backgroundColor: cat.color } : null
                  ]}
                  onPress={() => setCategory(cat.id)}
                >
                  <Text 
                    style={[
                      styles.categoryButtonText,
                      category === cat.id ? styles.categoryButtonTextActive : null
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
        
        <View style={styles.notesContainer}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <View style={styles.notesInputContainer}>
            <Clipboard size={20} color={Colors.light.tabIconDefault} />
            <TextInput
              style={styles.notesInput}
              placeholder="Add notes"
              value={notes}
              onChangeText={setNotes}
              multiline
            />
          </View>
        </View>
        
        <View style={styles.dateContainer}>
          <Text style={styles.sectionTitle}>Date</Text>
          <View style={styles.dateInputContainer}>
            <Calendar size={20} color={Colors.light.tabIconDefault} />
            <TextInput
              style={styles.dateInput}
              placeholder="YYYY-MM-DD"
              value={date}
              onChangeText={setDate}
              keyboardType="numeric"
            />
          </View>
        </View>
        
        <TouchableOpacity
          style={[
            styles.saveButton,
            parseFloat(amount) <= 0 ? styles.saveButtonDisabled : null
          ]}
          onPress={handleSave}
          disabled={parseFloat(amount) <= 0}
        >
          <Check size={24} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>Save Transaction</Text>
        </TouchableOpacity>
      </ScrollView>
      
      <View style={styles.keypadContainer}>
        <View style={styles.keypadRow}>
          <TouchableOpacity style={styles.keypadButton} onPress={() => handleNumberPress('1')}>
            <Text style={styles.keypadButtonText}>1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.keypadButton} onPress={() => handleNumberPress('2')}>
            <Text style={styles.keypadButtonText}>2</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.keypadButton} onPress={() => handleNumberPress('3')}>
            <Text style={styles.keypadButtonText}>3</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.keypadRow}>
          <TouchableOpacity style={styles.keypadButton} onPress={() => handleNumberPress('4')}>
            <Text style={styles.keypadButtonText}>4</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.keypadButton} onPress={() => handleNumberPress('5')}>
            <Text style={styles.keypadButtonText}>5</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.keypadButton} onPress={() => handleNumberPress('6')}>
            <Text style={styles.keypadButtonText}>6</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.keypadRow}>
          <TouchableOpacity style={styles.keypadButton} onPress={() => handleNumberPress('7')}>
            <Text style={styles.keypadButtonText}>7</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.keypadButton} onPress={() => handleNumberPress('8')}>
            <Text style={styles.keypadButtonText}>8</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.keypadButton} onPress={() => handleNumberPress('9')}>
            <Text style={styles.keypadButtonText}>9</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.keypadRow}>
          <TouchableOpacity style={styles.keypadButton} onPress={() => handleNumberPress('.')}>
            <Text style={styles.keypadButtonText}>.</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.keypadButton} onPress={() => handleNumberPress('0')}>
            <Text style={styles.keypadButtonText}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.keypadButton} onPress={handleDelete}>
            <Text style={styles.keypadButtonText}>⌫</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  scrollView: {
    flex: 1,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  currencySymbol: {
    fontSize: 28,
    color: Colors.light.text,
    marginRight: 4,
    fontFamily: 'Inter-Bold',
  },
  amountText: {
    fontSize: 40,
    color: Colors.light.text,
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
  },
  typeContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  typeButtonActive: {
    backgroundColor: Colors.light.primary,
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
    fontFamily: 'Inter-Bold',
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
  },
  categoriesContainer: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 8,
    fontFamily: 'Inter-Medium',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 4,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  categoryButtonText: {
    fontSize: 14,
    color: Colors.light.text,
    fontFamily: 'Inter-Regular',
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
  },
  notesContainer: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  notesInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  notesInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    minHeight: 40,
    fontFamily: 'Inter-Regular',
  },
  dateContainer: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  dateInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    minHeight: 40,
    fontFamily: 'Inter-Regular',
  },
  saveButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginVertical: 24,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    fontFamily: 'Inter-Bold',
  },
  keypadContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  keypadButton: {
    width: '30%',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keypadButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    fontFamily: 'Inter-Bold',
  },
});