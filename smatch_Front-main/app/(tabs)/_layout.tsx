import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserService from '@/services/UserService';

const _layout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkLogin = async () => {
      const result = await UserService.isLoggedIn();
      setIsLoggedIn(result);
    };
    checkLogin();
  }, []);

  if (isLoggedIn === null) return null;

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#1e1e32',
          borderTopWidth: 0,
          height: 70,
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarActiveTintColor: '#1e90ff',
        tabBarInactiveTintColor: '#888',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
          marginBottom: 5,
        },
        tabBarIconStyle: {
          marginTop: 5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="listTournoi"
        options={{
          title: 'Tournois',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trophy-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="boutique"
        options={{
          title: 'Boutique',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                top: -15,
                width: 60,
                height: 60,
                backgroundColor: focused ? '#1e90ff' : '#1e90ff',
                borderRadius: 30,
                borderWidth: 2,
                borderColor: '#fff',
              }}
            >
              <Ionicons
                name="cart-outline"
                size={focused ? 32 : 28}
                color="#fff"
              />
            </View>
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: 'bold',
          },
        }}
      />
      <Tabs.Screen
        name="listMatches"
        options={{
          title: 'Matches',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: isLoggedIn ? 'Profil' : 'Connexion',
          headerShown: false,
          tabBarIcon: ({ color, size }) =>
            isLoggedIn ? (
              <Ionicons name="person-outline" size={size} color={color} />
            ) : (
              <Ionicons name="log-in-outline" size={size} color={color} />
            ),
        }}
      />
    </Tabs>
  );
};

export default _layout;

const styles = StyleSheet.create({});