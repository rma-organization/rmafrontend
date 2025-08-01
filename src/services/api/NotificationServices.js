// src/services/api/NotificationServices.js
import axiosInstance from "./axios";

const NOTIFICATION_BASE_URL = "/api/notifications"; // ✅ with /api prefix

export const sendNotification = ({ receiverRole, message, type, status, requestsId, senderUsername }) =>
  axiosInstance.post(`${NOTIFICATION_BASE_URL}/send`, null, {
    params: { receiverRole, message, type, status, requestsId, senderUsername },
  });

export const getRoleNotifications = () =>
  axiosInstance.get(`${NOTIFICATION_BASE_URL}/role`);

export const getUserNotifications = () =>
  axiosInstance.get(`${NOTIFICATION_BASE_URL}/user`);

export const updateNotificationStatus = (id, status) =>
  axiosInstance.put(`${NOTIFICATION_BASE_URL}/${id}/status?status=${status}`);

export const deleteNotification = (id) =>
  axiosInstance.delete(`${NOTIFICATION_BASE_URL}/${id}`);

export const markNotificationAsRead = (id) =>
  axiosInstance.put(`${NOTIFICATION_BASE_URL}/${id}/mark-read`);
