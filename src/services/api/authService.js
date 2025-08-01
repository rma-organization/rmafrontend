//authService.js
import axiosInstance from "./axios";


const BASE_URL = "/api/auth";

export const fetchAllUsers = () => axiosInstance.get(`${BASE_URL}/users`);
export const fetchPendingUsers = () => axiosInstance.get(`${BASE_URL}/pending-users`);
export const approveUser = (username, approvalStatus) =>
  axiosInstance.post(`${BASE_URL}/approve`, { username, approvalStatus });

export const loginUser = ({ username, password, role }) =>
  axiosInstance.post(`${BASE_URL}/login`, { username, password, role });

export const forgotPassword = ({ username, email }) =>
  axiosInstance.post(`${BASE_URL}/forgot-password`, { username, email });

export const resetPassword = ({ token, newPassword }) =>
  axiosInstance.post(`${BASE_URL}/reset-password`, { token, newPassword });

export const registerUser = ({ username, email, password, roles }) =>
  axiosInstance.post(`${BASE_URL}/register`, { username, email, password, roles });
