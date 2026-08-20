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
    <Grid container spacing={3}>
      {listings.map((listing) => (
        <Grid key={listing.id} size={{ xs: 12, sm: 6, md: 4 }}>
          <ListingCard
            id={listing.id}
            image={selectImageForListing(listing)}
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
