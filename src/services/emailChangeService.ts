// src/services/emailChangeService.ts
// Changing your own email is never self-service, regardless of role -
// this queues the ask and only a SuperAdmin's approval actually applies it.
import api from "./api";

export type EmailChangeRequestStatus = "Pending" | "Approved" | "Rejected";

export interface EmailChangeRequestDto {
  id: string;
  userId: string;
  userName: string;
  currentEmail: string;
  requestedEmail: string;
  reason?: string | null;
  status: EmailChangeRequestStatus;
  reviewedByUserId?: string | null;
  reviewedAt?: string | null;
  reviewNotes?: string | null;
  createdAt: string;
}

export interface PagedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export const createEmailChangeRequest = async (requestedEmail: string, reason?: string) => {
  const res = await api.post<EmailChangeRequestDto>("/email-change-requests", { requestedEmail, reason });
  return res.data;
};

export const getMyEmailChangeRequests = async () => {
  const res = await api.get<EmailChangeRequestDto[]>("/email-change-requests/mine");
  return res.data;
};

export const getEmailChangeRequests = async (params: {
  status?: EmailChangeRequestStatus;
  pageNumber?: number;
  pageSize?: number;
}) => {
  const res = await api.get<PagedResult<EmailChangeRequestDto>>("/email-change-requests", {
    params: {
      Status: params.status,
      PageNumber: params.pageNumber ?? 1,
      PageSize: params.pageSize ?? 10,
    },
  });
  return res.data;
};

export const approveEmailChangeRequest = async (id: string) => {
  const res = await api.post<EmailChangeRequestDto>(`/email-change-requests/${id}/approve`);
  return res.data;
};

export const rejectEmailChangeRequest = async (id: string, notes?: string) => {
  const res = await api.post<EmailChangeRequestDto>(`/email-change-requests/${id}/reject`, { notes });
  return res.data;
};
