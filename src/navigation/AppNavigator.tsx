import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { useCartStore } from '../store/cartStore';

import HomeScreen from '../screens/HomeScreen';
import ShopScreen from '../screens/ShopScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CollectionScreen from '../screens/CollectionScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import WishlistScreen from '../screens/WishlistScreen';
import AccountScreen from '../screens/AccountScreen';
import FitQuizScreen from '../screens/FitQuizScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: theme.colors.background,
    card: theme.colors.background,
    text: theme.colors.text,
    border: theme.colors.border,
  },
};

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Collection" component={CollectionScreen} />
      <Stack.Screen name="FitQuiz" component={FitQuizScreen} />
    </Stack.Navigator>
  );
}

function ShopStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Shop" component={ShopScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Collection" component={CollectionScreen} />
    </Stack.Navigator>
  );
}

function CartStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
    </Stack.Navigator>
  );
}

function AccountStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Account" component={AccountScreen} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const totalQuantity = useCartStore((s) => s.totalQuantity);

  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: '#C9A96E',
          tabBarInactiveTintColor: '#333',
          tabBarShowLabel: true,
          tabBarLabelStyle: styles.tabLabel,
        }}
      >
        <Tab.Screen
          name="HomeTab"
          component={HomeStack}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'home' : 'home-outline'} size={20} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="ShopTab"
          component={ShopStack}
          options={{
            tabBarLabel: 'Shop',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'grid' : 'grid-outline'} size={20} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="WishlistTab"
          component={WishlistScreen}
          options={{
            tabBarLabel: 'Saved',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'heart' : 'heart-outline'} size={20} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="CartTab"
          component={CartStack}
          options={{
            tabBarLabel: 'Bag',
            tabBarIcon: ({ color, focused }) => (
              <View>
                <Ionicons name={focused ? 'bag-handle' : 'bag-handle-outline'} size={20} color={color} />
                {totalQuantity > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{totalQuantity}</Text>
                  </View>
                )}
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="AccountTab"
          component={AccountStack}
          options={{
            tabBarLabel: 'Account',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'person' : 'person-outline'} size={20} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#000',
    borderTopColor: '#141414',
    borderTopWidth: 1,
    height: 72,
    paddingBottom: 12,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 9,
    letterSpacing: 1.5,
    marginTop: 2,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: theme.colors.accent,
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#000',
    fontSize: 9,
    fontWeight: 'bold',
  },
});
