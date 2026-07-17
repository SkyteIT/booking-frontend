import api from "../api";

export const getVendorListings = async () => {
  const res = await api.get(`/listings`);
  return res.data;
};