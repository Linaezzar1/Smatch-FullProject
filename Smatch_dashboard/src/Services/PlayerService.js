import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/players'; 

// Ajouter le token JWT dans les requêtes
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  } : {};
};

const PlayerService = {
  // Créer un joueur
  createPlayer: async (playerData) => {
    try {
      const userId = localStorage.getItem('userId'); 
      const response = await axios.post(`${API_BASE_URL}`, { ...playerData, user: userId }, getHeaders());
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du joueur:', error);
      throw error;
    }
  },

  // Participer à un match
  participerMatch: async (playerId, matchId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/${playerId}/participer`, { matchId }, getHeaders());
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la participation au match:', error);
      throw error;
    }
  },

  // Consulter le classement
  consulterClassement: async (playerId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${playerId}/classement`, getHeaders());
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du classement:', error);
      throw error;
    }
  },
};

export default PlayerService;