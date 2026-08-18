// src/pages/public/search/components/ResultsGrid.tsx
import { Alert, Box, CircularProgress, Grid, Paper, Typography } from "@mui/material";
import ListingCard from "../../../../components/cards/ListingCard";
import type { SearchListing } from "../../../../services/searchService";

interface Props {
  listings: SearchListing[];
  loading?: boolean;
  error?: string | null;
}

export default function ResultsGrid({ listings, loading, error }: Props) {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress />
      </Box>
    );
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

  return (
    <Grid container spacing={3}>
      {listings.map((listing) => (
        <Grid key={listing.id} size={{ xs: 12, sm: 6, md: 4 }}>
          <ListingCard
            id={listing.id}
            image={listing.thumbnailUrl ?? ""}
            title={listing.title}
            category={listing.categoryName}
            price={`$${listing.price}`}
            rating={listing.averageRating}
            location={listing.location}
            badge={listing.isFeatured ? "Featured" : undefined}
            offerLabel={listing.hasActiveOffer ? listing.offerBadgeText ?? "Special Offer" : undefined}
          />
        </Grid>
      ))}
    </Grid>
  );
}
