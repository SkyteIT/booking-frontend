// Vendor-side Q&A: list questions across all of the vendor's listings,
// answer inline. Same reply-UI pattern as the Reviews tab's reply flow,
// applied to a plain-text question instead of a star-rated review.
import { Box, Card, CardContent, Stack, Typography, Avatar, Button, TextField } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useState } from "react";
import SnackbarAlert from "../../../components/common/SnackbarAlert";
import {
  answerQuestion,
  getVendorQuestions,
  type QuestionDto,
} from "../../../services/questionService";

const PAGE_SIZE = 10;

export default function VendorQuestionsTab() {
  const [questions, setQuestions] = useState<QuestionDto[]>([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [answeringId, setAnsweringId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState("");
  const [sendingAnswer, setSendingAnswer] = useState(false);

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getVendorQuestions({ pageNumber: 1, pageSize: PAGE_SIZE })
      .then((res) => {
        if (cancelled) return;
        setQuestions(res.items);
        setPage(1);
        setPageCount(res.totalPages || 1);
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load questions.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSeeMore = async () => {
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await getVendorQuestions({ pageNumber: nextPage, pageSize: PAGE_SIZE });
      setQuestions((prev) => [...prev, ...res.items]);
      setPage(nextPage);
      setPageCount(res.totalPages || 1);
    } catch {
      setError("Failed to load more questions.");
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSendAnswer = async (questionId: string) => {
    if (!answerText.trim()) return;
    setSendingAnswer(true);
    try {
      await answerQuestion(questionId, answerText.trim());
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId ? { ...q, answerText: answerText.trim(), answeredAt: new Date().toISOString() } : q
        )
      );
      setSnackbar({ open: true, message: "Answer sent", severity: "success" });
      setAnsweringId(null);
      setAnswerText("");
    } catch {
      setSnackbar({ open: true, message: "Failed to send answer", severity: "error" });
    } finally {
      setSendingAnswer(false);
    }
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
        bgcolor: "background.paper",
      }}
    >
      <CardContent sx={{ pt: 2, pb: 2.5 }}>
        {error ? (
          <Box
            sx={(t) => ({
              p: 2,
              borderRadius: 2,
              bgcolor: alpha(t.palette.error.main, 0.08),
              border: `1px solid ${alpha(t.palette.error.main, 0.2)}`,
            })}
          >
            <Typography variant="body2" sx={{ color: "error.main", fontWeight: 500 }}>
              {error}
            </Typography>
          </Box>
        ) : loading ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
            Loading questions...
          </Typography>
        ) : questions.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
            No questions yet
          </Typography>
        ) : (
          <Stack spacing={2}>
            {questions.map((q) => (
              <Box
                key={q.id}
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Avatar sx={{ bgcolor: "secondary.main" }}>
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
                      <Box sx={{ mt: 1.5, pl: 1.5, borderLeft: "2px solid", borderColor: "primary.main" }}>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: "primary.main" }}>
                          Your answer
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          {q.answerText}
                        </Typography>
                      </Box>
                    ) : answeringId === q.id ? (
                      <Stack spacing={1} sx={{ mt: 1.5 }}>
                        <TextField
                          size="small"
                          multiline
                          minRows={2}
                          placeholder="Write an answer..."
                          value={answerText}
                          onChange={(e) => setAnswerText(e.target.value)}
                          fullWidth
                        />
                        <Stack direction="row" spacing={1}>
                          <Button
                            size="small"
                            variant="contained"
                            disabled={sendingAnswer || !answerText.trim()}
                            onClick={() => handleSendAnswer(q.id)}
                          >
                            {sendingAnswer ? "Sending..." : "Send answer"}
                          </Button>
                          <Button
                            size="small"
                            onClick={() => {
                              setAnsweringId(null);
                              setAnswerText("");
                            }}
                          >
                            Cancel
                          </Button>
                        </Stack>
                      </Stack>
                    ) : (
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{ mt: 1.5, textTransform: "none" }}
                        onClick={() => {
                          setAnsweringId(q.id);
                          setAnswerText("");
                        }}
                      >
                        Answer
                      </Button>
                    )}
                  </Box>
                </Stack>
              </Box>
            ))}
          </Stack>
        )}

        {!loading && page < pageCount && (
          <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
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
      </CardContent>

      <SnackbarAlert
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      />
    </Card>
  );
}
