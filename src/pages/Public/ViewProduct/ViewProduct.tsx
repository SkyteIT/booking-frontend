// ViewProduct page — reads :id from the URL, fetches the matching
// listing from the backend, then composes the three sub-components.
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Container, Button, Typography, CircularProgress, Alert } from "@mui/material";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getListingById } from "../../../services/Vendor/listingService";
import { mapApiListing } from "../Search/utils/mapApiListing";
import type { Listing } from "../Search/utils/types";
import ImageGallery from "./components/ImageGallery/ImageGallery";
import PriceCard from "./components/PriceCard/PriceCard";
import ProductDetails from "./components/ProductDetails/ProductDetails";

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
        setListing(mapApiListing(data));
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
      <Container maxWidth="lg" sx={{ pt: 20, pb: 8, textAlign: "center" }}>
        <CircularProgress sx={{ color: "primary.main" }} />
        <Typography sx={{ mt: 2, color: "text.secondary" }}>Loading details...</Typography>
      </Container>
    );
  }

  if (error || !listing) {
    return (
      <Container maxWidth="md" sx={{ pt: 20, pb: 8, textAlign: "center" }}>
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
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.default",
        backgroundImage:
          "radial-gradient(ellipse 90% 45% at 50% -10%, rgba(0,119,182,0.1), transparent 70%)",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Container maxWidth="lg" sx={{ pt: 16, pb: 4 }}>

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