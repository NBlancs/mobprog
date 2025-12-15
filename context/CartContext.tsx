// context/CartContext.tsx
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Alert } from 'react-native';

// Define the type for a food item in the cart
export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: any; // For `require` images, the type is number
  quantity: number;
}

// Define the shape of the CartContext
interface CartContextType {
  cart: CartItem[];
  addToCart: (food: Omit<CartItem, 'quantity'>) => void; // Food without quantity initially
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
}

// Create the context with a default (empty) value
const CartContext = createContext<CartContextType | undefined>(undefined);

// Create a provider component to wrap your app
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (food: Omit<CartItem, 'quantity'>) => {
  const formattedFood = {
    ...food,
    image: typeof food.image === "string"
      ? { uri: food.image }   // Convert URL to correct format
      : food.image
  };

  setCart(prevCart => {
    const existingItem = prevCart.find(item => item.id === formattedFood.id);

    if (existingItem) {
      return prevCart.map(item =>
        item.id === formattedFood.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }

    Alert.alert("Added to Cart", `${food.name} has been added to your cart.`);
    return [...prevCart, { ...formattedFood, quantity: 1 }];
  });
};

  const removeFromCart = (id: number) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item from your cart?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          onPress: () => setCart((prevCart) => prevCart.filter((item) => item.id !== id)),
          style: "destructive",
        },
      ]
    );
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id); // Remove if quantity drops to 0 or below
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: quantity } : item
      )
    );
  };

  const clearCart = () => {
    Alert.alert(
      "Clear Cart",
      "Are you sure you want to clear your entire cart?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          onPress: () => setCart([]),
          style: "destructive",
        },
      ]
    );
  };

  // Calculate total price of items in cart
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  // Calculate total number of items (sum of quantities)
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for easier access to cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider'); // This is the error message you saw
  }
  return context;
};