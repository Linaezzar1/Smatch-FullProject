import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import ProductService from '../../services/ProductService';
import { Product } from '@/models/Product';
import { useCart } from '../../contexts/CartContext';

const ProductDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = async () => {
    if (!id || Array.isArray(id)) {
      setError('Identifiant de produit invalide');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await ProductService.getProductById(id);
      setProduct(response.data);
      setError(null);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Échec du chargement du produit';
      console.error('Erreur lors de la récupération du produit:', err);
      setError(message);
      Alert.alert('Erreur', message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Animated.View entering={FadeInDown.duration(300)} style={styles.centered}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push('/(tabs)/boutique')}
            accessible
            accessibilityLabel="Retour à la boutique"
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <ActivityIndicator size="large" color="#1e90ff" />
          <Text style={styles.errorText}>Chargement du produit...</Text>
        </Animated.View>
      </SafeAreaView>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView style={styles.container}>
        <Animated.View entering={FadeInDown.duration(300)} style={styles.centered}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push('/(tabs)/boutique')}
            accessible
            accessibilityLabel="Retour à la boutique"
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.errorText}>{error || 'Produit non trouvé'}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchProduct}
            accessible
            accessibilityLabel="Réessayer"
          >
            <Text style={styles.retryButtonText}>Réessayer</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    );
  }

  const isInStock = product.stock !== 'Out of Stock';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/(tabs)/boutique')}
          accessible
          accessibilityLabel="Retour à la boutique"
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Animated.View entering={FadeIn.duration(500)} style={styles.card}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: product.imageUrl || 'https://via.placeholder.com/150' }}
              style={styles.image}
              resizeMode="cover"
              accessible
              accessibilityLabel={`Image de ${product.name}`}
            />
          </View>

          <View style={styles.content}>
            <Text
              style={styles.category}
              accessible
              accessibilityLabel={`Catégorie: ${product.category?.name || 'Non spécifiée'}`}
            >
              {product.category?.name || 'Non spécifiée'}
            </Text>
            <Text
              style={styles.title}
              accessible
              accessibilityLabel={`Produit: ${product.name}`}
            >
              {product.name}
            </Text>

            <View style={styles.priceRow}>
              <Text
                style={styles.price}
                accessible
                accessibilityLabel={`Prix: ${isInStock ? `$${product.price.toFixed(2)}` : 'Épuisé'}`}
              >
                {isInStock ? `$${product.price.toFixed(2)}` : 'Épuisé'}
              </Text>
              <View
                style={[
                  styles.stockContainer,
                  { backgroundColor: isInStock ? '#10B981' : '#EF4444' },
                ]}
              >
                <Text
                  style={styles.stockText}
                  accessible
                  accessibilityLabel={`Stock: ${product.stock || 'En stock'}`}
                >
                  {product.stock || 'En stock'}
                </Text>
              </View>
            </View>

            <Text style={styles.descriptionTitle}>Description</Text>
            <Text
              style={styles.description}
              accessible
              accessibilityLabel={`Description: ${product.description || 'Aucune description'}`}
            >
              {product.description || 'Aucune description disponible'}
            </Text>

            <Animated.View entering={FadeIn.duration(500).delay(200)}>
              <TouchableOpacity
                style={[
                  styles.addToCartButton,
                  {
                    backgroundColor: isInStock ? '#1e90ff' : '#6b7280',
                    opacity: isInStock ? 1 : 0.6,
                  },
                ]}
                onPress={() => isInStock && handleAddToCart()}
                disabled={!isInStock}
                activeOpacity={0.7}
                accessible
                accessibilityLabel="Ajouter au panier"
              >
                <Ionicons name="cart-outline" size={24} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.addToCartText}>Ajouter au panier</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e32',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 80,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#1e90ff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#2a2a40',
    padding: 12,
    borderRadius: 12,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  card: {
    backgroundColor: '#2a2a40',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#3a3a50',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 12,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#3a3a50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 24,
  },
  category: {
    color: '#ff6f61',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  price: {
    color: '#ff6200',
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 12,
  },
  stockContainer: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  stockText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  descriptionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  description: {
    color: '#a0a0b0',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});