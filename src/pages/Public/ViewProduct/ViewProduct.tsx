// ViewProduct page — reads :id from the URL, fetches the matching
// listing from the backend, then composes the three sub-components.
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Container, Button, IconButton, Typography, Alert } from "@mui/material";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getListingById } from "../../../services/Vendor/listingService";
import { getUnits, type ListingUnitDto } from "../../../services/Vendor/listingUnitsService";
import { mapApiListing } from "../Search/utils/mapApiListing";
import type { Listing } from "../Search/utils/types";
import BookingOptions from "./components/BookingOptions/BookingOptions";
import ImageGallery from "./components/ImageGallery/ImageGallery";
import PriceCard from "./components/PriceCard/PriceCard";
import ProductDetails from "./components/ProductDetails/ProductDetails";

const ViewProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Bookable units + selection state - lifted here so both the main-
  // section picker (BookingOptions) and the sidebar summary (PriceCard)
  // read/write the same state, and so we only fetch units once per page
  // load instead of each child fetching its own copy.
  const [units, setUnits] = useState<ListingUnitDto[] | null>(null);
  const [unitsLoading, setUnitsLoading] = useState(true);
  const [selectedUnitId, setSelectedUnitId] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getListingById(id);
        const mapped = mapApiListing(data);
        setListing(mapped);
        setGuests(mapped.type === "Activity" && mapped.minGroupSize && mapped.minGroupSize > 1 ? mapped.minGroupSize : 1);
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

  useEffect(() => {
    if (!id) return;
    setUnitsLoading(true);
    getUnits(id)
      .then((data) => {
        const active = data.filter((u) => u.isActive);
        setUnits(active);
        if (active.length > 0) setSelectedUnitId(active[0].id);
      })
      .catch(() => setUnits([])) // treat as "no units defined" rather than blocking the page
      .finally(() => setUnitsLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ pt: 20, pb: 8 }}>
        <LoadingSpinner fullScreen={false} message="Loading details..." />
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
          "radial-gradient(ellipse 90% 65% at 50% -10%, rgba(0,119,182,0.16), transparent 70%)",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Container maxWidth="lg" sx={{ pt: 16, pb: 4 }}>

        {/* Two-column layout */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 360px" },
            gap: { xs: 4, md: 5 },
            alignItems: "start",
          }}
        >
          {/* Left column: gallery + details + booking options */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <Box sx={{ position: "relative" }}>
              <ImageGallery listing={listing} category={listing.category as string} />

              {/* Back button - compact circular icon button floating over
                  the hero photo's gradient, translucent-blur treatment. */}
              <IconButton
                aria-label="Back to results"
                onClick={() => navigate(-1)}
                sx={{
                  position: "absolute",
                  top: 20,
                  left: 20,
                  width: 44,
                  height: 44,
                  color: "#fff",
                  backgroundColor: "rgba(15,27,45,0.4)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  "&:hover": { backgroundColor: "rgba(15,27,45,0.6)" },
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Box>
            <ProductDetails listing={listing} />
            <BookingOptions
              listing={listing}
              units={units}
              unitsLoading={unitsLoading}
              selectedUnitId={selectedUnitId}
              onSelectUnit={setSelectedUnitId}
              checkIn={checkIn}
              checkOut={checkOut}
              onCheckInChange={setCheckIn}
              onCheckOutChange={setCheckOut}
              guests={guests}
              onGuestsChange={setGuests}
            />
          </Box>

          {/* Right column: price summary card */}
          <PriceCard
            listing={listing}
            units={units}
            selectedUnitId={selectedUnitId}
            checkIn={checkIn}
            checkOut={checkOut}
            guests={guests}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default ViewProduct;
