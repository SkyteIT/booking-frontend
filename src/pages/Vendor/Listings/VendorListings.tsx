// src/pages/Vendor/Listings/VendorListings.tsx
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  Grid,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  Menu,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { getVendorListings, deleteListing } from "../../../services/Vendor/listingService";
import type { ListingResponse } from "../../../services/Vendor/listingService";
import { imageForCategory, hashSeed } from "../../../utils/categoryImages";
import ListingCard from "./components/ListingCard";

const VendorListings = () => {
  const [listings, setListings] = useState<ListingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuListing, setMenuListing] = useState<ListingResponse | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const notifyDashboardRefresh = () => {
    window.dispatchEvent(new Event("admin-dashboard-refresh"));
  };

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

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>, listing: ListingResponse) => {
    setMenuAnchor(e.currentTarget);
    setMenuListing(listing);
  };

  const handleMenuClose = () => setMenuAnchor(null);

  const handleDeleteOpen = () => {
    setDeleteOpen(true);
    setMenuAnchor(null);
  };

  const handleDeleteConfirm = async () => {
    if (!menuListing) return;
    setDeleting(true);
    try {
      await deleteListing(menuListing.id);
      setListings((prev) => prev.filter((l) => l.id !== menuListing.id));
      notifyDashboardRefresh();
      setDeleteOpen(false);
    } catch (err) {
      console.error("Error deleting listing:", err);
      setError("Failed to delete listing. Please try again later.");
      setDeleteOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  const filteredListings = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return listings.filter((listing) => {
      const haystack = [
        listing.title,
        listing.description,
        listing.categoryName,
        listing.vendorName,
        listing.location,
        listing.tags?.join(" "),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || haystack.includes(query);
      const active = typeof listing.isActive === "boolean"
        ? listing.isActive
        : String((listing as any).status ?? "").toLowerCase() === "active";
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "live" ? active : !active);

      return matchesSearch && matchesStatus;
    });
  }, [listings, searchQuery, statusFilter]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2, color: "text.secondary" }}>Loading your listings...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" disableGutters sx={{ py: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              letterSpacing: "-0.01em",
              display: "flex",
              alignItems: "baseline",
              gap: "2px",
            }}
          >
            Listings
            <Box component="span" sx={{ width: 8, height: 8, borderRadius: "3px", backgroundColor: "primary.main", display: "inline-block", ml: 0.5 }} />
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
            Manage your inventory and offerings
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          to="/vendor/listings/new"
          sx={{
            background: "linear-gradient(160deg, #005a8d, #0077b6)",
            borderRadius: "999px",
            px: 3,
            py: 1.1,
            textTransform: "none",
            fontSize: "0.9rem",
            fontWeight: 600,
            boxShadow: "0 8px 20px rgba(0,119,182,0.28)",
            "&:hover": {
              background: "linear-gradient(160deg, #004a75, #005a8d)",
              boxShadow: "0 10px 24px rgba(0,119,182,0.34)",
            },
          }}
        >
          Create new listing
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: "14px" }}>
          {error}
        </Alert>
      )}

      {/* Outer container - matches the Bookings tab's structure: one
          gradient-tinted card holding the filters and the grid, so the
          two tabs read as the same pattern rather than one-off layouts. */}
      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
          background: "linear-gradient(160deg, #FFFFFF 0%, #E3F1FC 100%)",
          p: { xs: 2, md: 2.5 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            mb: 3,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <TextField
            placeholder="Search listings..."
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              flexGrow: 1,
              minWidth: "220px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "999px",
                bgcolor: "#fff",
                "& fieldset": { borderColor: "rgba(15,27,45,0.1)" },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            size="small"
            sx={{
              minWidth: "140px",
              borderRadius: "999px",
              bgcolor: "#fff",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(15,27,45,0.1)" },
            }}
          >
            <MenuItem value="all">All status</MenuItem>
            <MenuItem value="live">Live</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </Box>

        {filteredListings.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 10,
              bgcolor: "#fff",
              borderRadius: "20px",
              border: "1px dashed rgba(15,27,45,0.12)",
            }}
          >
            <Typography variant="h6" sx={{ color: "text.secondary", fontWeight: 600 }}>
              No listings found
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
              Try adjusting your search or filters.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredListings.map((listing) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={listing.id}>
                <ListingCard
                  listing={listing}
                  fallbackImage={imageForCategory(listing.categoryName, hashSeed(listing.id))}
                  onMenuOpen={(e) => handleMenuOpen(e, listing)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Card>

      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
        <MenuItem onClick={handleDeleteOpen} sx={{ color: "error.main" }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        PaperProps={{ sx: { borderRadius: "20px" } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Delete listing</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{menuListing?.title}</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDeleteOpen(false)} sx={{ textTransform: "none", borderRadius: "999px" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={deleting}
            onClick={handleDeleteConfirm}
            sx={{ textTransform: "none", borderRadius: "999px", px: 2.5 }}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default VendorListings;
