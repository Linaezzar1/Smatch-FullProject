import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { useCart } from '../../contexts/CartContext';
import OrderService from '../../services/OrderService';

interface CartItem {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

const Panier = () => {
  const router = useRouter();
  const { cartItems, updateQuantity, removeItem, clearCart } = useCart();
  const [imageLoading, setImageLoading] = useState<{ [key: string]: boolean }>({});
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const total = cartItems
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toFixed(2);

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Panier vide',
        text2: 'Ajoutez des produits avant de passer une commande.',
      });
      return;
    }

    // Validate ObjectId format for product IDs
    const invalidItems = cartItems.filter((item) => !/^[0-9a-fA-F]{24}$/.test(item._id));
    if (invalidItems.length > 0) {
      Toast.show({
        type: 'error',
        text1: 'Produits invalides',
        text2: 'Certains produits ont des identifiants invalides.',
      });
      return;
    }

    setIsCheckingOut(true);
    try {
      // TODO: Replace with a valid ObjectId from your users collection
      const userId = '507f1f77bcf86cd799439011'; // Example valid ObjectId
      if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
        throw new Error('Identifiant utilisateur invalide');
      }

      const orderData = {
        user: userId,
        products: cartItems.map((item) => item._id), // Send ObjectId array
        quantities: cartItems.map((item) => item.quantity), // Separate quantities (optional)
        total: parseFloat(total),
      };

      console.log('Order Payload:', JSON.stringify(orderData, null, 2));
      await OrderService.createOrder(orderData);
      clearCart();
      Toast.show({
        type: 'success',
        text1: 'Commande passée',
        text2: 'Votre commande a été enregistrée avec succès !',
      });
      router.push('/(tabs)/boutique');
    } catch (error: any) {
      console.error('Erreur lors de la commande:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Échec de la commande. Veuillez réessayer.';
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: errorMessage,
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  const renderItem = ({ item, index }: { item: CartItem; index: number }) => (
    <Animated.View
      entering={FadeInDown.duration(300).delay(index * 100)}
      style={styles.itemContainer}
    >
      <View style={styles.imageContainer}>
        {imageLoading[item._id] && (
          <ActivityIndicator style={styles.imageLoader} color="#1e90ff" />
        )}
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.image}
          resizeMode="cover"
          onLoadStart={() => setImageLoading((prev) => ({ ...prev, [item._id]: true }))}
          onLoadEnd={() => setImageLoading((prev) => ({ ...prev, [item._id]: false }))}
          accessible
          accessibilityLabel={`Image de ${item.name}`}
        />
      </View>
      <View style={styles.info}>
        <Text
          style={styles.name}
          accessible
          accessibilityLabel={`Produit: ${item.name}`}
        >
          {item.name}
        </Text>
        <Text
          style={styles.price}
          accessible
          accessibilityLabel={`Prix: $${(item.price * item.quantity).toFixed(2)}`}
        >
          ${(item.price * item.quantity).toFixed(2)}
        </Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(item._id, -1)}
            disabled={item.quantity <= 1}
            accessible
            accessibilityLabel={`Diminuer la quantité de ${item.name}`}
          >
            <Ionicons
              name="remove"
              size={20}
              color={item.quantity <= 1 ? '#6b7280' : '#fff'}
            />
          </TouchableOpacity>
          <Text
            style={styles.quantity}
            accessible
            accessibilityLabel={`Quantité: ${item.quantity}`}
          >
            {item.quantity}
          </Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(item._id, 1)}
            accessible
            accessibilityLabel={`Augmenter la quantité de ${item.name}`}
          >
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeItem(item._id, item.name)}
        accessible
        accessibilityLabel={`Supprimer ${item.name} du panier`}
      >
        <Ionicons name="trash-outline" size={24} color="#EF4444" />
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/(tabs)/boutique')}
          accessible
          accessibilityLabel="Retour à la boutique"
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Mon Panier</Text>
      </View>

      {cartItems.length === 0 ? (
        <Animated.View
          entering={FadeInDown.duration(300)}
          style={styles.emptyContainer}
        >
          <Text style={styles.emptyText}>Votre panier est vide 🛒</Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => router.push('/(tabs)/boutique')}
            accessible
            accessibilityLabel="Commencer vos achats"
          >
            <Text style={styles.shopButtonText}>Acheter maintenant</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
          <Animated.View
            entering={FadeInDown.duration(300).delay(200)}
            style={styles.totalContainer}
          >
            <Text style={styles.totalText}>Total: ${total}</Text>
            <TouchableOpacity
              style={[
                styles.checkoutButton,
                (isCheckingOut || cartItems.length === 0) && styles.checkoutButtonDisabled,
              ]}
              onPress={handleCheckout}
              disabled={isCheckingOut || cartItems.length === 0}
              accessible
              accessibilityLabel="Passer à la caisse"
            >
              {isCheckingOut ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.checkoutText}>Commander</Text>
              )}
            </TouchableOpacity>
          </Animated.View>
        </>
      )}
    </SafeAreaView>
  );
};

export default Panier;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e32',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    backgroundColor: '#2a2a40',
    padding: 12,
    borderRadius: 12,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  emptyText: {
    color: '#a0a0b0',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  shopButton: {
    backgroundColor: '#1e90ff',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#2a2a40',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  imageContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#3a3a50',
    borderRadius: 12,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  imageLoader: {
    position: 'absolute',
  },
  info: {
    flex: 1,
  },
  name: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  price: {
    color: '#ff6200',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantity: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    width: 40,
    textAlign: 'center',
  },
  quantityButton: {
    backgroundColor: '#3a3a50',
    borderRadius: 8,
    padding: 8,
    marginHorizontal: 8,
  },
  removeButton: {
    padding: 8,
  },
  totalContainer: {
    borderTopWidth: 1,
    borderTopColor: '#3a3a50',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  totalText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'right',
  },
  checkoutButton: {
    backgroundColor: '#1e90ff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  checkoutButtonDisabled: {
    backgroundColor: '#6b7280',
    opacity: 0.6,
  },
  checkoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});