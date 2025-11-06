import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/teams';

// Headers with authentication (assuming auth middleware requires a token)
const getHeaders = () => {
  const token = localStorage.getItem('token'); // Adjust based on your auth implementation
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Create a new team
export const createTeam = async (teamData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/create`, teamData, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de l\'équipe :', error.message);
    throw error;
  }
};

// Get all teams
export const getAllTeams = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getAll`, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des équipes :', error.message);
    throw error;
  }
};

// Get a team by ID
export const getTeamById = async (teamId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${teamId}`, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'équipe :', error.message);
    throw error;
  }
};

// Update a team
export const updateTeam = async (teamId, teamData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${teamId}`, teamData, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'équipe :', error.message);
    throw error;
  }
};

// Delete a team
export const deleteTeam = async (teamId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${teamId}`, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'équipe :', error.message);
    throw error;
  }
};