import axiosInstance from "./axios";

export const getVendors = async () => {
  const response = await axiosInstance.get("/api/vendors");
  return response.data;
};

export const getCustomers = async () => {
  const response = await axiosInstance.get("/api/customers");
  return response.data;
};

export const searchInventoryParts = async (query) => {
  const response = await axiosInstance.get(`/api/inventory/search`, {
    params: { query },
  });
  return response.data;
};

// ADD THIS FUNCTION:
export const searchInventoryBySerial = async (serial) => {
  const response = await axiosInstance.get(`/api/inventory/search-by-serial`, {
    params: { serial },
  });
  return response.data;
};
