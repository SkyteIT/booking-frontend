import api from "../api";

type GetVendorApplicationsParams = {
  status?: string;
  sortOptions?: string;
  search?: string;
  pageNumber?: number;
  pageSize?: number;
};

export const getVendorApplications = async ({
  status,
  sortOptions,
  search,
  pageNumber,
  pageSize,
}: GetVendorApplicationsParams = {}) => {
  const res = await api.get("/api/admin/vendor-applications", {
    params: {
      status,
      SortOptions: sortOptions,
      Search: search,
      PageNumber: pageNumber,
      PageSize: pageSize,
    },
  });

  return res.data;
};

export const reviewVendorApplication = async (id: string, status: string, Reason?: string) => {
  await api.patch(`/api/admin/vendor-applications/${id}/review`, {
    status,
    rejectedReason: Reason,
  });
};
export const getVendorApplicationById = async (id: string) => {
  const res = await api.get(`/api/admin/vendor-applications/${id}`);
  return res.data;
};

