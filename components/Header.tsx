import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { LogOut } from 'lucide-react-native';
import Colors from '@/constants/Colors';

type HeaderProps = {
  title: string;
  showLogout?: boolean;
  rightComponent?: React.ReactNode;
};

export default function Header({ title, showLogout = false, rightComponent }: HeaderProps) {
  const { signOut } = useAuth();

  return (
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
      
      <View style={styles.rightContainer}>
        {rightComponent}
        
        {showLogout && (
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={signOut}
          >
            <LogOut size={24} color={Colors.light.text} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: Colors.light.background,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    fontFamily: 'Inter-Bold',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    padding: 8,
  },
});