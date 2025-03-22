import axios from "axios";
import { getAuthHeaders } from './authService';

const API_URL = "https://tarefas-backend-nb1b.onrender.com/tasks";

// Adicionar token a todas as requisições
const getConfig = () => ({
    headers: getAuthHeaders()
});

export const getTasks = async () => await axios.get(API_URL, getConfig());

export const createTask = async (task) => await axios.post(API_URL, task, getConfig());

export const updateTask = async (id, task) => await axios.put(`${API_URL}/${id}`, task, getConfig());

export const deleteTask = async (id) => await axios.delete(`${API_URL}/${id}`, getConfig());

export const completeTask = async (id) => {
    return await axios.patch(`${API_URL}/${id}/complete`);
};

export const toggleTaskStatus = async (id) => {
    return await axios.patch(`${API_URL}/${id}/toggle-status`, {}, getConfig());
};
