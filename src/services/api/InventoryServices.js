// // src/services/apiService.js
// import axiosInstance from "./axios";

// const BASE_URL = "/api";
// const INVENTORY_BASE_URL = `${BASE_URL}/inventory`;
// const REQUESTS_BASE_URL = `${BASE_URL}/requests`;
// const VENDOR_BASE_URL = `${BASE_URL}/vendors`;
// const NOTIFICATION_BASE_URL = `${BASE_URL}/notifications`;

// // INVENTORY

// export const listInventory = async () => {
//   try {
//     const [inventoryResponse, vendorsResponse] = await Promise.all([
//       axiosInstance.get(INVENTORY_BASE_URL),
//       axiosInstance.get(VENDOR_BASE_URL),
//     ]);

//     const vendorMap = vendorsResponse.data.reduce((acc, vendor) => {
//       acc[vendor.id] = vendor.name;
//       return acc;
//     }, {});

//     const inventoryWithVendors = inventoryResponse.data.map((item) => ({
//       ...item,
//       vendorName: vendorMap[item.vendorId] || "Unknown Vendor",
//     }));

//     return { data: inventoryWithVendors };
//   } catch (error) {
//     console.error("Error fetching inventory or vendors:", error);
//     throw error;
//   }
// };

// export const getInventoryById = async (id) => {
//   try {
//     const response = await axiosInstance.get(`${INVENTORY_BASE_URL}/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error(`Error fetching inventory (ID: ${id}):`, error);
//     throw error;
//   }
// };

// export const createInventory = async (inventoryData) => {
//   try {
//     const response = await axiosInstance.post(INVENTORY_BASE_URL, inventoryData);
//     return response.data;
//   } catch (error) {
//     console.error("Error creating inventory:", error);
//     throw error;
//   }
// };

// export const updateInventory = async (id, inventoryData) => {
//   try {
//     const response = await axiosInstance.put(`${INVENTORY_BASE_URL}/${id}`, inventoryData);
//     return response.data;
//   } catch (error) {
//     console.error(`Error updating inventory (ID: ${id}):`, error);
//     throw error;
//   }
// };

// export const deleteInventory = async (id) => {
//   try {
//     const response = await axiosInstance.delete(`${INVENTORY_BASE_URL}/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error(`Error deleting inventory (ID: ${id}):`, error);
//     throw error;
//   }
// };

// export const softDeleteInventory = async (id) => {
//   try {
//     const response = await axiosInstance.put(`${INVENTORY_BASE_URL}/soft-delete/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error(`Error soft-deleting inventory (ID: ${id}):`, error);
//     throw error;
//   }
// };

// export const updateVendorService = async (inventoryId, vendorId) => {
//   try {
//     const response = await axiosInstance.put(`${INVENTORY_BASE_URL}/${inventoryId}/vendor/${vendorId}`);
//     return response.data;
//   } catch (error) {
//     console.error(`Error updating vendor (ID: ${inventoryId}):`, error);
//     throw error;
//   }
// };

// // REQUESTS

// export const listRequests = async () => {
//   try {
//     const response = await axiosInstance.get(REQUESTS_BASE_URL);
//     return response.data.map((request) => ({
//       ...request,
//       vendorId: request.vendor?.id || null,
//       customerId: request.customer?.id || null,
//       fieldServiceTaskNumber: request.fieldServiceTaskNumber || "N/A",
//     }));
//   } catch (error) {
//     console.error("Error fetching requests:", error);
//     throw error;
//   }
// };

// export const getRequestById = async (id) => {
//   try {
//     const response = await axiosInstance.get(`${REQUESTS_BASE_URL}/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error(`Error fetching request (ID: ${id}):`, error);
//     throw error;
//   }
// };

// export const updateRequestStatus = async (requestId, status) => {
//   try {
//     const response = await axiosInstance.put(
//       `${REQUESTS_BASE_URL}/${requestId}/status`,
//       { status }
//     );
//     return response.data;
//   } catch (error) {
//     console.error(`Error updating status (ID: ${requestId}):`, error.response?.data || error.message);
//     throw error;
//   }
// };

// // NOTIFICATIONS

// export const sendNotification = async ({ recipient, message, type }) => {
//   try {
//     const response = await axiosInstance.post(`${NOTIFICATION_BASE_URL}/send`, null, {
//       params: { recipient, message, type },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error sending notification:", error);
//     throw error;
//   }
// };

