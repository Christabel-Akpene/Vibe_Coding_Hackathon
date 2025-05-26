import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';
import Header from '@/components/Header';
import { Mic, Check, X } from 'lucide-react-native';
import { parseAmountFromVoice, formatCurrency, getCategoryById } from '@/utils/dataUtils';
import { router } from 'expo-router';
import { Transaction, TransactionCategory, TransactionType } from '@/types';

export default function VoiceScreen() {
  const { user } = useAuth();
  const [isListening, setIsListening] = useState(false);
  const [speechText, setSpeechText] = useState('');
  const [parsedData, setParsedData] = useState<{
    amount: number | null;
    type: TransactionType | null;
    category: TransactionCategory | null;
  }>({
    amount: null,
    type: null,
    category: null,
  });
  const [isSaving, setIsSaving] = useState(false);
  
  // Web Speech API setup for web platform
  useEffect(() => {
    if (Platform.OS === 'web') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setSpeechText(transcript);
          setIsListening(false);
          
          // Parse the transcript
          const parsed = parseAmountFromVoice(transcript);
          setParsedData(parsed);
        };
        
        recognition.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
        };
        
        recognition.onend = () => {
          setIsListening(false);
        };
        
        // Start/stop listening based on isListening state
        if (isListening) {
          recognition.start();
        }
        
        return () => {
          if (recognition) {
            recognition.stop();
          }
        };
      }
    }
  }, [isListening]);
  
  const startListening = () => {
    setSpeechText('');
    setParsedData({
      amount: null,
      type: null,
      category: null,
    });
    setIsListening(true);
  };
  
  const saveTransaction = () => {
    if (parsedData.amount && parsedData.type) {
      setIsSaving(true);
      
      // This would be an API call in a real app
      setTimeout(() => {
        // Create transaction object
        const newTransaction: Partial<Transaction> = {
          userId: user?.id || '',
          amount: parsedData.amount || 0,
          type: parsedData.type || 'expense',
          category: parsedData.category || 'other',
          date: new Date().toISOString(),
          method: 'cash',
          notes: speechText,
        };
        
        // Navigate back to dashboard
        router.replace('/(tabs)');
        setIsSaving(false);
      }, 1000);
    }
  };
  
  const cancelTransaction = () => {
    setSpeechText('');
    setParsedData({
      amount: null,
      type: null,
      category: null,
    });
  };
  
  // If not on web platform, show platform notice
  if (Platform.OS !== 'web') {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title="Voice Input" />
        <View style={styles.centeredContainer}>
          <Text style={styles.platformNotice}>
            Voice input is currently only available on the web platform.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Voice Input" />
      
      <View style={styles.contentContainer}>
        {!speechText ? (
          <>
            <Text style={styles.instructionText}>
              Tap the microphone and say something like:
            </Text>
            <Text style={styles.exampleText}>
              "I spent 25 dollars on food"
            </Text>
            <Text style={styles.exampleText}>
              "Made 100 dollars from a client"
            </Text>
            <TouchableOpacity
              style={[
                styles.micButton,
                isListening ? styles.micButtonActive : null
              ]}
              onPress={startListening}
              disabled={isListening}
            >
              <Mic 
                size={40} 
                color="#FFFFFF" 
                strokeWidth={isListening ? 3 : 2} 
              />
            </TouchableOpacity>
            {isListening && (
              <Text style={styles.listeningText}>Listening...</Text>
            )}
          </>
        ) : (
          <View style={styles.resultContainer}>
            <Text style={styles.heardText}>I heard:</Text>
            <Text style={styles.speechText}>{speechText}</Text>
            
            <View style={styles.parsedContainer}>
              {parsedData.amount !== null && (
                <View style={styles.parsedItem}>
                  <Text style={styles.parsedLabel}>Amount:</Text>
                  <Text style={styles.parsedValue}>
                    {formatCurrency(parsedData.amount, user?.currency)}
                  </Text>
                </View>
              )}
              
              {parsedData.type !== null && (
                <View style={styles.parsedItem}>
                  <Text style={styles.parsedLabel}>Type:</Text>
                  <Text 
                    style={[
                      styles.parsedValue,
                      parsedData.type === 'income' ? styles.incomeText : styles.expenseText
                    ]}
                  >
                    {parsedData.type.charAt(0).toUpperCase() + parsedData.type.slice(1)}
                  </Text>
                </View>
              )}
              
              {parsedData.category !== null && (
                <View style={styles.parsedItem}>
                  <Text style={styles.parsedLabel}>Category:</Text>
                  <Text style={styles.parsedValue}>
                    {getCategoryById(parsedData.category).name}
                  </Text>
                </View>
              )}
            </View>
            
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={cancelTransaction}
                disabled={isSaving}
              >
                <X size={24} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.saveButton,
                  (!parsedData.amount || !parsedData.type) ? styles.disabledButton : null
                ]}
                onPress={saveTransaction}
                disabled={!parsedData.amount || !parsedData.type || isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Check size={24} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>Save</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={startListening}
              disabled={isListening || isSaving}
            >
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  instructionText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
    color: Colors.light.text,
    fontFamily: 'Inter-Regular',
  },
  exampleText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
    color: Colors.light.tabIconDefault,
    fontStyle: 'italic',
    fontFamily: 'Inter-Regular',
  },
  micButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  micButtonActive: {
    backgroundColor: Colors.light.secondary,
    transform: [{ scale: 1.1 }],
  },
  listeningText: {
    marginTop: 20,
    fontSize: 16,
    color: Colors.light.primary,
    fontFamily: 'Inter-Medium',
  },
  resultContainer: {
    width: '100%',
    alignItems: 'center',
  },
  heardText: {
    fontSize: 16,
    color: Colors.light.tabIconDefault,
    marginBottom: 8,
    fontFamily: 'Inter-Regular',
  },
  speechText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'Inter-Bold',
  },
  parsedContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    width: '100%',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  parsedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.card,
  },
  parsedLabel: {
    fontSize: 16,
    color: Colors.light.tabIconDefault,
    fontFamily: 'Inter-Regular',
  },
  parsedValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
    fontFamily: 'Inter-Bold',
  },
  incomeText: {
    color: Colors.light.income,
  },
  expenseText: {
    color: Colors.light.expense,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
  },
  saveButton: {
    backgroundColor: Colors.light.primary,
  },
  cancelButton: {
    backgroundColor: Colors.light.secondary,
  },
  disabledButton: {
    opacity: 0.5,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  retryButton: {
    padding: 12,
  },
  retryText: {
    color: Colors.light.accent,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  platformNotice: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.light.text,
    fontFamily: 'Inter-Regular',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});