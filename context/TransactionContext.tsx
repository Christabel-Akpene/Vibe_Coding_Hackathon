import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction } from '@/types';
import { useAuth } from './AuthContext';
import { generateId } from '@/utils/mockData';

type TransactionContextType = {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  isLoading: boolean;
};

const TransactionContext = createContext<TransactionContextType>({
  transactions: [],
  addTransaction: () => {},
  isLoading: true,
});

export const useTransactions = () => useContext(TransactionContext);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load initial transactions
  useEffect(() => {
    if (user) {
      // In a real app, this would be an API call
      const storedTransactions = localStorage.getItem(`transactions_${user.id}`);
      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions));
      }
      setIsLoading(false);
    }
  }, [user]);

  // Save transactions when updated
  useEffect(() => {
    if (user) {
      localStorage.setItem(`transactions_${user.id}`, JSON.stringify(transactions));
    }
  }, [transactions, user]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: generateId(),
    };

    setTransactions(prev => [newTransaction, ...prev]);
  };

  return (
    <TransactionContext.Provider value={{ transactions, addTransaction, isLoading }}>
      {children}
    </TransactionContext.Provider>
  );
};