// src/pages/public/search/components/ResultsGrid.tsx
import { Alert, Box, Grid, Paper, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import ListingCard from "../../../../components/cards/ListingCard";
import LoadingSpinner from "../../../../components/common/LoadingSpinner";
import type { SearchListing } from "../../../../services/searchService";

interface Props {
  listings: SearchListing[];
  loading?: boolean;
  error?: string | null;
  hasMore?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => void;
}

export default function ResultsGrid({ listings, loading, error, hasMore, loadingMore, onLoadMore }: Props) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMore || loadingMore || !onLoadMore) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onLoadMore();
      },
      { rootMargin: "400px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
    // Re-created whenever hasMore/loadingMore change so a paused (loadingMore)
    // observer doesn't keep firing into a request that's already in flight.
  }, [hasMore, loadingMore, onLoadMore]);

  if (loading) {
    return <LoadingSpinner fullScreen={false} py={8} />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (listings.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          mt: 2,
          borderRadius: "16px",
          border: "1px solid",
          borderColor: "divider",
          p: 5,
          textAlign: "center",
        }}
      >
        <Typography sx={{ fontWeight: 600, color: "text.primary" }}>
          No listings match your filters.
        </Typography>
        <Typography sx={{ fontSize: "0.88rem", color: "text.secondary", mt: 0.5 }}>
          Try relaxing category, price, or rating filters.
        </Typography>
      </Paper>
    );
  }

  const selectImageForListing = (listing: SearchListing) => {
    if (listing.thumbnailUrl) return listing.thumbnailUrl;

    const title = (listing.title || "").toLowerCase();
    const cat = (listing.categoryName || "").toLowerCase();

    if (title.includes("portrait")) return "https://source.unsplash.com/800x600/?portrait,photography";
    if (title.includes("product")) return "https://source.unsplash.com/800x600/?product,photography";
    if (title.includes("event")) return "https://source.unsplash.com/800x600/?event,photography,concert";
    if (cat.includes("photography")) return "https://source.unsplash.com/800x600/?photography";
    if (cat.includes("car")) return "https://source.unsplash.com/800x600/?car,rental";

    // fallback by category name or generic travel
    const q = encodeURIComponent(listing.categoryName || "travel");
    return `https://source.unsplash.com/800x600/?${q}`;
  };

  return (
    <>
      <Grid container spacing={3}>
        {listings.map((listing) => (
          <Grid key={listing.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <ListingCard
              id={listing.id}
              image={selectImageForListing(listing)}
              title={listing.title}
              category={listing.categoryName}
              price={`${listing.currency} ${listing.price.toLocaleString()}`}
              rating={listing.averageRating}
              location={listing.location}
              badge={listing.isFeatured ? "Featured" : undefined}
              offerLabel={listing.hasActiveOffer ? listing.offerBadgeText ?? "Special Offer" : undefined}
            />
          </Grid>
        ))}
      </Grid>

      {hasMore && (
        <Box ref={sentinelRef} sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          {loadingMore && <LoadingSpinner fullScreen={false} size={28} />}
        </Box>
      )}
    </>
  );
}
