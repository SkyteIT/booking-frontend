// src/pages/public/search/components/ResultsGrid.tsx
import { Grid, Typography, CircularProgress, Box, Alert } from "@mui/material";
import type { SearchListing } from "../../../../services/searchService";

interface Props {
  listings: SearchListing[];
  loading: boolean;
  error: string | null;
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
    <Grid container spacing={2}>
      {listings.map((listing) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={listing.id}>
          <Box
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              overflow: "hidden",
              height: "100%",
            }}
          >
            <Box
              sx={{
                height: 180,
                bgcolor: "grey.200",
                backgroundImage: listing.thumbnailUrl
                  ? `url(${listing.thumbnailUrl})`
                  : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <Box p={2}>
              <Typography variant="subtitle1" fontWeight={600} noWrap>
                {listing.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {listing.categoryName} · {listing.location}
              </Typography>
              <Typography variant="body2" mt={1}>
                From <strong>${listing.priceFrom}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ⭐ {listing.rating?.toFixed(1) ?? "N/A"}
                {listing.isAvailable ? " · Available" : " · Unavailable"}
              </Typography>
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}