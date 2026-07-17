// src/pages/public/search/components/ResultsGrid.tsx
import { Alert, Box, CircularProgress, Grid, Typography } from "@mui/material";
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
      <Typography color="text.secondary" py={4} textAlign="center">
        No listings match your filters.
      </Typography>
    );
  }

  return (
    <Grid container spacing={2.3}>
      {listings.map((listing) => (
        <Grid key={listing.id} size={{ xs: 12, sm: 6, md: 4 }}>
          <ListingCard
            id={listing.id}
            image={listing.thumbnailUrl ?? ""}
            title={listing.title}
            category={listing.categoryName}
            price={`$${listing.priceFrom}`}
            rating={listing.rating}
            location={listing.location}
            badge={listing.isFeatured ? "Featured" : undefined}
          />
        </Grid>
      ))}
    </Grid>
  );
}
