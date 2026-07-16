// src/pages/public/search/components/ResultsGrid.tsx
import {Grid,Typography,CircularProgress,Box,Alert,Button,Chip,} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
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
              display: "flex",
              flexDirection: "column",
              bgcolor: "background.paper",
              transition: "box-shadow 0.2s",
              "&:hover": {
                boxShadow: 3,
              },
            }}
          >
            {/* Image with Available badge */}
            <Box sx={{ position: "relative" }}>
              <Box
                sx={{
                  height: 200,
                  bgcolor: "grey.200",
                  backgroundImage: listing.thumbnailUrl
                    ? `url(${listing.thumbnailUrl})`
                    : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              {listing.isAvailable && (
                <Chip
                  label="Available"
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    bgcolor: "#22c55e",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "0.7rem",
                    height: 24,
                    "& .MuiChip-label": { px: 1.5 },
                  }}
                />
              )}
            </Box>

            {/* Card body */}
            <Box
              p={2}
              sx={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                gap: 0.5,
              }}
            >
              <Typography variant="subtitle1" fontWeight={600} noWrap>
                {listing.title}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {listing.categoryName} · {listing.location}
              </Typography>

              {/* Rating row */}
              <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
                <StarIcon sx={{ fontSize: 16, color: "#f59e0b" }} />
                <Typography variant="body2" fontWeight={500}>
                  {listing.rating?.toFixed(1) ?? "N/A"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  · {listing.isAvailable ? "Available" : "Unavailable"}
                </Typography>
              </Box>

              {/* Price + Book Now row */}
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mt="auto"
                pt={1.5}
              >
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    color="text.primary"
                    lineHeight={1}
                  >
                    ${listing.priceFrom}
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.secondary"
                      fontWeight={400}
                      ml={0.5}
                    >
                      /night
                    </Typography>
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  size="small"
                  disableElevation
                  sx={{
                    bgcolor: "#1d6fe0",
                    color: "#fff",
                    borderRadius: 1.5,
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    px: 2,
                    py: 0.75,
                    textTransform: "none",
                    "&:hover": { bgcolor: "#1558b8" },
                  }}
                >
                  Book Now
                </Button>
              </Box>
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}