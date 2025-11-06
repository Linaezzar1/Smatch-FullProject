import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/users';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  } : {};
};

export const signup = async (userData) => {
  try {
    const requiredFields = ['name', 'email', 'password'];
    const missingFields = requiredFields.filter(field => !userData[field]);
    if (missingFields.length > 0) {
      throw new Error(`Champs manquants : ${missingFields.join(', ')}`);
    }

    const response = await axios.post(`${API_BASE_URL}/signup`, userData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l’inscription :', error.message);
    throw new Error(error.response?.data?.message || 'Erreur lors de l’inscription');
  }
};

export const login = async (credentials) => {
  try {
    if (!credentials.email || !credentials.password) {
      throw new Error('Email et mot de passe requis');
    }

    const response = await axios.post(`${API_BASE_URL}/login`, credentials);
    localStorage.setItem('token', response.data.mytoken);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la connexion :', error.message);
    throw new Error(error.response?.data?.message || 'Erreur lors de la connexion');
  }
};

export const fetchUserById = async (userId) => {
  try {
    if (!userId) throw new Error('ID de l\'utilisateur requis');
    const response = await axios.get(`${API_BASE_URL}/${userId}`, getHeaders());
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur :', error.message);
    throw new Error(error.response?.data?.message || 'Erreur lors de la récupération de l\'utilisateur');
  }
};

export const updateUser = async (userId, updateData, file) => {
  try {
    if (!userId) throw new Error('ID de l\'utilisateur requis');
    const formData = new FormData();
    Object.keys(updateData).forEach(key => {
      formData.append(key, updateData[key]);
    });
    if (file) {
      formData.append('file', file);
    }

    const response = await axios.put(`${API_BASE_URL}/${userId}`, formData, {
      headers: {
        ...getHeaders().headers,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour :', error.message);
    throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour');
  }
};

export const getUserIdFromToken = () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const payloadBase64 = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));
      return decodedPayload._id;
    } catch (error) {
      console.error('Erreur lors du décodage du token :', error.message);
      return null;
    }
  }
  return null;
};

export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/`, getHeaders());
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs :', error.message);
    throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des utilisateurs');
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};