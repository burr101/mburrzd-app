import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import AppNavigator from './src/navigation/AppNavigator';
import { useCartStore } from './src/store/cartStore';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [ready, setReady] = useState(false);
  const initCart = useCartStore((s) => s.initCart);

  useEffect(() => {
    initCart()
      .catch(() => {})
      .finally(async () => {
        setReady(true);
        await SplashScreen.hideAsync();
      });
  }, []);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppNavigator />
    </GestureHandlerRootView>
  );
}
