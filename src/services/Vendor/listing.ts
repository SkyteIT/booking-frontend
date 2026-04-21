import api from "../api";

export const getVendorListings = async (vendorId: string) => {
  const res = await api.get(`/api/listings/vendor/${vendorId}`);
  return res.data;
};