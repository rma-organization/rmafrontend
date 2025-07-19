import axios from "axios";

// Base API URL
const BASE_URL = "http://localhost:8080/api";
const INVENTORY_BASE_URL = `${BASE_URL}/inventory`;
const REQUESTS_BASE_URL = `${BASE_URL}/requests`;
const VENDOR_BASE_URL = `${BASE_URL}/vendors`;

/**
 * Get inventory list with vendor names
 */
export const listInventory = async () => {
  try {
    const inventoryResponse = await axios.get(INVENTORY_BASE_URL);
    const vendorsResponse = await axios.get(VENDOR_BASE_URL);

    // Map vendor IDs to vendor names
    const vendorMap = vendorsResponse.data.reduce((acc, vendor) => {
      acc[vendor.id] = vendor.name;
      return acc;
    }, {});

    // Add vendor name to inventory items
    const inventoryWithVendorNames = inventoryResponse.data.map((item) => ({
      ...item,
      vendorName: vendorMap[item.vendorId] || "Unknown Vendor",
    }));

    return { data: inventoryWithVendorNames };
  } catch (error) {
    console.error("Error fetching inventory or vendors:", error);
    throw error;
  }
};

/**
 * Get all requests with extracted vendor & customer IDs
 */
export const listRequests = async () => {
  try {
    const response = await axios.get(REQUESTS_BASE_URL);
    return response.data.map((request) => ({
      ...request,
      vendorId: request.vendor ? request.vendor.id : null,
      customerId: request.customer ? request.customer.id : null,
      fieldServiceTaskNumber: request.fieldServiceTaskNumber || "N/A",
    }));
  } catch (error) {
    console.error("Error fetching requests:", error);
    throw error;
  }
};

/**
 * Get a request by ID
 */
export const getRequestById = async (id) => {
  try {
    const response = await axios.get(`${REQUESTS_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching request (ID: ${id}):`, error);
    throw error;
  }
};

/**
 * Get a single inventory item by ID
 */
export const getInventoryById = async (id) => {
  try {
    const response = await axios.get(`${INVENTORY_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching inventory item (ID: ${id}):`, error);
    throw error;
  }
};

/**
 * Create a new inventory item
 */
export const createInventory = async (inventoryData) => {
  try {
    const response = await axios.post(INVENTORY_BASE_URL, inventoryData);
    return response.data;
  } catch (error) {
    console.error("Error creating inventory:", error);
    throw error;
  }
};

/**
 * Update an existing inventory item
 */
export const updateInventory = async (id, inventoryData) => {
  try {
    const response = await axios.put(`${INVENTORY_BASE_URL}/${id}`, inventoryData);
    return response.data;
  } catch (error) {
    console.error(`Error updating inventory (ID: ${id}):`, error);
    throw error;
  }
};

/**
 * Delete an inventory item by ID
 */
export const deleteInventory = async (id) => {
  try {
    const response = await axios.delete(`${INVENTORY_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting inventory (ID: ${id}):`, error);
    throw error;
  }
};

/**
 * Soft delete an inventory item by ID (marks as deleted, doesn't remove from DB)
 */
export const softDeleteInventory = async (id) => {
  try {
    const response = await axios.put(`${INVENTORY_BASE_URL}/soft-delete/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error soft-deleting inventory (ID: ${id}):`, error);
    throw error;
  }
};

/**
 * Update the vendor for an inventory item
 */
export const updateVendorService = async (inventoryId, vendorId) => {
  try {
    const response = await axios.put(`${INVENTORY_BASE_URL}/${inventoryId}/vendor/${vendorId}`);
    return response.data;
  } catch (error) {
    console.error(`Error updating vendor for inventory (ID: ${inventoryId}):`, error);
    throw error;
  }
};

/**
 * Update the status of a request (Fixed URL with /status)
 */
export const updateRequestStatus = async (requestId, status) => {
  try {
    const response = await axios.put(
      `${REQUESTS_BASE_URL}/${requestId}/status`,  // Fixed API URL
      { status },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error) {
    console.error(`❌ Error updating status for request (ID: ${requestId}):`, error.response?.data || error.message);
    throw error;
  }
};
