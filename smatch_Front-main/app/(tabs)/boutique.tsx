import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import ProductService from '../../services/ProductService';
import CategoryService from '../../services/CategoryService';
import { Product } from '@/models/Product';
import { Category } from '@/models/Category';
import { useCart } from '../../contexts/CartContext';

// Map category names to specific Ionicons
const categoryIcons: { [key: string]: string } = {
  Balls: 'basketball-outline',
  Shoes: 'footsteps-outline',
  Apparel: 'shirt-outline',
  Accessories: 'shield-outline',
};

export default function Boutique() {
  const router = useRouter();
  const { addToCart, getCartCount } = useCart();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cartItemCount = getCartCount();

  // Fetch categories and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const categoryResponse = await CategoryService.getAllCategories();
        const fetchedCategories = categoryResponse.data;
        setCategories(fetchedCategories);
        setSelectedCategory(fetchedCategories[0]?.name || null);

        const productResponse = await ProductService.getAllProducts();
        setProducts(productResponse.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load categories or products. Please try again.');
        Alert.alert('Error', 'Failed to load data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter products
  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category?.name === selectedCategory)
    : products;

  // Get featured product
  const featuredProduct = filteredProducts[0] || products[0];

  // Handle navigation to product details
  const handleProductPress = (productId?: string) => {
    if (!productId) {
      console.error('Invalid product ID:', productId);
      Alert.alert('Error', 'Invalid product ID.');
      return;
    }
    router.push({
      pathname: '/shop/[id]',
      params: { id: productId },
    });
  };

  // Render loading state
  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#1e1e32', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1e90ff" />
        <Text style={{ color: '#fff', fontSize: 18, marginTop: 10 }}>Loading data...</Text>
      </View>
    );
  }

  // Render error state
  if (error) {
    return (
      <View style={{ flex: 1, backgroundColor: '#1e1e32', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontSize: 24, fontWeight: '600', textAlign: 'center', marginBottom: 20 }}>
          {error}
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: '#1e90ff',
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 12,
          }}
          onPress={() => {
            setLoading(true);
            setError(null);
            fetchData();
          }}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#1e1e32' }}>
      <ScrollView style={{ flex: 1 }}>
        {/* Featured Product */}
        {featuredProduct ? (
          <View style={{ margin: 16, borderRadius: 8, overflow: 'hidden', backgroundColor: '#2a2a40' }}>
            <View style={{ width: '100%', height: 160, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e0e0e0' }}>
              {featuredProduct.imageUrl?.startsWith('http') ? (
                <Image
                  source={{ uri: featuredProduct.imageUrl }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
              ) : (
                <Text style={{ fontSize: 64 }}>🏐</Text>
              )}
            </View>
            <View style={{ padding: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e90ff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start' }}>
                <Ionicons name="basketball-outline" size={16} color="#fff" />
                <Text style={{ color: '#fff', fontSize: 12, marginLeft: 4 }}>Featured Product</Text>
              </View>
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', marginVertical: 4 }}>
                {featuredProduct.name}
              </Text>
              <Text style={{ color: '#888', fontSize: 12 }}>
                ${featuredProduct.price.toFixed(2)} - {featuredProduct.stock || 'In Stock'}
              </Text>
            </View>
          </View>
        ) : (
          <View style={{ margin: 16, alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>
              No featured product available
            </Text>
          </View>
        )}

        {/* Category Selector */}
        <FlatList
          horizontal
          data={categories}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                backgroundColor: selectedCategory === item.name ? '#ff6f61' : '#2a2a40',
                borderRadius: 12,
                paddingVertical: 8,
                paddingHorizontal: 16,
                marginRight: 8,
                flexDirection: 'row',
                alignItems: 'center',
              }}
              onPress={() => setSelectedCategory(item.name)}
            >
              <Ionicons name={categoryIcons[item.name] || 'cube-outline'} size={24} color="#fff" />
              <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold', marginLeft: 4 }}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id} // Use only item.id, assuming it’s unique
          showsHorizontalScrollIndicator={false}
          style={{ marginHorizontal: 16, marginBottom: 16 }}
        />

        {/* Products */}
        {filteredProducts.length === 0 ? (
          <View style={{ margin: 16, alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>
              No products available in this category
            </Text>
          </View>
        ) : (
          filteredProducts.map((product) => (
            <View key={product._id || `product-${product.name}`} style={{ marginHorizontal: 16, marginBottom: 20 }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleProductPress(product._id)}
              >
                <View
                  style={{
                    backgroundColor: '#2a2a40',
                    borderRadius: 12,
                    padding: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 6,
                    elevation: 8,
                  }}
                >
                  <View
                    style={{
                      width: 60,
                      height: 60,
                      backgroundColor: '#3a3a50',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 12,
                      borderRadius: 8,
                    }}
                  >
                    {product.imageUrl?.startsWith('http') ? (
                      <Image
                        source={{ uri: product.imageUrl }}
                        style={{ width: 60, height: 60, borderRadius: 8 }}
                        resizeMode="cover"
                      />
                    ) : (
                      <Text style={{ fontSize: 32 }}>🏐</Text>
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 16,
                        fontWeight: 'bold',
                        marginBottom: 4,
                      }}
                    >
                      {product.name}
                    </Text>
                    <Text
                      style={{
                        color: '#a0a0b0',
                        fontSize: 12,
                        lineHeight: 16,
                        marginBottom: 8,
                      }}
                      numberOfLines={2}
                    >
                      {product.description}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text
                          style={{
                            color: '#ff6200',
                            fontSize: 16,
                            fontWeight: 'bold',
                            marginRight: 8,
                          }}
                        >
                          ${product.price.toFixed(2)}
                        </Text>
                        <View
                          style={{
                            backgroundColor: product.stock === 'In Stock' ? '#10B981' : '#EF4444',
                            borderRadius: 8,
                            paddingHorizontal: 8,
                            paddingVertical: 2,
                          }}
                        >
                          <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>
                            {product.stock || 'In Stock'}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        style={{
                          backgroundColor: product.stock === 'In Stock' ? '#1e90ff' : '#6b7280',
                          borderRadius: 8,
                          padding: 8,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                        onPress={() => product.stock === 'In Stock' && addToCart(product)}
                        disabled={product.stock !== 'In Stock'}
                      >
                        <Ionicons name="cart-outline" size={20} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          backgroundColor: '#ff6200',
          borderRadius: 9999,
          padding: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
          elevation: 8,
        }}
        onPress={() => router.push('/shop/panier')}
      >
        <Ionicons name="cart-outline" size={24} color="#fff" />
        {cartItemCount > 0 && (
          <View
            style={{
              position: 'absolute',
              top: -4,
              right: -4,
              backgroundColor: '#ff6200',
              borderRadius: 10,
              width: 20,
              height: 20,
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#000',
              shadowRadius: 5,
              elevation: 5,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>{cartItemCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}