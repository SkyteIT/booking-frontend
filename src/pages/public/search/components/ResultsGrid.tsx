// Results grid: renders filtered listing cards.
// If nothing matches, it shows a clear empty-state message.
import { Grid, Paper, Typography } from "@mui/material";
import ListingCard from "../../../../components/cards/ListingCard";
import type { Listing } from "../utils/types";

interface ResultsGridProps {
  listings: Listing[];
}

const ResultsGrid = ({ listings }: ResultsGridProps) => {
  return (
    <>
      <Grid container spacing={2.3}>
        {listings.map((listing) => (
          <Grid key={listing.id} size={{ xs: 12, sm: 6 }}>
            <ListingCard
              id={listing.id}
              image={listing.image}
              title={listing.title}
              category={listing.category}
              price={`$${listing.price}/${listing.priceUnit}`}
              rating={listing.rating}
              location={listing.location}
            />
          </Grid>
        ))}
      </Grid>

      {listings.length === 0 && (
        <Paper
          elevation={0}
          sx={{
            mt: 2,
            borderRadius: "10px",
            border: "1px solid #E2E8F0",
            p: 3,
            textAlign: "center",
          }}
        >
          <Typography sx={{ fontWeight: 600, color: "#0F172A" }}>
            No listings match your filters.
          </Typography>
          <Typography sx={{ fontSize: "0.85rem", color: "#64748B", mt: 0.5 }}>
            Try relaxing category, price, or rating filters.
          </Typography>
        </Paper>
      )}
    </>
  );
};

export default ResultsGrid;
