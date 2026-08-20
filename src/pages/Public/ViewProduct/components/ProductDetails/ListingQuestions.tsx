// Plain-text Q&A about a listing - deliberately separate from
// ListingReviews: no star rating anywhere here, no completed-booking
// requirement to ask. Same chunked "See more" loading pattern as
// reviews, backed by real server-side pagination.
import { Box, Stack, Typography, Avatar, Button, Divider, TextField, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../../context/useAuth";
import { askQuestion, getListingQuestions, type QuestionDto } from "../../../../../services/questionService";

const PAGE_SIZE = 5;

interface ListingQuestionsProps {
  listingId: string;
}

const ListingQuestions = ({ listingId }: ListingQuestionsProps) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [questions, setQuestions] = useState<QuestionDto[]>([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [questionText, setQuestionText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // Bumped after a successful "ask" to trigger a page-1 reload, without
  // needing a separately-memoized load function the effect must depend on.
  const [reloadTick, setReloadTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getListingQuestions(listingId, { pageNumber: 1, pageSize: PAGE_SIZE })
      .then((res) => {
        if (cancelled) return;
        setQuestions(res.items);
        setPage(1);
        setPageCount(res.totalPages || 1);
      })
      .catch(() => {
        if (!cancelled) setQuestions([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [listingId, reloadTick]);

  const handleSeeMore = async () => {
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await getListingQuestions(listingId, { pageNumber: nextPage, pageSize: PAGE_SIZE });
      setQuestions((prev) => [...prev, ...res.items]);
      setPage(nextPage);
      setPageCount(res.totalPages || 1);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleAsk = async () => {
    if (!questionText.trim()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await askQuestion(listingId, questionText.trim());
      setQuestionText("");
      setReloadTick((t) => t + 1);
    } catch {
      setSubmitError("Couldn't submit your question. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Divider sx={{ mb: 3 }} />
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, letterSpacing: "-0.01em" }}>
        Questions & Answers
      </Typography>

      {isAuthenticated ? (
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            multiline
            minRows={2}
            size="small"
            placeholder="Ask a question about this listing..."
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
          />
          {submitError && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {submitError}
            </Alert>
          )}
          <Button
            variant="contained"
            size="small"
            sx={{ mt: 1.5, textTransform: "none", borderRadius: "10px" }}
            disabled={submitting || !questionText.trim()}
            onClick={handleAsk}
          >
            {submitting ? "Submitting..." : "Ask question"}
          </Button>
        </Box>
      ) : (
        <Box sx={{ mb: 3 }}>
          <Button
            variant="outlined"
            size="small"
            sx={{ textTransform: "none", borderRadius: "10px" }}
            onClick={() => navigate(`/login?next=/view-product/${listingId}`)}
          >
            Log in to ask a question
          </Button>
        </Box>
      )}

      {loading ? (
        <Typography variant="body2" color="text.secondary">
          Loading questions...
        </Typography>
      ) : questions.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No questions yet. Be the first to ask.
        </Typography>
      ) : (
        <Stack spacing={2}>
          {questions.map((q) => (
            <Box
              key={q.id}
              sx={{
                p: 2,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="flex-start">
                <Avatar sx={{ bgcolor: "secondary.main", width: 32, height: 32, fontSize: "0.9rem" }}>
                  {q.customerName.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {q.customerName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(q.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ mt: 0.5, color: "text.primary" }}>
                    {q.questionText}
                  </Typography>

                  {q.answerText ? (
                    <Box
                      sx={{
                        mt: 1.5,
                        pl: 1.5,
                        borderLeft: "2px solid",
                        borderColor: "primary.main",
                      }}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 600, color: "primary.main" }}>
                        Vendor response
                      </Typography>
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        {q.answerText}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="caption" sx={{ display: "block", mt: 1, color: "text.secondary" }}>
                      Awaiting a response from the vendor.
                    </Typography>
                  )}
                </Box>
              </Stack>
            </Box>
          ))}
        </Stack>
      )}

      {!loading && page < pageCount && (
        <Box sx={{ mt: 2.5, display: "flex", justifyContent: "center" }}>
          <Button
            variant="outlined"
            size="small"
            onClick={handleSeeMore}
            disabled={loadingMore}
            sx={{ textTransform: "none", borderRadius: "10px" }}
          >
            {loadingMore ? "Loading..." : "See more questions"}
          </Button>
        </Box>
      )}
    </>
  );
};

export default ListingQuestions;
