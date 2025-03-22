import axios from 'axios';

const API_URL = 'https://tarefas-backend-nb1b.onrender.com/auth';

// Armazenar token no localStorage
const setToken = (token) => {
    localStorage.setItem('token', token);
};

// Obter token do localStorage
export const getToken = () => {
    return localStorage.getItem('token');
};

// Verificar se usuário está autenticado
export const isAuthenticated = () => {
    return !!getToken();
};

// Obter cabeçalhos com autorização
export const getAuthHeaders = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Registro de usuário
export const register = async (email, password) => {
    const response = await axios.post(`${API_URL}/register`, { email, password });
    setToken(response.data.token);
    return response.data;
};

// Login de usuário
export const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    setToken(response.data.token);
    return response.data;
};

// Logout de usuário
export const logout = () => {
    localStorage.removeItem('token');
};
