import { Tournament } from '@/models/Tournament';
import axios from 'axios';

const API_URL = 'http://192.168.0.135:3000/api/tournament'; 


// Créer un tournoi
const createTournament = async (tournamentData: Tournament, token: string) => {
  return axios.post(`${API_URL}/tournaments`, tournamentData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Récupérer tous les tournois
const getAllTournaments = async () => {
  return axios.get(`${API_URL}/tournaments`);
};

// Récupérer un tournoi par ID
const getTournamentById = async (id: string) => {
  return axios.get(`${API_URL}/tournaments/${id}`);
};

// Mettre à jour un tournoi
const updateTournament = async (id: string, updatedData: Tournament, token: string) => {
  return axios.put(`${API_URL}/tournaments/${id}`, updatedData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Supprimer un tournoi
const deleteTournament = async (id: string, token: string) => {
  return axios.delete(`${API_URL}/tournaments/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Rejoindre un tournoi
const createJoinRequest = async (id: string, teamId: string, token: string) => {
  return axios.post(`${API_URL}/tournaments/${id}/join`, { teamId }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Gérer une demande de participation
const handleJoinRequest = async (
  id: string,
  teamId: string,
  decision: 'accepted' | 'rejected',
  token: string
) => {
  return axios.put(`${API_URL}/tournaments/${id}/join`, { teamId, status: decision }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Générer la structure du tournoi
const generateTournamentStructure = async (id: string, terrainType: string, maxSets: number, token: string) => {
  return axios.post(`${API_URL}/tournaments/${id}/generate`, { terrainType, maxSets }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Mettre à jour le résultat d'un match
const updateMatchResult = async (
  tournamentId: string,
  matchId: string,
  resultData: { scoreA: number; scoreB: number },
  token: string
) => {
  return axios.put(`${API_URL}/tournaments/${tournamentId}/matches/${matchId}`, resultData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Récupérer les matchs par ronde
const getMatchesByRound = async (tournamentId: string) => {
  return axios.get(`${API_URL}/tournaments/${tournamentId}/matches-by-round`);
};


// Exporting all methods as a default object
const TournamentService = {
  createTournament,
  getAllTournaments,
  getTournamentById,
  updateTournament,
  deleteTournament,
  createJoinRequest,
  handleJoinRequest,
  generateTournamentStructure,
  updateMatchResult,
  getMatchesByRound,
};

export default TournamentService;
