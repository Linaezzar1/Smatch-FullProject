import { Team } from '@/models/Team';
import axios from 'axios';

const API_URL = 'http://192.168.0.135:3000/api/team';

// Créer une équipe (auth requise)
const createTeam = async (teamData: Team, token: string) => {
  return axios.post(`${API_URL}/create`, teamData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Récupérer toutes les équipes (publique)
const getAllTeams = async () => {
  return axios.get(`${API_URL}/getAll`);
};

// Récupérer une équipe par ID (publique)
const getTeamById = async (id: string) => {
  return axios.get(`${API_URL}/${id}`);
};

// Mettre à jour une équipe (publique selon ton routeur, sinon ajoute auth)
const updateTeam = async (id: string, updatedData: Partial<Team>) => {
  return axios.put(`${API_URL}/${id}`, updatedData);
};

// Supprimer une équipe (publique selon ton routeur, sinon ajoute auth)
const deleteTeam = async (id: string) => {
  return axios.delete(`${API_URL}/${id}`);
};

const TeamService = {
  createTeam,
  getAllTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
};

export default TeamService;
