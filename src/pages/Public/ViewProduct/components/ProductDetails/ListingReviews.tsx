// Individual review content for a listing - the aggregate rating already
// shows above (in ProductDetails), this shows the actual comments behind
// that number, using the listing-scoped review endpoint.
//
// Loads chunk by chunk behind a "See more" button - each click is a real
// new PageNumber/PageSize server request (genuine server-side pagination),
// appended to what's already shown, never a client-side slice of an
// over-fetched list.
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Box, Stack, Typography, Avatar, Rating, Button, Divider, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../../context/useAuth";
import { getListingReviews, toggleReviewLike, type ReviewDto } from "../../../../../services/reviewService";
import LoadingSpinner from "../../../../../components/common/LoadingSpinner";

const PAGE_SIZE = 5;

interface ListingReviewsProps {
  listingId: string;
}

const ListingReviews = ({ listingId }: ListingReviewsProps) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<ReviewDto[]>([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Reset and load page 1 whenever the listing changes.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getListingReviews(listingId, { pageNumber: 1, pageSize: PAGE_SIZE })
      .then((res) => {
        if (cancelled) return;
        setReviews(res.items);
        setPage(1);
        setPageCount(res.totalPages || 1);
      })
      .catch(() => {
        if (!cancelled) setReviews([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [listingId]);

  const handleSeeMore = async () => {
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await getListingReviews(listingId, { pageNumber: nextPage, pageSize: PAGE_SIZE });
      setReviews((prev) => [...prev, ...res.items]);
      setPage(nextPage);
      setPageCount(res.totalPages || 1);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleToggleLike = async (review: ReviewDto) => {
    if (!isAuthenticated) {
      navigate(`/login?next=/view-product/${listingId}`);
      return;
    }

    // Optimistic toggle - flip immediately, revert if the request fails.
    const previous = { likeCount: review.likeCount, isLikedByCurrentUser: review.isLikedByCurrentUser };
    setReviews((prev) =>
      prev.map((r) =>
        r.id === review.id
          ? { ...r, isLikedByCurrentUser: !r.isLikedByCurrentUser, likeCount: r.likeCount + (r.isLikedByCurrentUser ? -1 : 1) }
          : r
      )
    );
    try {
      const result = await toggleReviewLike(review.id);
      setReviews((prev) =>
        prev.map((r) =>
          r.id === review.id ? { ...r, likeCount: result.likeCount, isLikedByCurrentUser: result.isLiked } : r
        )
      );
    } catch {
      setReviews((prev) =>
        prev.map((r) => (r.id === review.id ? { ...r, ...previous } : r))
      );
    }
  };

  if (!loading && reviews.length === 0) return null;

  return (
    <>
      <Divider sx={{ mb: 3 }} />
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, letterSpacing: "-0.01em" }}>
        Reviews
      </Typography>

      {loading ? (
        <LoadingSpinner fullScreen={false} py={3} />
      ) : (
        <Stack spacing={2}>
          {reviews.map((review) => (
            <Box
              key={review.id}
              sx={{
                p: 2,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="flex-start">
                <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32, fontSize: "0.9rem" }}>
                  {review.customerName.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {review.customerName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Typography>
                  </Stack>
                  <Rating value={review.rating} size="small" readOnly sx={{ mt: 0.25 }} />
                  <Typography variant="body2" sx={{ mt: 1, color: "text.primary" }}>
                    {review.comment}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.5 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleToggleLike(review)}
                      sx={{ color: review.isLikedByCurrentUser ? "error.main" : "text.secondary" }}
                    >
                      {review.isLikedByCurrentUser ? (
                        <FavoriteIcon fontSize="small" />
                      ) : (
                        <FavoriteBorderIcon fontSize="small" />
                      )}
                    </IconButton>
                    <Typography variant="caption" color="text.secondary">
                      {review.likeCount > 0 ? review.likeCount : ""}
                    </Typography>
                  </Stack>
                  {review.vendorReply && (
                    <Box
                      sx={{
                        mt: 1.5,
                        p: 1.5,
                        borderRadius: 1.5,
                        bgcolor: "action.hover",
                      }}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        Vendor reply
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {review.vendorReply}
                      </Typography>
                    </Box>
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
            {loadingMore ? "Loading..." : "See more reviews"}
          </Button>
        </Box>
      )}
    </>
  );
};

export default ListingReviews;
