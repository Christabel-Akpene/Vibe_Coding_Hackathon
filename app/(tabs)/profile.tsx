import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';
import Header from '@/components/Header';
import { User, Settings, Shield, CircleHelp as HelpCircle, LogOut, CreditCard } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  const handleLogout = () => {
    // In a real app, we might want to confirm logout
    signOut();
  };

  const showFeatureNotImplemented = () => {
    Alert.alert(
      'Feature Not Implemented',
      'This feature is not implemented in the current version.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Profile" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.userInfoContainer}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0) || 'U'}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
          <Text style={styles.businessName}>
            {user?.businessName || 'Your Business'}
          </Text>
        </View>
        
        <View style={styles.sectionsContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={showFeatureNotImplemented}
            >
              <View style={styles.menuItemIcon}>
                <User size={22} color={Colors.light.text} />
              </View>
              <Text style={styles.menuItemText}>Personal Information</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={showFeatureNotImplemented}
            >
              <View style={styles.menuItemIcon}>
                <CreditCard size={22} color={Colors.light.text} />
              </View>
              <Text style={styles.menuItemText}>Business Details</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={showFeatureNotImplemented}
            >
              <View style={styles.menuItemIcon}>
                <Settings size={22} color={Colors.light.text} />
              </View>
              <Text style={styles.menuItemText}>Preferences</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Security</Text>
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={showFeatureNotImplemented}
            >
              <View style={styles.menuItemIcon}>
                <Shield size={22} color={Colors.light.text} />
              </View>
              <Text style={styles.menuItemText}>Change Password</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support</Text>
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={showFeatureNotImplemented}
            >
              <View style={styles.menuItemIcon}>
                <HelpCircle size={22} color={Colors.light.text} />
              </View>
              <Text style={styles.menuItemText}>Help & Support</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <LogOut size={22} color={Colors.light.secondary} />
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
          
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
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
  userInfoContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 4,
    fontFamily: 'Inter-Bold',
  },
  userEmail: {
    fontSize: 16,
    color: Colors.light.tabIconDefault,
    marginBottom: 8,
    fontFamily: 'Inter-Regular',
  },
  businessName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.primary,
    fontFamily: 'Inter-Medium',
  },
  sectionsContainer: {
    paddingHorizontal: 16,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 16,
    fontFamily: 'Inter-Bold',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.card,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: 'Inter-Regular',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.secondary,
    marginLeft: 8,
    fontFamily: 'Inter-Bold',
  },
  versionText: {
    textAlign: 'center',
    color: Colors.light.tabIconDefault,
    marginBottom: 30,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
});