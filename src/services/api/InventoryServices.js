// import axiosInstance from "./axios";

// const BASE_URL = "/api";
// const INVENTORY_BASE_URL = `${BASE_URL}/inventory`;
// const REQUESTS_BASE_URL = `${BASE_URL}/requests`;
// const VENDOR_BASE_URL = `${BASE_URL}/vendors`;
// const NOTIFICATION_BASE_URL = `${BASE_URL}/notifications`;

// // INVENTORY
// export const listInventory = async () => {
//   try {
//     const [inventoryRes, vendorRes] = await Promise.all([
//       axiosInstance.get(INVENTORY_BASE_URL),
//       axiosInstance.get(VENDOR_BASE_URL),
//     ]);

//     const vendorMap = vendorRes.data.reduce((map, vendor) => {
//       map[vendor.id] = vendor.name;
//       return map;
//     }, {});

//     return {
//       data: inventoryRes.data.map((item) => ({
//         ...item,
//         vendorName: vendorMap[item.vendorId] || "Unknown Vendor",
//       })),
//     };
//   } catch (error) {
//     console.error("Error fetching inventory:", error);
//     throw error;
//   }
// };

// export const getInventoryById = (id) => axiosInstance.get(`${INVENTORY_BASE_URL}/${id}`);
// export const createInventory = (data) => axiosInstance.post(INVENTORY_BASE_URL, data);
// export const updateInventory = (id, data) => axiosInstance.put(`${INVENTORY_BASE_URL}/${id}`, data);
// export const deleteInventory = (id) => axiosInstance.delete(`${INVENTORY_BASE_URL}/${id}`);
// export const softDeleteInventory = (id) =>
//   axiosInstance.put(`${INVENTORY_BASE_URL}/soft-delete/${id}`);
// export const updateVendorService = (inventoryId, vendorId) =>
//   axiosInstance.put(`${INVENTORY_BASE_URL}/${inventoryId}/vendor/${vendorId}`);

// // ========== REQUESTS ==========
// export const listRequests = async () => {
//   const response = await axiosInstance.get(REQUESTS_BASE_URL);
//   return response.data.map((r) => ({
//     ...r,
//     vendorId: r.vendor?.id || null,
//     customerId: r.customer?.id || null,
//     fieldServiceTaskNumber: r.fieldServiceTaskNumber || "N/A",
//   }));
// };

// export const getRequestById = (id) => axiosInstance.get(`${REQUESTS_BASE_URL}/${id}`);

// export const updateRequestStatus = async (requestId, status) => {
//   return axiosInstance.put(`${REQUESTS_BASE_URL}/${requestId}/status`, { status });
// };

// // ========== NOTIFICATIONS ==========
// export const sendNotification = ({ receiverRole, message, type, status,requestsId }) =>
//   axiosInstance.post(`${NOTIFICATION_BASE_URL}/send`, null, {
//     params: { receiverRole, message, type, status, requestsId },
//   });

// export const getRoleNotifications = () =>
//   axiosInstance.get(`${NOTIFICATION_BASE_URL}/role`);

// export const getUserNotifications = () =>
//   axiosInstance.get(`${NOTIFICATION_BASE_URL}/user`);

// export const updateNotificationStatus = (notificationId, status) =>
//   axiosInstance.put(`${NOTIFICATION_BASE_URL}/${notificationId}/status?status=${status}`);


// src/services/api/InventoryServices.js
import axiosInstance from "./axios";

const INVENTORY_BASE_URL = "/api/inventory";
const VENDOR_BASE_URL = "/api/vendors";
const CUSTOMER_BASE_URL = "/api/customers";

// INVENTORY
export const listInventory = async () => {
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
};

export const getInventoryById = (id) =>
  axiosInstance.get(`${INVENTORY_BASE_URL}/${id}`);

export const createInventory = (data) =>
  axiosInstance.post(INVENTORY_BASE_URL, data);

export const updateInventory = (id, data) =>
  axiosInstance.put(`${INVENTORY_BASE_URL}/${id}`, data);

export const deleteInventory = (id) =>
  axiosInstance.delete(`${INVENTORY_BASE_URL}/${id}`);

export const softDeleteInventory = (id) =>
  axiosInstance.put(`${INVENTORY_BASE_URL}/soft-delete/${id}`);

export const updateVendorService = (inventoryId, vendorId) =>
  axiosInstance.put(`${INVENTORY_BASE_URL}/${inventoryId}/vendor/${vendorId}`);

// ✅ Search parts by partial name/part number
export const searchInventoryParts = async (query) => {
  const response = await axiosInstance.get(`${INVENTORY_BASE_URL}/search`, {
    params: { query },
  });
  return response.data;
};

// ✅ Search inventory by serial number
export const searchInventoryBySerial = async (serial) => {
  const response = await axiosInstance.get(`${INVENTORY_BASE_URL}/search-by-serial`, {
    params: { serial },
  });
  return response.data;
};

// VENDORS & CUSTOMERS
export const getVendors = () =>
  axiosInstance.get(VENDOR_BASE_URL).then((res) => res.data);

export const getCustomers = () =>
  axiosInstance.get(CUSTOMER_BASE_URL).then((res) => res.data);
