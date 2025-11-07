import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/products';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  } : {};
};

// Créer un produit (avec support pour fichier)
export const createProduct = async (productData, file) => {
  try {
    const formData = new FormData();
    Object.keys(productData).forEach((key) => {
      formData.append(key, productData[key]);
    });
    if (file) {
      formData.append('file', file); // Assumes 'file' is the field name expected by multer
    }
    const response = await axios.post(`${API_BASE_URL}`, formData, {
      ...getHeaders(),
      headers: {
        ...getHeaders().headers, // Merge Authorization header
        'Content-Type': 'multipart/form-data', // Required for file upload
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création du produit :', error.message);
    throw error;
  }
};

// Récupérer tous les produits
export const getAllProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}`, getHeaders());
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des produits :', error.message);
    throw error;
  }
};

// Récupérer un produit par ID
export const getProductById = async (productId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${productId}`, getHeaders());
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération du produit :', error.message);
    throw error;
  }
};

// Mettre à jour un produit (avec support pour fichier)
export const updateProduct = async (productId, updatedData, file) => {
  try {
    const formData = new FormData();
    Object.keys(updatedData).forEach((key) => {
      formData.append(key, updatedData[key]);
    });
    if (file) {
      formData.append('file', file); // Assumes 'file' is the field name expected by multer
    }
    const response = await axios.put(`${API_BASE_URL}/${productId}`, formData, {
      ...getHeaders(),
      headers: {
        ...getHeaders().headers, // Merge Authorization header
        'Content-Type': 'multipart/form-data', // Required for file upload
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit :', error.message);
    throw error;
  }
};

// Supprimer un produit
export const deleteProduct = async (productId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${productId}`, getHeaders());
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression du produit :', error.message);
    throw error;
  }
};

// Récupérer les produits par catégorie
export const getProductsByCategory = async (categoryId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/category/${categoryId}`, getHeaders());
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des produits par catégorie :', error.message);
    throw error;
  }
};