// src/pages/vendor/Listings/VendorListings.tsx
import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  IconButton,
  Chip,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import StarIcon from "@mui/icons-material/Star";
import { Link } from "react-router-dom";
import { getVendorListings } from "../../../services/Vendor/listingService";
import type { ListingResponse } from "../../../services/Vendor/listingService";

const VendorListings = () => {
  const [listings, setListings] = useState<ListingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const data = await getVendorListings();
        setListings(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching listings:", err);
        setError("Failed to load your listings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const filteredListings = listings.filter((listing) => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || listing.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress sx={{ color: "#0F5A8A" }} />
        <Typography sx={{ mt: 2, color: "#64748B" }}>Loading your listings...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 6,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: "#1E293B", mb: 1 }}
          >
            Listings
          </Typography>
          <Typography variant="body1" sx={{ color: "#64748B" }}>
            Manage your inventory and offerings
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          to="/vendor/listings/new"
          sx={{
            backgroundColor: "#0F5A8A",
            borderRadius: "10px",
            px: 3,
            py: 1,
            textTransform: "none",
            fontSize: "0.95rem",
            fontWeight: 600,
            "&:hover": { backgroundColor: "#0D4D76" },
          }}
        >
          Create new Listing
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4, borderRadius: "12px" }}>
          {error}
        </Alert>
      )}

      {/* Filter Bar */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 6,
          flexWrap: "wrap",
          p: 2,
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          border: "1px solid #E2E8F0",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.02)",
        }}
      >
        <TextField
          placeholder="Search listings..."
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flexGrow: 1, minWidth: "200px" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#94A3B8" }} />
              </InputAdornment>
            ),
            sx: { borderRadius: "10px" },
          }}
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          size="small"
          sx={{ minWidth: "140px", borderRadius: "10px" }}
        >
          <MenuItem value="all">All Status</MenuItem>
          <MenuItem value="live">Live</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </Select>
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            borderColor: "#E2E8F0",
            color: "#64748B",
            px: 2,
            "&:hover": { borderColor: "#CBD5E1", backgroundColor: "#F8FAFC" },
          }}
        >
          More Filters
        </Button>
      </Box>

      {/* Listings Grid */}
      {filteredListings.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 10, bgcolor: "#ffffff", borderRadius: "20px", border: "1px dashed #E2E8F0" }}>
          <Typography variant="h6" color="text.secondary">No listings found</Typography>
          <Typography color="text.secondary">Try adjusting your search or filters.</Typography>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {filteredListings.map((listing) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={listing.id}>
              <Card
                sx={{
                  borderRadius: "20px",
                  overflow: "hidden",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0px 4px 20px rgba(0,0,0,0.04)",
                  transition: "transform 0.2s ease, boxShadow 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0px 12px 30px rgba(0,0,0,0.08)",
                  },
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={listing.primaryImage || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"}
                    alt={listing.title}
                  />
                  <Chip
                    label={listing.status}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      backgroundColor: listing.status === "Live" ? "#DCFCE7" : "#F1F5F9",
                      color: listing.status === "Live" ? "#166534" : "#475569",
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      border: "none",
                    }}
                  />
                </Box>
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, mb: 0.5, color: "#1E293B", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                  >
                    {listing.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748B", mb: 2 }}>
                    {listing.categoryName}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 3,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 800, color: "#0F5A8A" }}
                    >
                      {listing.currency} {listing.basePrice}
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography variant="caption" sx={{ color: "#64748B" }}>
                        {listing.bookingsCount} bookings
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <StarIcon sx={{ fontSize: "1rem", color: "#FBBF24" }} />
                        <Typography variant="caption" sx={{ fontWeight: 600, color: "#1E293B" }}>
                          {listing.rating > 0 ? listing.rating.toFixed(1) : "New"}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>

                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<EditIcon sx={{ fontSize: "1.1rem" }} />}
                      component={Link}
                      to={`/vendor/listings/edit/${listing.id}`}
                      sx={{
                        backgroundColor: "#0F5A8A",
                        borderRadius: "10px",
                        textTransform: "none",
                        fontWeight: 600,
                        "&:hover": { backgroundColor: "#0D4D76" },
                      }}
                    >
                      Edit
                    </Button>
                    <IconButton
                      sx={{
                        border: "1px solid #E2E8F0",
                        borderRadius: "10px",
                        color: "#64748B",
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default VendorListings;
