import api from "../api";
import type { RoleChangeRequestDto } from "./adminService";

export type { RoleChangeRequestDto };

export interface PagedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export const getRoleChangeRequests = async (params: {
  status?: string;
  pageNumber?: number;
  pageSize?: number;
}): Promise<PagedResult<RoleChangeRequestDto>> => {
  const res = await api.get<PagedResult<RoleChangeRequestDto>>("/admin/role-change-requests", {
    params: {
      Status: params.status,
      PageNumber: params.pageNumber,
      PageSize: params.pageSize,
    },
  });
  return res.data;
};

export const getMyRoleChangeRequests = async (): Promise<RoleChangeRequestDto[]> => {
  const res = await api.get<RoleChangeRequestDto[]>("/admin/role-change-requests/mine");
  return res.data;
};

export const approveRoleChangeRequest = async (id: string): Promise<RoleChangeRequestDto> => {
  const res = await api.post<RoleChangeRequestDto>(`/admin/role-change-requests/${id}/approve`);
  return res.data;
};

export const rejectRoleChangeRequest = async (id: string, notes?: string): Promise<RoleChangeRequestDto> => {
  const res = await api.post<RoleChangeRequestDto>(`/admin/role-change-requests/${id}/reject`, { notes });
  return res.data;
};
