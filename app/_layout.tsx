// app/_layout.tsx
import { Stack } from "expo-router";
import { I18nextProvider } from 'react-i18next'; // ⭐️ Import the provider
import { CartProvider } from "../context/CartContext"; // Correct path to CartContext
import { OrderProvider } from '../context/OrderContext';
import { UserProvider } from '../context/UserContext';
import i18n from '../i18n'; // ⭐️ Import the config file
export default function RootLayout() {
  return (
    // Wrap the entire Stack navigator with CartProvider
    // This ensures all nested routes and screens have access to the cart context
   
    <I18nextProvider i18n={i18n}>
      <UserProvider>
          <CartProvider>
            <OrderProvider>
              <Stack screenOptions={{ headerShown: false }}>
                {/* The (tabs) group contains home, food, settings */}
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                {/* Other independent screens */}
                <Stack.Screen name="login" options={{ headerShown: false }} />
                <Stack.Screen name="registration" options={{ headerShown: false }} />
                {/* Food detail page - needs cart context */}
                <Stack.Screen name="food/[id]" options={{ headerShown: false }} />
                {/* Cart screen - needs cart context */}
                <Stack.Screen name="cart" options={{ headerShown: false }} />
                <Stack.Screen name="checkout" options={{ headerShown: false }} />
              </Stack>
            </OrderProvider>
          </CartProvider>
        </UserProvider>
    </I18nextProvider>    
  );
}
