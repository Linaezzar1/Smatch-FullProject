import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/tournament';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Créer un tournoi
export const createTournament = async (tournamentData, file) => {
  try {
    // Validation des données
    const requiredFields = ['name', 'startDate', 'endDate', 'location', 'numberTeam', 'prize', 'tournamentType'];
    const missingFields = requiredFields.filter(field => !tournamentData[field]);
    if (missingFields.length > 0) {
      throw new Error(`Champs manquants : ${missingFields.join(', ')}`);
    }

    const formData = new FormData();
    Object.keys(tournamentData).forEach(key => {
      formData.append(key, tournamentData[key]);
    });
    if (file) {
      formData.append('file', file);
    }

    const response = await axios.post(`${API_BASE_URL}/tournaments`, formData, {
      headers: {
        ...getHeaders(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création du tournoi :', error.message);
    throw new Error(error.response?.data?.message || 'Erreur lors de la création du tournoi');
  }
};

// Lister tous les tournois
export const getAllTournaments = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tournaments`, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des tournois :', error.message);
    throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des tournois');
  }
};

// Récupérer un tournoi par ID
export const getTournamentById = async (tournamentId) => {
  try {
    if (!tournamentId) throw new Error('ID du tournoi requis');
    const response = await axios.get(`${API_BASE_URL}/tournaments/${tournamentId}`, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération du tournoi :', error.message);
    throw new Error(error.response?.data?.message || 'Erreur lors de la récupération du tournoi');
  }
};

// Mettre à jour un tournoi
export const updateTournament = async (tournamentId, tournamentData, file) => {
  try {
    if (!tournamentId) throw new Error('ID du tournoi requis');
    const formData = new FormData();
    Object.keys(tournamentData).forEach(key => {
      formData.append(key, tournamentData[key]);
    });
    if (file) {
      formData.append('file', file);
    }

    const response = await axios.put(`${API_BASE_URL}/tournaments/${tournamentId}`, formData, {
      headers: {
        ...getHeaders(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du tournoi :', error.message);
    throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour du tournoi');
  }
};

// Supprimer un tournoi
export const deleteTournament = async (tournamentId) => {
  try {
    if (!tournamentId) throw new Error('ID du tournoi requis');
    const response = await axios.delete(`${API_BASE_URL}/tournaments/${tournamentId}`, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression du tournoi :', error.message);
    throw new Error(error.response?.data?.message || 'Erreur lors de la suppression du tournoi');
  }
};

// Créer une demande de participation à un tournoi
export const createJoinRequest = async (tournamentId, teamId) => {
  try {
    if (!tournamentId || !teamId) throw new Error('ID du tournoi et ID de l\'équipe requis');
    const response = await axios.post(
      `${API_BASE_URL}/tournaments/${tournamentId}/join`,
      { teamId },
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de la demande de participation :', error.message);
    throw new Error(error.response?.data?.message || 'Erreur lors de la création de la demande de participation');
  }
};

// Gérer une demande de participation à un tournoi
export const handleJoinRequest = async (tournamentId, teamId, status) => {
  try {
    if (!tournamentId || !teamId || !status) throw new Error('ID du tournoi, ID de l\'équipe et statut requis');
    if (!['accepted', 'rejected'].includes(status)) throw new Error('Statut invalide');
    const response = await axios.put(
      `${API_BASE_URL}/tournaments/${tournamentId}/join`,
      { teamId, status },
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la gestion de la demande de participation :', error.message);
    throw new Error(error.response?.data?.message || 'Erreur lors de la gestion de la demande de participation');
  }
};

// Générer la structure du tournoi
export const generateTournamentStructure = async (tournamentId, structureData) => {
  try {
    if (!tournamentId) throw new Error('ID du tournoi requis');
    const response = await axios.post(
      `${API_BASE_URL}/tournaments/${tournamentId}/generate`,
      structureData,
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la génération de la structure du tournoi :', error.message);
    throw new Error(error.response?.data?.message || 'Erreur lors de la génération de la structure du tournoi');
  }
};

// Mettre à jour le résultat d'un match
export const updateMatchResult = async (tournamentId, matchId, resultData) => {
  try {
    if (!tournamentId || !matchId) throw new Error('ID du tournoi et ID du match requis');
    const response = await axios.put(
      `${API_BASE_URL}/tournaments/${tournamentId}/matches/${matchId}`,
      resultData,
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du résultat du match :', error.message);
    throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour du résultat du match');
  }
};

// Récupérer les matchs par ronde
export const getMatchesByRound = async (tournamentId) => {
  try {
    if (!tournamentId) throw new Error('ID du tournoi requis');
    const response = await axios.get(`${API_BASE_URL}/tournaments/${tournamentId}/matches-by-round`, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des matchs par ronde :', error.message);
    throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des matchs par ronde');
  }
};

// Récupérer les équipes participantes d'un tournoi
export const getTournamentTeams = async (tournamentId) => {
  try {
    if (!tournamentId) throw new Error('ID du tournoi requis');
    const response = await axios.get(`${API_BASE_URL}/tournaments/${tournamentId}/teams`, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des équipes du tournoi :', error.message);
    throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des équipes du tournoi');
  }
};