import axios from 'axios';

const API_URL = 'http://192.168.0.135:3000/api/categories';

// Create a new category
const createCategory = async (categoryData: any) => {
    return axios.post(API_URL, categoryData);
};

// Get all categories
const getAllCategories = async () => {
  return axios.get(API_URL);
};

// Get a category by its ID
const getCategoryById = async (id: string) => {
  return axios.get(`${API_URL}/${id}`);
};

// Update a category
const updateCategory = async (id: string, categoryData: any) => {
    return axios.put(`${API_URL}/${id}`, categoryData);
};

// Delete a category
const deleteCategory = async (id: string) => {
    return axios.delete(`${API_URL}/${id}`);
};

// Export the service
const CategoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};

export default CategoryService;
