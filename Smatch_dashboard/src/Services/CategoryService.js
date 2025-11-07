import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/categories';

// Ajouter le token JWT dans les requêtes (commenté car non requis actuellement)
// const getHeaders = () => {
//   const token = localStorage.getItem('token');
//   return token ? {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   } : {};
// };

// Créer une catégorie
export const createCategory = async (categoryData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}`, categoryData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de la catégorie :', error.message);
    throw error;
  }
};

// Récupérer toutes les catégories
export const getAllCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories :', error.message);
    throw error;
  }
};

// Récupérer une catégorie par ID
export const getCategoryById = async (categoryId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération de la catégorie :', error.message);
    throw error;
  }
};

// Mettre à jour une catégorie
export const updateCategory = async (categoryId, updatedData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${categoryId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la catégorie :', error.message);
    throw error;
  }
};

// Supprimer une catégorie
export const deleteCategory = async (categoryId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression de la catégorie :', error.message);
    throw error;
  }
};