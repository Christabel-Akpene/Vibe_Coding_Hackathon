import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { useTransactions } from '@/context/TransactionContext';
import Colors from '@/constants/Colors';
import Header from '@/components/Header';
import TransactionSummary from '@/components/TransactionSummary';
import TransactionList from '@/components/TransactionList';
import { Plus, Mic, Camera, CreditCard as Edit3 } from 'lucide-react-native';
import { router } from 'expo-router';
import { generateReportData } from '@/utils/dataUtils';

export default function DashboardScreen() {
  const { user } = useAuth();
  const { transactions, isLoading } = useTransactions();
  const [reportData, setReportData] = useState({
    income: 0,
    expense: 0,
    balance: 0,
  });

  // Generate summary data when transactions change
  React.useEffect(() => {
    const report = generateReportData(transactions, 'monthly');
    setReportData({
      income: report.income,
      expense: report.expense,
      balance: report.balance,
    });
  }, [transactions]);

  const navigateToScreen = (screen: string) => {
    router.push(`/(tabs)/${screen}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Dashboard" showLogout />
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>
            Hi, {user?.name || 'there'}!
          </Text>
          <Text style={styles.businessText}>
            {user?.businessName || 'Your Business'}
          </Text>
        </View>
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.light.primary} />
          </View>
        ) : (
          <>
            <TransactionSummary 
              income={reportData.income} 
              expense={reportData.expense} 
              currency={user?.currency}
            />
            
            <View style={styles.actionsContainer}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              
              <View style={styles.actionButtonsContainer}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => navigateToScreen('voice')}
                >
                  <View style={[styles.actionIcon, { backgroundColor: Colors.light.primary }]}>
                    <Mic size={24} color="#FFFFFF" />
                  </View>
                  <Text style={styles.actionText}>Voice</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => navigateToScreen('camera')}
                >
                  <View style={[styles.actionIcon, { backgroundColor: Colors.light.accent }]}>
                    <Camera size={24} color="#FFFFFF" />
                  </View>
                  <Text style={styles.actionText}>Photo</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => navigateToScreen('manual')}
                >
                  <View style={[styles.actionIcon, { backgroundColor: Colors.light.secondary }]}>
                    <Edit3 size={24} color="#FFFFFF" />
                  </View>
                  <Text style={styles.actionText}>Manual</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.recentTransactionsContainer}>
              <View style={styles.recentTransactionsHeader}>
                <Text style={styles.sectionTitle}>Recent Transactions</Text>
                <TouchableOpacity onPress={() => navigateToScreen('reports')}>
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>
              
              <TransactionList 
                transactions={transactions.slice(0, 5)} 
                currency={user?.currency}
              />
            </View>
          </>
        )}
      </ScrollView>
      
      <TouchableOpacity 
        style={[styles.fabButton, Platform.OS === 'web' ? styles.fabButtonWeb : null]}
        onPress={() => navigateToScreen('manual')}
      >
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>
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
  scrollContent: {
    paddingBottom: Platform.OS === 'web' ? 80 : 120,
  },
  welcomeContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
    marginTop: Platform.OS === 'web' ? 16 : 0,
  },
  welcomeText: {
    fontSize: 16,
    color: Colors.light.tabIconDefault,
    fontFamily: 'Inter-Regular',
  },
  businessText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.text,
    fontFamily: 'Inter-Bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  actionsContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 12,
    fontFamily: 'Inter-Bold',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    color: Colors.light.text,
    fontFamily: 'Inter-Medium',
  },
  recentTransactionsContainer: {
    paddingHorizontal: 16,
  },
  recentTransactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 14,
    color: Colors.light.primary,
    fontFamily: 'Inter-Medium',
  },
  fabButton: {
    position: 'absolute',
    bottom: Platform.OS === 'web' ? 20 : 90,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabButtonWeb: {
    bottom: 20,
  },
});