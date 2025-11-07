import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Match } from '@/models/Match';

const API_URL = 'http://192.168.0.135:3000/api/matches';

// Create a new quick match
const createQuickMatch = async (matchData: Match) => {
  const token = await AsyncStorage.getItem('token');

  console.log("Token:", token);

  if (!token) {
    console.warn("Aucun token trouvé dans AsyncStorage");
    throw new Error("Token manquant");
  }

  return axios.post(`${API_URL}/quick-matches`, matchData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


// Join a quick match
const joinQuickMatch = async (idMatch: string, teamId: string) => {
  const token = await AsyncStorage.getItem('token');
  
  return axios.post(
    `${API_URL}/quick-matches/${idMatch}/join`,
    { teamId }, // ✅ on envoie un objet ici
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};


// Request to join a quick match
const requestToJoinQuickMatch = async (idMatch: string, teamId: string) => {
  const token = await AsyncStorage.getItem('token');
  return axios.post(`${API_URL}/quick-matches/${idMatch}/request-join`, {teamId}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Handle join request for a quick match
const handleJoinRequest = async (id: string, approved: boolean) => {
  const token = await AsyncStorage.getItem('token');
  return axios.put(`${API_URL}/quick-matches/${id}/handle-join`, { approved }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Get all quick matches
const getQuickMatches = async () => {
  return axios.get(`${API_URL}/quick-matches`);
};

// Update a quick match
const updateQuickMatch = async (id: string, matchData: Match) => {
  const token = await AsyncStorage.getItem('token');
  return axios.put(`${API_URL}/quick-matches/${id}`, matchData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Delete a quick match
const deleteQuickMatch = async (id: string) => {
  const token = await AsyncStorage.getItem('token');
  return axios.delete(`${API_URL}/quick-matches/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Invite a player to a quick match (authenticated players only)
const invitePlayerToQuickMatch = async (matchId: string, playerId: string, teamId: string, token: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/quick-matches/${matchId}/invite`,
      { playerId, teamId },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Erreur lors de l\'invitation du joueur' };
  }
};


// Get a specific quick match by ID (no authentication required)
const getQuickMatchById = async (matchId: any) => {
  return axios.get(`${API_URL}/quick-matches/${matchId}`);
};

// Export the service
const QuickMatchService = {
  createQuickMatch,
  joinQuickMatch,
  requestToJoinQuickMatch,
  handleJoinRequest,
  getQuickMatches,
  updateQuickMatch,
  deleteQuickMatch,
  invitePlayerToQuickMatch,
  getQuickMatchById
};


export default QuickMatchService;
