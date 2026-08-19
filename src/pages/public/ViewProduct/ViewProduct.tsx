import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Container, Button, Typography, CircularProgress, Alert } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getListingById } from "../../../services/Vendor/listingService";
import type { Listing } from "../search/utils/types";
import ImageGallery from "./components/ImageGallery/ImageGallery";
import ProductDetails from "./components/ProductDetails/ProductDetails";
import PriceCard from "./components/PriceCard/PriceCard";

const ViewProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getListingById(id);
        
        const typeLabels: Record<number, string> = {
          0: "Hotel",
          1: "Restaurant",
          2: "Event",
          3: "CarRental",
          4: "Activity"
        };

        let categoryLabel = "Other";
        if (typeof data.type === "number") {
          categoryLabel = typeLabels[data.type] || "Other";
        } else if (typeof data.type === "string") {
          categoryLabel = data.type;
        }

        const unitMap: Record<string, string> = {
          Hotel: "night",
          Restaurant: "person",
          Event: "ticket",
          CarRental: "day",
          Activity: "session"
        };

        const priceUnit = unitMap[categoryLabel] || "unit";

        // Map API response to frontend Listing type
        const mapped: Listing = {
          id: data.id,
          title: data.title,
          category: categoryLabel,
          location: data.location || "Online",
          price: data.basePrice,
          priceUnit: priceUnit,
          rating: data.rating,
          reviews: data.bookingsCount,
          image: data.primaryImage || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
          isAvailable: data.isActive
        };
        
        setListing(mapped);
        setError(null);
      } catch (err) {
        console.error("Error fetching listing:", err);
        setError("Failed to load listing details.");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress sx={{ color: "#0F5A8A" }} />
        <Typography sx={{ mt: 2, color: "text.secondary" }}>Loading details...</Typography>
      </Container>
    );
  }

  if (error || !listing) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
        {error ? (
          <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
        ) : (
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Listing not found
          </Typography>
        )}
        <Button
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          onClick={() => navigate(-1)}
          sx={{ borderRadius: "10px" }}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>

        {/* Back button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{
            mb: 3,
            borderRadius: "10px",
            color: "text.secondary",
            border: "1px solid",
            borderColor: "divider",
            px: 2,
            "&:hover": { backgroundColor: "action.hover" },
          }}
        >
          Back to results
        </Button>

        {/* Two-column layout */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 360px" },
            gap: { xs: 4, md: 5 },
            alignItems: "start",
          }}
        >
          {/* Left column: gallery + details */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <ImageGallery listing={listing} />
            <ProductDetails listing={listing} />
          </Box>

          {/* Right column: price card */}
          <PriceCard listing={listing} />
        </Box>
      </Container>
    </Box>
  );
};

export default ViewProduct;