// src/services/apiService.js

// import axiosInstance from "./axios";

// const BASE_URL = "/api";
// const INVENTORY_BASE_URL = `${BASE_URL}/inventory`;
// const REQUESTS_BASE_URL = `${BASE_URL}/requests`;
// const VENDOR_BASE_URL = `${BASE_URL}/vendors`;
// const NOTIFICATION_BASE_URL = `${BASE_URL}/notifications`;

// // INVENTORY

// export const listInventory = async () => {
//   try {
//     const [inventoryResponse, vendorsResponse] = await Promise.all([
//       axiosInstance.get(INVENTORY_BASE_URL),
//       axiosInstance.get(VENDOR_BASE_URL),
//     ]);

//     const vendorMap = vendorsResponse.data.reduce((acc, vendor) => {
//       acc[vendor.id] = vendor.name;
//       return acc;
//     }, {});

//     const inventoryWithVendors = inventoryResponse.data.map((item) => ({
//       ...item,
//       vendorName: vendorMap[item.vendorId] || "Unknown Vendor",
//     }));

//     return { data: inventoryWithVendors };
//   } catch (error) {
//     console.error("Error fetching inventory or vendors:", error);
//     throw error;
//   }
// };

// export const getInventoryById = async (id) => {
//   try {
//     const response = await axiosInstance.get(`${INVENTORY_BASE_URL}/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error(`Error fetching inventory (ID: ${id}):`, error);
//     throw error;
//   }
// };

// export const createInventory = async (inventoryData) => {
//   try {
//     const response = await axiosInstance.post(INVENTORY_BASE_URL, inventoryData);
//     return response.data;
//   } catch (error) {
//     console.error("Error creating inventory:", error);
//     throw error;
//   }
// };

// export const updateInventory = async (id, inventoryData) => {
//   try {
//     const response = await axiosInstance.put(`${INVENTORY_BASE_URL}/${id}`, inventoryData);
//     return response.data;
//   } catch (error) {
//     console.error(`Error updating inventory (ID: ${id}):`, error);
//     throw error;
//   }
// };

// export const deleteInventory = async (id) => {
//   try {
//     const response = await axiosInstance.delete(`${INVENTORY_BASE_URL}/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error(`Error deleting inventory (ID: ${id}):`, error);
//     throw error;
//   }
// };

// export const softDeleteInventory = async (id) => {
//   try {
//     const response = await axiosInstance.put(`${INVENTORY_BASE_URL}/soft-delete/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error(`Error soft-deleting inventory (ID: ${id}):`, error);
//     throw error;
//   }
// };

// export const updateVendorService = async (inventoryId, vendorId) => {
//   try {
//     const response = await axiosInstance.put(
//       `${INVENTORY_BASE_URL}/${inventoryId}/vendor/${vendorId}`
//     );
//     return response.data;
//   } catch (error) {
//     console.error(`Error updating vendor (ID: ${inventoryId}):`, error);
//     throw error;
//   }
// };

// // REQUESTS

// export const listRequests = async () => {
//   try {
//     const response = await axiosInstance.get(REQUESTS_BASE_URL);
//     return response.data.map((request) => ({
//       ...request,
//       vendorId: request.vendor?.id || null,
//       customerId: request.customer?.id || null,
//       fieldServiceTaskNumber: request.fieldServiceTaskNumber || "N/A",
//     }));
//   } catch (error) {
//     console.error("Error fetching requests:", error);
//     throw error;
//   }
// };

// export const getRequestById = async (id) => {
//   try {
//     const response = await axiosInstance.get(`${REQUESTS_BASE_URL}/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error(`Error fetching request (ID: ${id}):`, error);
//     throw error;
//   }
// };

// export const updateRequestStatus = async (requestId, status) => {
//   try {
//     const response = await axiosInstance.put(
//       `${REQUESTS_BASE_URL}/${requestId}/status`,
//       { status }
//     );
//     return response.data;
//   } catch (error) {
//     console.error(
//       `Error updating status (ID: ${requestId}):`,
//       error.response?.data || error.message
//     );
//     throw error;
//   }
// };

// // NOTIFICATIONS

