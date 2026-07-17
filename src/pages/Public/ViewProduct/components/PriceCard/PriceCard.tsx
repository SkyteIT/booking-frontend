// Sticky booking card: price, date inputs, guest picker, and an Add to
// Cart action that actually calls the backend (POST /api/cart/items)
// instead of faking a "Booking Confirmed" state with no real effect.
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import {
  Box,
  Typography,
  Button,
  Divider,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../../context/useAuth";
import { addToCart } from "../../../../../services/cartService";
import type { Listing } from "../../../Search/utils/types";

interface PriceCardProps {
  listing: Listing;
}

const PriceCard = ({ listing }: PriceCardProps) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate(`/login?next=/view-product/${listing.id}`);
      return;
    }

    setStatus("loading");
    setErrorMessage("");
    try {
      await addToCart(listing.id, guests);
      setStatus("success");
    } catch (err) {
      console.error("Failed to add to cart:", err);
      setStatus("error");
      setErrorMessage("Couldn't add this to your cart. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "20px",
        p: 3,
        boxShadow: "0 4px 24px rgba(17,24,39,0.06)",
        position: { md: "sticky" },
        top: { md: "88px" },
        backgroundColor: "background.paper",
      }}
    >
      {/* Price */}
      <Box sx={{ mb: 2.5 }}>
        <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: "primary.main", letterSpacing: "-0.02em" }}
          >
            ${listing.price}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            /{listing.priceUnit}
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          Plus taxes and fees
        </Typography>
      </Box>

      <Divider sx={{ mb: 2.5 }} />

      {/* Date Pickers */}
      <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5, color: "text.primary" }}>
        Select dates
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5, mb: 2 }}>
        <TextField
          label="Check-in"
          type="date"
          size="small"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
        />
        <TextField
          label="Check-out"
          type="date"
          size="small"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
        />
      </Box>

      {/* Guests */}
      <FormControl fullWidth size="small" sx={{ mb: 2.5 }}>
        <InputLabel>Guests</InputLabel>
        <Select
          value={guests}
          label="Guests"
          onChange={(e) => setGuests(Number(e.target.value))}
          sx={{ borderRadius: "10px" }}
        >
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <MenuItem key={n} value={n}>
              {n} guest{n > 1 ? "s" : ""}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Real cancellation policy, if the vendor set one */}
      {listing.cancellationPolicy && (
        <>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 2.5 }}>
            <CheckCircleOutlineIcon sx={{ fontSize: "1rem", color: "primary.main", mt: 0.2 }} />
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {listing.cancellationPolicy}
            </Typography>
          </Box>
        </>
      )}

      {status === "success" && (
        <Alert severity="success" sx={{ mb: 2, borderRadius: "10px" }}>
          Added to your cart.
        </Alert>
      )}
      {status === "error" && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: "10px" }}>
          {errorMessage}
        </Alert>
      )}

      <Button
        fullWidth
        variant="contained"
        size="large"
        disabled={status === "loading" || !listing.isAvailable}
        onClick={handleAddToCart}
        sx={{
          borderRadius: "12px",
          py: 1.5,
          fontWeight: 600,
          fontSize: "1rem",
          textTransform: "none",
        }}
      >
        {!listing.isAvailable
          ? "Currently unavailable"
          : status === "loading"
            ? "Adding…"
            : "Add to cart"}
      </Button>

      <Typography
        variant="caption"
        sx={{ display: "block", textAlign: "center", color: "text.secondary", mt: 1 }}
      >
        You won't be charged yet
      </Typography>
    </Box>
  );
};

export default PriceCard;
