import api from "./api";
import type { PagedResult } from "./reviewService";

export interface QuestionDto {
  id: string;
  questionText: string;
  answerText?: string | null;
  answeredAt?: string | null;
  createdAt: string;
  customerName: string;
}

export interface GetQuestionsParams {
  pageNumber?: number;
  pageSize?: number;
}

export const getListingQuestions = async (
  listingId: string,
  params: GetQuestionsParams = {}
): Promise<PagedResult<QuestionDto>> => {
  const res = await api.get<PagedResult<QuestionDto>>(`/listings/${listingId}/questions`, {
    params: {
      PageNumber: params.pageNumber,
      PageSize: params.pageSize,
    },
  });
  return res.data;
};

// Ask a question about a listing - requires the caller to be signed in
// as a customer. Not a review: no rating, no completed-booking check.
export const askQuestion = async (
  listingId: string,
  questionText: string
): Promise<{ message: string }> => {
  const res = await api.post<{ message: string }>(`/listings/${listingId}/questions`, { questionText });
  return res.data;
};

// Vendor-only: all questions across the vendor's own listings.
export const getVendorQuestions = async (
  params: GetQuestionsParams = {}
): Promise<PagedResult<QuestionDto>> => {
  const res = await api.get<PagedResult<QuestionDto>>("/vendor/questions", {
    params: {
      PageNumber: params.pageNumber,
      PageSize: params.pageSize,
    },
  });
  return res.data;
};

// Vendor-only: answer a question left on one of their own listings.
export const answerQuestion = async (
  questionId: string,
  answerText: string
): Promise<{ message: string }> => {
  const res = await api.post<{ message: string }>(`/vendor/questions/${questionId}/answer`, { answerText });
  return res.data;
};
