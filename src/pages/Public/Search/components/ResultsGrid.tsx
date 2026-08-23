// src/pages/public/search/components/ResultsGrid.tsx
import { Alert, Box, CircularProgress, Grid, Paper, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import ListingCard from "../../../../components/cards/ListingCard";
import LoadingSpinner from "../../../../components/common/LoadingSpinner";
import type { SearchListing } from "../../../../services/searchService";
import { hashSeed, imageForCategory } from "../../../../utils/categoryImages";

interface Props {
  listings: SearchListing[];
  loading?: boolean;
  error?: string | null;
  hasMore?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => void;
}

export default function ResultsGrid({ listings, loading, error, hasMore = false, loadingMore = false, onLoadMore }: Props) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || loadingMore || !onLoadMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onLoadMore();
        }
      },
      { rootMargin: "200px 0px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
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

  const selectImageForListing = (listing: SearchListing) =>
    listing.thumbnailUrl || imageForCategory(listing.categoryName, hashSeed(listing.id));

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

      <Box ref={sentinelRef} sx={{ height: 1 }} />

      {loadingMore && (
        <Box display="flex" justifyContent="center" py={3}>
          <CircularProgress size={22} />
        </Box>
      )}
    </>
  );
}
