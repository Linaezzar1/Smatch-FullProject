import React, { createContext, useContext, useState } from 'react';
import { Product } from '@/models/Product';
import Toast from 'react-native-toast-message';

interface CartItem {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  updateQuantity: (_id: string, delta: number) => void;
  removeItem: (_id: string, name: string) => void;
  getCartCount: () => number;
  clearCart: () => void; // Added clearCart
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    if (!product._id) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Produit invalide : ID manquant',
      });
      return;
    }

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item._id === product._id);
      if (existingItem) {
        return prevItems.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prevItems,
        {
          _id: product._id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl || 'https://via.placeholder.com/150',
          quantity: 1,
        },
      ];
    });

    Toast.show({
      type: 'success',
      text1: 'Produit ajouté',
      text2: `${product.name} a été ajouté au panier 🛒`,
    });
  };

  const updateQuantity = (_id: string, delta: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === _id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (_id: string, name: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== _id));
    Toast.show({
      type: 'success',
      text1: 'Produit supprimé',
      text2: `${name} a été retiré du panier`,
    });
  };

  const getCartCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const clearCart = () => {
    setCartItems([]);
    Toast.show({
      type: 'info',
      text1: 'Panier vidé',
      text2: 'Votre panier a été vidé.',
    });
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, updateQuantity, removeItem, getCartCount, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};