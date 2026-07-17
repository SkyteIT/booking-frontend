import api from "../api";

export const getVendorListings = async () => {
  const res = await api.get(`/api/listings`);
  return res.data;
};