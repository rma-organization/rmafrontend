import axiosInstance from "./axios";

const REQUESTS_BASE_URL = "/requests";

export const listRequests = async () => {
  const response = await axiosInstance.get(REQUESTS_BASE_URL);
  return response.data.map((r) => ({
    ...r,
    vendorId: r.vendor?.id || null,
    customerId: r.customer?.id || null,
    fieldServiceTaskNumber: r.fieldServiceTaskNumber || "N/A",
  }));
};

export const createRequest = (data) => axiosInstance.post(REQUESTS_BASE_URL, data);
export const updateRequest = (id, data) => axiosInstance.put(`${REQUESTS_BASE_URL}/${id}`, data);
export const getRequestById = (id) => axiosInstance.get(`${REQUESTS_BASE_URL}/${id}`);
export const updateRequestStatus = (id, status) =>
  axiosInstance.put(`${REQUESTS_BASE_URL}/${id}/status`, { status });
