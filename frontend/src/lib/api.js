// frontend/lib/api.js
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api';

export const fetchCategoryDistribution = (filters) => {
  return axios.get(`${API_BASE}/inventory/category-distribution`, { params: filters });
};

export const fetchStockVsMsl = (filters) => {
  return axios.get(`${API_BASE}/inventory/stock-vs-msl`, { params: filters });
};

export const fetchMonthlyConsumption = (filters) => {
  return axios.get(`${API_BASE}/inventory/monthly-consumption`, { params: filters });
};

export const fetchItrData = (filters) => {
  return axios.get(`${API_BASE}/inventory/itr`, { params: filters });
};

export const fetchAllInventory = (page = 1, limit = 20) => {
  return axios.get(`${API_BASE}/inventory/all`, { params: { page, limit } });
};
