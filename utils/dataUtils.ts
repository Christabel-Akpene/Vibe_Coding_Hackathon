import { Transaction, CategoryData, ReportData, PeriodType, TransactionCategory } from '@/types';
import Colors from '@/constants/Colors';

// Category data with names, colors, and icons
export const categories: CategoryData[] = [
  { id: 'food', name: 'Food & Dining', color: '#FF9800', icon: 'restaurant' },
  { id: 'transport', name: 'Transport', color: '#2196F3', icon: 'car' },
  { id: 'utilities', name: 'Utilities', color: '#9C27B0', icon: 'flash' },
  { id: 'entertainment', name: 'Entertainment', color: '#E91E63', icon: 'tv' },
  { id: 'shopping', name: 'Shopping', color: '#00BCD4', icon: 'shopping-bag' },
  { id: 'other', name: 'Other', color: '#607D8B', icon: 'more-horizontal' },
];

// Get category details by ID
export const getCategoryById = (id: TransactionCategory): CategoryData => {
  const category = categories.find(cat => cat.id === id);
  return category || categories[categories.length - 1]; // Return "other" if not found
};

// Filter transactions by date range
export const filterTransactionsByDate = (
  transactions: Transaction[],
  startDate: Date,
  endDate: Date
): Transaction[] => {
  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= startDate && transactionDate <= endDate;
  });
};

// Get date range based on period type
export const getDateRange = (periodType: PeriodType): { startDate: Date, endDate: Date } => {
  const endDate = new Date();
  let startDate = new Date();
  
  switch (periodType) {
    case 'daily':
      startDate = new Date(endDate);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'weekly':
      startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - 7);
      break;
    case 'monthly':
      startDate = new Date(endDate);
      startDate.setMonth(endDate.getMonth() - 1);
      break;
    case 'yearly':
      startDate = new Date(endDate);
      startDate.setFullYear(endDate.getFullYear() - 1);
      break;
  }
  
  return { startDate, endDate };
};

// Generate report data based on transactions and period
export const generateReportData = (
  transactions: Transaction[],
  periodType: PeriodType
): ReportData => {
  const { startDate, endDate } = getDateRange(periodType);
  const filteredTransactions = filterTransactionsByDate(
    transactions,
    startDate,
    endDate
  );
  
  let income = 0;
  let expense = 0;
  let categoryTotals: Record<string, number> = {};
  
  // Initialize category totals
  categories.forEach(category => {
    categoryTotals[category.id] = 0;
  });
  
  // Calculate totals
  filteredTransactions.forEach(transaction => {
    if (transaction.type === 'income') {
      income += transaction.amount;
    } else {
      expense += transaction.amount;
      categoryTotals[transaction.category] += transaction.amount;
    }
  });
  
  // Format category data for charts
  const byCategory = Object.keys(categoryTotals)
    .filter(category => categoryTotals[category] > 0)
    .map(category => {
      const categoryInfo = getCategoryById(category as TransactionCategory);
      return {
        category: categoryInfo.name,
        amount: categoryTotals[category],
        color: categoryInfo.color,
      };
    });
  
  return {
    income,
    expense,
    balance: income - expense,
    byCategory,
    transactions: filteredTransactions,
  };
};

// Format currency based on user's settings
export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency 
  }).format(amount);
};

// Format date for display
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

// Parse amount from voice input
export const parseAmountFromVoice = (text: string): { 
  amount: number | null;
  type: 'income' | 'expense' | null;
  category: TransactionCategory | null;
} => {
  text = text.toLowerCase();
  
  // Default result
  let result = {
    amount: null,
    type: null as 'income' | 'expense' | null,
    category: null as TransactionCategory | null
  };
  
  // Extract amount
  const amountRegex = /(\d+)(\s*dollars|\s*usd)?/i;
  const amountMatch = text.match(amountRegex);
  
  if (amountMatch) {
    result.amount = parseFloat(amountMatch[1]);
  }
  
  // Determine transaction type
  if (/(earn|made|got|received|income|revenue)/i.test(text)) {
    result.type = 'income';
  } else if (/(spent|paid|bought|purchased|expense)/i.test(text)) {
    result.type = 'expense';
  }
  
  // Determine category
  if (/food|grocery|restaurant|eat|dinner|lunch|breakfast/i.test(text)) {
    result.category = 'food';
  } else if (/transport|gas|uber|lyft|taxi|car|bus|train/i.test(text)) {
    result.category = 'transport';
  } else if (/utility|electric|water|bill|internet|phone/i.test(text)) {
    result.category = 'utilities';
  } else if (/movie|entertainment|game|fun|concert|ticket/i.test(text)) {
    result.category = 'entertainment';
  } else if (/shop|buy|purchase|amazon|store/i.test(text)) {
    result.category = 'shopping';
  }
  
  return result;
};

// Generate CSV data for transactions
export const generateCSV = (transactions: Transaction[]): string => {
  const header = 'ID,Date,Type,Amount,Category,Method,Notes\n';
  
  const rows = transactions.map(transaction => {
    return [
      transaction.id,
      formatDate(transaction.date),
      transaction.type,
      transaction.amount,
      transaction.category,
      transaction.method,
      `"${transaction.notes.replace(/"/g, '""')}"`
    ].join(',');
  }).join('\n');
  
  return header + rows;
};