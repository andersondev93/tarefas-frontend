import axios from "axios";

const API_URL = "https://tarefas-backend-nb1b.onrender.com/tasks";

export const getTasks = async () => await axios.get(API_URL);

export const createTask = async (task) => await axios.post(API_URL, task);

export const updateTask = async (id, task) => await axios.put(`${API_URL}/${id}`, task);

export const deleteTask = async (id) => await axios.delete(`${API_URL}/${id}`);

export const completeTask = async (id) => {
    return await axios.patch(`${API_URL}/${id}/complete`);
};

export const toggleTaskStatus = async (id) => {
    return await axios.patch(`${API_URL}/${id}/toggle-status`);
};
