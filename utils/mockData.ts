import { Transaction, TransactionType, TransactionCategory, TransactionMethod } from '@/types';

// Generate a random ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

// Generate a random date within the last 30 days
const generateDate = (): string => {
  const now = new Date();
  const pastDate = new Date(now.setDate(now.getDate() - Math.floor(Math.random() * 30)));
  return pastDate.toISOString();
};

// Random amount between 1 and 500
const generateAmount = (): number => {
  return Math.floor(Math.random() * 500) + 1;
};

// Random transaction type
const generateType = (): TransactionType => {
  return Math.random() > 0.5 ? 'income' : 'expense';
};

// Random transaction category
const generateCategory = (): TransactionCategory => {
  const categories: TransactionCategory[] = ['food', 'transport', 'utilities', 'entertainment', 'shopping', 'other'];
  return categories[Math.floor(Math.random() * categories.length)];
};

// Random transaction method
const generateMethod = (): TransactionMethod => {
  const methods: TransactionMethod[] = ['cash', 'card', 'bank', 'mobile', 'other'];
  return methods[Math.floor(Math.random() * methods.length)];
};

// Generate a random note
const generateNote = (): string => {
  const notes = [
    'Grocery shopping',
    'Gas station',
    'Coffee shop',
    'Restaurant bill',
    'Uber ride',
    'Movie tickets',
    'Online purchase',
    'Client payment',
    'Subscription fee',
    'Utility bill'
  ];
  return notes[Math.floor(Math.random() * notes.length)];
};

// Generate a random transaction
export const generateTransaction = (userId: string): Transaction => {
  return {
    id: generateId(),
    userId,
    amount: generateAmount(),
    type: generateType(),
    category: generateCategory(),
    date: generateDate(),
    method: generateMethod(),
    notes: generateNote(),
  };
};

// Generate multiple random transactions
export const generateTransactions = (userId: string, count: number): Transaction[] => {
  return Array.from({ length: count }).map(() => generateTransaction(userId));
};

// Mock transactions data
export const mockTransactions: Transaction[] = generateTransactions('1', 20);

// Get transactions for a user
export const getUserTransactions = (userId: string): Transaction[] => {
  return mockTransactions.filter(transaction => transaction.userId === userId);
};