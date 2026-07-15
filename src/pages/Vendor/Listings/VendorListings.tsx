// src/pages/Vendor/Listings/VendorListings.tsx
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import FilterListIcon from "@mui/icons-material/FilterList";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import StarIcon from "@mui/icons-material/Star";
import {
  Box,
  Container,
  Typography,
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
} from "@mui/material";
import { Link } from "react-router-dom";

const mockListings = [
  {
    id: 1,
    title: "Tesla Model 3",
    category: "Vehicles",
    price: "$99/day",
    bookings: 12,
    rating: 4.9,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Canon EOS R5",
    category: "Electronics",
    price: "$75/day",
    bookings: 8,
    rating: 5.0,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Beach House Villa",
    category: "Real Estate",
    price: "$400/night",
    bookings: 24,
    rating: 4.8,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    title: "DJ Equipment Set",
    category: "Equipment",
    price: "$150/day",
    bookings: 0,
    rating: 0,
    status: "Draft",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80",
  },
];

const VendorListings = () => {
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
            "&:hover": { backgroundColor: "#0F5A8A" },
          }}
        >
          Create new Listing
        </Button>
      </Box>

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
          defaultValue="Category"
          size="small"
          sx={{ minWidth: "140px", borderRadius: "10px" }}
        >
          <MenuItem value="Category">Category</MenuItem>
          <MenuItem value="Vehicles">Vehicles</MenuItem>
          <MenuItem value="Electronics">Electronics</MenuItem>
          <MenuItem value="Real Estate">Real Estate</MenuItem>
          <MenuItem value="Equipment">Equipment</MenuItem>
        </Select>
        <Select
          defaultValue="Status"
          size="small"
          sx={{ minWidth: "120px", borderRadius: "10px" }}
        >
          <MenuItem value="Status">Status</MenuItem>
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Draft">Draft</MenuItem>
          <MenuItem value="Inactive">Inactive</MenuItem>
        </Select>
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            borderColor: "#E2E8F0",
            color: "#64748B",
          }}
        >
          More Filters
        </Button>
      </Box>

      {/* Listings Grid */}
      <Grid container spacing={4}>
        {mockListings.map((listing) => (
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
                  image={listing.image}
                  alt={listing.title}
                />
                <Chip
                  label={listing.status}
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    backgroundColor:
                      listing.status === "Active" ? "#DCFCE7" : "#F1F5F9",
                    color: listing.status === "Active" ? "#166534" : "#475569",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    border: "none",
                  }}
                />
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, mb: 0.5, color: "#1E293B" }}
                >
                  {listing.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748B", mb: 2 }}>
                  {listing.category}
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
                    {listing.price}
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="caption" sx={{ color: "#64748B" }}>
                      {listing.bookings} bookings
                    </Typography>
                    {listing.rating > 0 && (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <StarIcon sx={{ fontSize: "1rem", color: "#FBBF24" }} />
                        <Typography
                          variant="caption"
                          sx={{ fontWeight: 600, color: "#1E293B" }}
                        >
                          {listing.rating}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Box>

                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<EditIcon sx={{ fontSize: "1.1rem" }} />}
                    sx={{
                      backgroundColor: "#0F5A8A",
                      borderRadius: "10px",
                      textTransform: "none",
                      fontWeight: 600,
                      "&:hover": { backgroundColor: "#0F5A8A" },
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
    </Container>
  );
};

export default VendorListings;
