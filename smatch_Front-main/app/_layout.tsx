import { Stack } from "expo-router";
import Toast from 'react-native-toast-message';
import './globals.css';
import { toastConfig } from '../components/toastConfig';
import { CartProvider } from '../contexts/CartContext';

export default function RootLayout() {
  return (
    <CartProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="search" options={{ headerShown: false }} />
        <Stack.Screen name="notifications" options={{ headerShown: false }} />
        <Stack.Screen name="matches/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="tournois/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
        <Stack.Screen name="matches/create-match" options={{ headerShown: false }} />
        <Stack.Screen name="shop/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="shop/panier" options={{ headerShown: false }} />
        <Stack.Screen name="profileUser/editProfile" options={{ headerShown: false }} />
      </Stack>
      <Toast config={toastConfig} />
    </CartProvider>
  );
}