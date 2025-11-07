import axios from 'axios';
import { Product } from '@/models/Product';

const API_URL = 'http://192.168.0.135:3000/api/products';

// Créer un produit
const createProduct = async (productData: Product) => {
  return axios.post(API_URL, productData);
};

// Récupérer tous les produits
const getAllProducts = async () => {
  return axios.get(API_URL);
};

// Récupérer un produit par ID
const getProductById = async (id: string) => {
  return axios.get(`${API_URL}/${id}`);
};

// Mettre à jour un produit
const updateProduct = async (id: string, updatedData: Partial<Product>) => {
  return axios.put(`${API_URL}/${id}`, updatedData);
};

// Supprimer un produit
const deleteProduct = async (id: string) => {
  return axios.delete(`${API_URL}/${id}`);
};

// Récupérer les produits par catégorie
const getProductsByCategory = async (categoryId: string) => {
  return axios.get(`${API_URL}/category/${categoryId}`);
};

// Export du service
const ProductService = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
};

export default ProductService;
