export type TransactionType = 'income' | 'expense';

export type TransactionCategory = 
  | 'food'
  | 'transport'
  | 'utilities'
  | 'entertainment'
  | 'shopping'
  | 'other';

export type TransactionMethod = 
  | 'cash'
  | 'card'
  | 'bank'
  | 'mobile'
  | 'other';

export type Transaction = {
  id: string;
  userId: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  date: string;
  method: TransactionMethod;
  notes: string;
  receiptImage?: string;
};

export type CategoryData = {
  id: TransactionCategory;
  name: string;
  color: string;
  icon: string;
};

export type PeriodType = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface ReportData {
  income: number;
  expense: number;
  balance: number;
  byCategory: {
    category: string;
    amount: number;
    color: string;
  }[];
  transactions: Transaction[];
}