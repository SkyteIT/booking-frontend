// ViewProduct page — reads :id from the URL, fetches the matching
// listing from the backend, then composes the three sub-components.
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Box,
  Container,
  Button,
  IconButton,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getListingById } from "../../../services/Vendor/listingService";
import {
  getUnits,
  type ListingUnitDto,
} from "../../../services/Vendor/listingUnitsService";
import type { Listing } from "../Search/utils/types";
import BookingOptions from "./components/BookingOptions/BookingOptions";
import ImageGallery from "./components/ImageGallery/ImageGallery";
import ProductDetails from "./components/ProductDetails/ProductDetails";
import PriceCard from "./components/PriceCard/PriceCard";

const ViewProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Bookable units + selection state
  const [units, setUnits] = useState<ListingUnitDto[] | null>(null);
  const [unitsLoading, setUnitsLoading] = useState(true);
  const [selectedUnitId, setSelectedUnitId] = useState("");
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const toggleSeat = (id: string) =>
    setSelectedSeatIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

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
          4: "Activity",
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
          Activity: "session",
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
          currency: data.currency || "LKR",
          rating: data.rating,
          reviews: data.bookingsCount,
          image:
            data.primaryImage ||
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
          isAvailable: data.isActive,
          images: data.images || [],
          amenities: data.hotelDetails?.amenities || [],
          description: data.description || "",
          cancellationPolicy: data.cancellationPolicy || "",
          vendorName: data.vendorName || "",
          type: categoryLabel,
        };

        setListing(mapped);
        if (mapped.type === "Event" && mapped.eventDateTime) {
          const eventDate = mapped.eventDateTime.slice(0, 10);
          setCheckIn(eventDate);
          setCheckOut(eventDate);
        }
        setGuests(
          mapped.type === "Activity" &&
            mapped.minGroupSize &&
            mapped.minGroupSize > 1
            ? mapped.minGroupSize
            : 1,
        );
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
      <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress sx={{ color: "#0F5A8A" }} />
        <Typography sx={{ mt: 2, color: "text.secondary" }}>
          Loading details...
        </Typography>
      </Container>
    );
  }

  if (error || !listing) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
        {error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
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
          {/* Left column: gallery + details */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <Box sx={{ position: "relative" }}>
              <ImageGallery
                listing={listing}
                category={listing.category as string}
              />

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
              selectedSeatIds={selectedSeatIds}
              onToggleSeat={toggleSeat}
              checkIn={checkIn}
              checkOut={checkOut}
              onCheckInChange={setCheckIn}
              onCheckOutChange={setCheckOut}
              guests={guests}
              onGuestsChange={setGuests}
            />
          </Box>

          {/* Right column: price card */}
          <PriceCard
            listing={listing}
            units={units}
            selectedUnitId={selectedUnitId}
            selectedSeatIds={selectedSeatIds}
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
