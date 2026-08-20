// src/services/Vendor/supportService.ts
import api from "../api";

export type SubmitSupportTicketPayload = {
  subject: string;
  message: string;
};

export const submitSupportTicket = (payload: SubmitSupportTicketPayload) =>
  api.post("/support/tickets", payload);