// // Send notification to a role
// export const sendNotification = async ({ receiverRole, message, type, status }) => {
//   try {
//     const response = await axiosInstance.post(
//       "/api/notifications/send",
//       null,
//       {
//         params: {
//           receiverRole,
//           message,
//           type,
//           status, // optional
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error sending notification:", error.response?.data || error.message);
//     throw error;
//   }
// };

// // Get role-based notifications
// export const getRoleNotifications = async (role) => {
//   try {
//     const response = await axiosInstance.get("/api/notifications/role", {
//       headers: { Role: role },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching role notifications:", error.response?.data || error.message);
//     throw error;
//   }
// };

// // Get user-specific notifications
// export const getUserNotifications = async () => {
//   try {
//     const response = await axiosInstance.get("/api/notifications/user");
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching user notifications:", error.response?.data || error.message);
//     throw error;
//   }
// };

// // Update the status of a notification
// export const updateNotificationStatus = async (notificationId, status) => {
//   try {
//     const response = await axiosInstance.put(
//       `/api/notifications/${notificationId}/status?status=${status}`
//     );
//     return response.data;
//   } catch (error) {
//     console.error(`Error updating notification (ID: ${notificationId}):`, error.response?.data || error.message);
//     throw error;
//   }
// };
// src/services/apiService.js

import axiosInstance from "./axios";

const BASE_URL = "/api";
const INVENTORY_BASE_URL = `${BASE_URL}/inventory`;
const REQUESTS_BASE_URL = `${BASE_URL}/requests`;
const VENDOR_BASE_URL = `${BASE_URL}/vendors`;
const NOTIFICATION_BASE_URL = `${BASE_URL}/notifications`;

// INVENTORY
export const listInventory = async () => {
  try {
    const [inventoryRes, vendorRes] = await Promise.all([
      axiosInstance.get(INVENTORY_BASE_URL),
      axiosInstance.get(VENDOR_BASE_URL),
    ]);

    const vendorMap = vendorRes.data.reduce((map, vendor) => {
      map[vendor.id] = vendor.name;
      return map;
    }, {});

    return {
      data: inventoryRes.data.map((item) => ({
        ...item,
        vendorName: vendorMap[item.vendorId] || "Unknown Vendor",
      })),
    };
  } catch (error) {
    console.error("Error fetching inventory:", error);
    throw error;
  }
};

export const getInventoryById = (id) => axiosInstance.get(`${INVENTORY_BASE_URL}/${id}`);
export const createInventory = (data) => axiosInstance.post(INVENTORY_BASE_URL, data);
export const updateInventory = (id, data) => axiosInstance.put(`${INVENTORY_BASE_URL}/${id}`, data);
export const deleteInventory = (id) => axiosInstance.delete(`${INVENTORY_BASE_URL}/${id}`);
export const softDeleteInventory = (id) =>
  axiosInstance.put(`${INVENTORY_BASE_URL}/soft-delete/${id}`);
export const updateVendorService = (inventoryId, vendorId) =>
  axiosInstance.put(`${INVENTORY_BASE_URL}/${inventoryId}/vendor/${vendorId}`);

// REQUESTS
export const listRequests = async () => {
  const response = await axiosInstance.get(REQUESTS_BASE_URL);
  return response.data.map((r) => ({
    ...r,
    vendorId: r.vendor?.id || null,
    customerId: r.customer?.id || null,
    fieldServiceTaskNumber: r.fieldServiceTaskNumber || "N/A",
  }));
};

export const getRequestById = (id) => axiosInstance.get(`${REQUESTS_BASE_URL}/${id}`);

export const updateRequestStatus = async (requestId, status, role = "engineer") => {
  return axiosInstance.put(
    `${REQUESTS_BASE_URL}/${requestId}/status`,
    { status },
    {
      headers: { Role: role },
    }
  );
};

// NOTIFICATIONS
export const sendNotification = ({ receiverRole, message, type, status }) =>
  axiosInstance.post(`${NOTIFICATION_BASE_URL}/send`, null, {
    params: { receiverRole, message, type, status },
  });

export const getRoleNotifications = (role) =>
  axiosInstance.get(`${NOTIFICATION_BASE_URL}/role`, {
    headers: { Role: role },
  });

export const getUserNotifications = () =>
  axiosInstance.get(`${NOTIFICATION_BASE_URL}/user`);

export const updateNotificationStatus = (notificationId, status) =>
  axiosInstance.put(`${NOTIFICATION_BASE_URL}/${notificationId}/status?status=${status}`);
