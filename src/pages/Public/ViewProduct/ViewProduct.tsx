// ViewProduct page — reads :id from the URL, finds the matching
// listing from mock data, then composes the three sub-components.
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Container, Button, Typography } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { MOCK_LISTINGS } from "../Search/data/mockListings";
import ImageGallery from "./components/ImageGallery/ImageGallery";
import PriceCard from "./components/PriceCard/PriceCard";
import ProductDetails from "./components/ProductDetails/ProductDetails";

const ViewProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const listing = MOCK_LISTINGS.find((l: typeof MOCK_LISTINGS[0]) => l.id === Number(id));

  if (!listing) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          Listing not found
        </Typography>
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