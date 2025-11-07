import axios, { AxiosError } from 'axios';
import { Order } from '@/models/Order';

const API_URL = process.env.EXPO_PUBLIC_API_URL?.replace('/products', '/orders') || 'http://192.168.0.135:3000/api/orders';

interface ApiResponse<T> {
  data: T;
}

interface OrderPayload {
  user: string;
  products: string[];
  quantities?: number[]; // Optional, requires backend support
  total: number;
}

const createOrder = async (orderData: OrderPayload): Promise<ApiResponse<Order>> => {
  try {
    const response = await axios.post(API_URL, orderData);
    return response.data;
  } catch (error) {
    throw handleAxiosError(error, 'Échec de la création de la commande');
  }
};

const getAllOrders = async (): Promise<ApiResponse<Order[]>> => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw handleAxiosError(error, 'Échec de la récupération des commandes');
  }
};

const getOrderById = async (id: string): Promise<ApiResponse<Order>> => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw handleAxiosError(error, 'Échec de la récupération de la commande');
  }
};

const getOrdersByUser = async (userId: string): Promise<ApiResponse<Order[]>> => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`);
    return response.data;
  } catch (error) {
    throw handleAxiosError(error, 'Échec de la récupération des commandes de l’utilisateur');
  }
};

const updateOrder = async (id: string, updatedData: Partial<Order>): Promise<ApiResponse<Order>> => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedData);
    return response.data;
  } catch (error) {
    throw handleAxiosError(error, 'Échec de la mise à jour de la commande');
  }
};

const deleteOrder = async (id: string): Promise<ApiResponse<void>> => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw handleAxiosError(error, 'Échec de la suppression de la commande');
  }
};

const handleAxiosError = (error: unknown, defaultMessage: string): Error => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string; error?: any }>;
    const message = axiosError.response?.data?.message || axiosError.response?.data?.error?.message || axiosError.message;
    return new Error(message || defaultMessage);
  }
  return new Error(defaultMessage);
};

const OrderService = {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUser,
  updateOrder,
  deleteOrder,
};

export default OrderService;