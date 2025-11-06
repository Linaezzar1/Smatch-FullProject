import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/matches';

// Ajouter le token JWT dans les requêtes
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  } : {};
};

// Créer un match rapide
export const createQuickMatch = async (matchData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/quick-matches`, matchData, getHeaders());
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création du match rapide :', error.message);
    throw error;
  }
};

// Demander à rejoindre un match rapide privé
export const requestToJoinQuickMatch = async (matchId, teamId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/quick-matches/${matchId}/request-join`, { teamId }, getHeaders());
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la demande de participation au match rapide :', error.message);
    throw error;
  }
};

// Gérer une demande de participation à un match rapide
export const handleJoinRequest = async (matchId, teamId, status) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/quick-matches/${matchId}/handle-join`, { teamId, status }, getHeaders());
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la gestion de la demande de participation :', error.message);
    throw error;
  }
};

// Rejoindre un match rapide public
export const joinQuickMatch = async (matchId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/quick-matches/${matchId}/join`, {}, getHeaders());
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la tentative de rejoindre le match rapide :', error.message);
    throw error;
  }
};

// Lister tous les matchs rapides
export const getQuickMatches = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/quick-matches`); // No auth required
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des matchs rapides :', error.message);
    throw error;
  }
};

// Mettre à jour un match rapide
export const updateQuickMatch = async (matchId, updatedData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/quick-matches/${matchId}`, updatedData, getHeaders());
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du match rapide :', error.message);
    throw error;
  }
};

// Supprimer un match rapide
export const deleteQuickMatch = async (matchId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/quick-matches/${matchId}`, getHeaders());
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression du match rapide :', error.message);
    throw error;
  }
};