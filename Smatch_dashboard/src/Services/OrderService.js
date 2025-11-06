import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/orders';

// Ajouter le token JWT dans les requêtes (commenté car non requis actuellement)
// const getHeaders = () => {
//   const token = localStorage.getItem('token');
//   return token ? {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   } : {};
// };

// Créer une commande
export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}`, orderData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de la commande :', error.message);
    throw error;
  }
};

// Récupérer les commandes d'un utilisateur
export const getOrdersByUser = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes de l\'utilisateur :', error.message);
    throw error;
  }
};

// Récupérer toutes les commandes
export const getAllOrders = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération de toutes les commandes :', error.message);
    throw error;
  }
};

// Récupérer une commande par ID
export const getOrderById = async (orderId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération de la commande :', error.message);
    throw error;
  }
};

// Mettre à jour une commande
export const updateOrder = async (orderId, updatedData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${orderId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la commande :', error.message);
    throw error;
  }
};

// Supprimer une commande
export const deleteOrder = async (orderId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression de la commande :', error.message);
    throw error;
  }
};