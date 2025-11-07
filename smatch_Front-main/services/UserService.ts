import { User } from '@/models/User';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';


const API_URL = 'http://192.168.0.135:3000/api/users';

// Inscription
const signup = async (userData: Partial<User>) => {
  return axios.post(`${API_URL}/signup`, userData);
};

// Connexion
const login = async (credentials: { email: string; password: string }) => {
  return axios.post(`${API_URL}/login`, credentials);
};

// Récupérer un utilisateur par ID
const getUserById = async (id: string, token: string) => {
  return axios.get(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Mettre à jour un utilisateur
const updateUser = async (
  id: string,
  updatedData: Partial<User>,
  token: string
): Promise<{ user: User; token?: string }> => {
  const response = await axios.put(`${API_URL}/${id}`, updatedData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Si un nouveau token est retourné, le stocker dans AsyncStorage
  if (response.data.token) {
    await AsyncStorage.setItem('token', response.data.token);
  }

  return {
    user: response.data.user,
    token: response.data.token, // utile si tu veux l'utiliser dans ton state
  };
};


// is logged in
const isLoggedIn = async () => {
  const token = await AsyncStorage.getItem('token');
  return token ? true : false;
}

// get user id from token
const getUserIdFromToken = async () => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    const decoded: any = jwtDecode(token);
    return decoded._id; // Assure-toi d’utiliser "_id"
  }
  return null;
};

// Exportation du service
const UserService = {
  signup,
  login,
  getUserById,
  updateUser,
  isLoggedIn,
  getUserIdFromToken,
};

export default UserService;
