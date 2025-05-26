import { Tabs } from 'expo-router';
import { Platform, Pressable, View, StyleSheet } from 'react-native';
import { LayoutDashboard, Mic, Camera, KeyRound, ChartBar as BarChart3, User } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import React, { useEffect } from 'react';
import { router } from 'expo-router';

export default function TabLayout() {
  const { user } = useAuth();
  
  // Protect routes - redirect to auth if not logged in
  useEffect(() => {
    if (!user) {
      router.replace('/auth');
    }
  }, [user]);

  if (!user) return null;
  
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: Colors.light.primary,
        tabBarInactiveTintColor: Colors.light.tabIconDefault,
        tabBarStyle: {
          height: 70,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Inter-Medium',
        },
        tabBarIconStyle: {
          marginBottom: -4,
        },
      })}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <LayoutDashboard size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="voice"
        options={{
          title: 'Voice',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Mic size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: 'Photo',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Camera size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="manual"
        options={{
          title: 'Manual',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <KeyRound size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Reports',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <BarChart3 size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <User size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 70,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    paddingTop: 10,
  },
  tabLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  tabIcon: {
    marginBottom: -4,
  },
});