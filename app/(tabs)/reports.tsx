import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';
import Header from '@/components/Header';
import TransactionList from '@/components/TransactionList';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { getUserTransactions } from '@/utils/mockData';
import { generateReportData, generateCSV, formatCurrency } from '@/utils/dataUtils';
import { PeriodType, Transaction } from '@/types';
import { Download, Calendar } from 'lucide-react-native';

export default function ReportsScreen() {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('monthly');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [reportData, setReportData] = useState<any>({
    income: 0,
    expense: 0,
    balance: 0,
    byCategory: [],
    transactions: [],
  });
  const screenWidth = Dimensions.get('window').width;

  // Load transactions
  useEffect(() => {
    if (user) {
      // This would be an API call in a real app
      const userTransactions = getUserTransactions(user.id);
      setTransactions(userTransactions);
    }
  }, [user]);

  // Generate report when period or transactions change
  useEffect(() => {
    if (transactions.length) {
      const report = generateReportData(transactions, selectedPeriod);
      setReportData(report);
    }
  }, [selectedPeriod, transactions]);

  const handleExportCSV = () => {
    if (reportData.transactions.length) {
      // In a web environment, this would download the file
      const csv = generateCSV(reportData.transactions);
      
      if (typeof window !== 'undefined') {
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `expense-tracker-${selectedPeriod}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  const chartConfig = {
    backgroundColor: Colors.light.background,
    backgroundGradientFrom: Colors.light.background,
    backgroundGradientTo: Colors.light.background,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: Colors.light.primary,
    },
  };

  // Prepare data for pie chart
  const pieChartData = reportData.byCategory.map((item: any) => ({
    name: item.category,
    value: item.amount,
    color: item.color,
    legendFontColor: '#7F7F7F',
    legendFontSize: 12,
  }));

  // Prepare data for bar chart
  const barChartData = {
    labels: ['Income', 'Expense'],
    datasets: [
      {
        data: [reportData.income, reportData.expense],
        colors: [
          (opacity = 1) => Colors.light.income,
          (opacity = 1) => Colors.light.expense,
        ],
      },
    ],
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header 
        title="Reports" 
        rightComponent={
          <TouchableOpacity 
            style={styles.exportButton}
            onPress={handleExportCSV}
            disabled={!reportData.transactions.length}
          >
            <Download size={20} color={Colors.light.text} />
          </TouchableOpacity>
        }
      />
      
      <View style={styles.periodSelector}>
        <TouchableOpacity
          style={[
            styles.periodButton,
            selectedPeriod === 'daily' ? styles.periodButtonActive : null,
          ]}
          onPress={() => setSelectedPeriod('daily')}
        >
          <Text
            style={[
              styles.periodButtonText,
              selectedPeriod === 'daily' ? styles.periodButtonTextActive : null,
            ]}
          >
            Day
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.periodButton,
            selectedPeriod === 'weekly' ? styles.periodButtonActive : null,
          ]}
          onPress={() => setSelectedPeriod('weekly')}
        >
          <Text
            style={[
              styles.periodButtonText,
              selectedPeriod === 'weekly' ? styles.periodButtonTextActive : null,
            ]}
          >
            Week
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.periodButton,
            selectedPeriod === 'monthly' ? styles.periodButtonActive : null,
          ]}
          onPress={() => setSelectedPeriod('monthly')}
        >
          <Text
            style={[
              styles.periodButtonText,
              selectedPeriod === 'monthly' ? styles.periodButtonTextActive : null,
            ]}
          >
            Month
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.periodButton,
            selectedPeriod === 'yearly' ? styles.periodButtonActive : null,
          ]}
          onPress={() => setSelectedPeriod('yearly')}
        >
          <Text
            style={[
              styles.periodButtonText,
              selectedPeriod === 'yearly' ? styles.periodButtonTextActive : null,
            ]}
          >
            Year
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Summary</Text>
          
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Income</Text>
              <Text style={[styles.summaryValue, styles.incomeText]}>
                {formatCurrency(reportData.income, user?.currency)}
              </Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Expenses</Text>
              <Text style={[styles.summaryValue, styles.expenseText]}>
                {formatCurrency(reportData.expense, user?.currency)}
              </Text>
            </View>
          </View>
          
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>Balance</Text>
            <Text
              style={[
                styles.balanceValue,
                reportData.balance >= 0 ? styles.incomeText : styles.expenseText,
              ]}
            >
              {formatCurrency(reportData.balance, user?.currency)}
            </Text>
          </View>
        </View>
        
        {reportData.transactions.length > 0 ? (
          <>
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Income vs Expenses</Text>
              <BarChart
                data={barChartData}
                width={screenWidth - 32}
                height={220}
                chartConfig={{
                  ...chartConfig,
                  barPercentage: 0.6,
                }}
                style={[styles.chart, { transformOrigin: 'center' }]}
              />
            </View>
            
            {reportData.byCategory.length > 0 && (
              <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>Expenses by Category</Text>
                <PieChart
                  data={pieChartData}
                  width={screenWidth - 32}
                  height={220}
                  chartConfig={chartConfig}
                  accessor="value"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  style={[styles.chart, { transformOrigin: 'center' }]}
                />
              </View>
            )}
            
            <View style={styles.transactionsContainer}>
              <Text style={styles.transactionsTitle}>Transactions</Text>
              <TransactionList 
                transactions={reportData.transactions} 
                currency={user?.currency}
              />
            </View>
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Calendar size={60} color={Colors.light.tabIconDefault} />
            <Text style={styles.emptyText}>No transactions for this period</Text>
            <Text style={styles.emptySubtext}>
              Add some transactions to see your reports
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  exportButton: {
    padding: 8,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  periodButtonActive: {
    backgroundColor: Colors.light.primary,
  },
  periodButtonText: {
    fontSize: 14,
    color: Colors.light.text,
    fontFamily: 'Inter-Medium',
  },
  periodButtonTextActive: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    marginTop: 16,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors.light.text,
    fontFamily: 'Inter-Bold',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryItem: {
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
  incomeText: {
    color: Colors.light.income,
  },
  expenseText: {
    color: Colors.light.expense,
  },
  balanceContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.light.card,
    paddingTop: 16,
  },
  balanceLabel: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    marginBottom: 4,
    fontFamily: 'Inter-Regular',
  },
  balanceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: Colors.light.text,
    fontFamily: 'Inter-Bold',
  },
  chart: {
    borderRadius: 8,
    paddingVertical: 8,
  },
  transactionsContainer: {
    padding: 16,
  },
  transactionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors.light.text,
    fontFamily: 'Inter-Bold',
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
    marginTop: 16,
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