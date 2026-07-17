// Sticky booking card: price, date inputs, guest picker,
// what's included checklist, and Book Now CTA.
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
} from "@mui/material";
import { useState } from "react";
import type { Listing } from "../../../Search/utils/types";

const INCLUDED = [
  "Free cancellation",
  "Breakfast included",
  "Free WiFi",
  "Airport transfers",
];

interface PriceCardProps {
  listing: Listing;
}

const PriceCard = ({ listing }: PriceCardProps) => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [booked, setBooked] = useState(false);

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "20px",
        p: 3,
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
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
            sx={{ fontWeight: 800, color: "text.primary", letterSpacing: "-1px" }}
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
      <Typography variant="body2" sx={{ fontWeight: 700, mb: 1.5, color: "text.primary" }}>
        Select Dates
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5, mb: 2 }}>
        <TextField
          label="Check-in"
          type="date"
          size="small"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
        />
        <TextField
          label="Check-out"
          type="date"
          size="small"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          InputLabelProps={{ shrink: true }}
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

      <Divider sx={{ mb: 2 }} />

      {/* What's included */}
      <Typography variant="body2" sx={{ fontWeight: 700, mb: 1.25, color: "text.primary" }}>
        What's included
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75, mb: 2.5 }}>
        {INCLUDED.map((item) => (
          <Box key={item} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CheckCircleOutlineIcon sx={{ fontSize: "1rem", color: "success.main" }} />
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {item}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Book Now */}
      <Button
        fullWidth
        variant="contained"
        size="large"
        onClick={() => setBooked(true)}
        sx={{
          borderRadius: "12px",
          py: 1.5,
          fontWeight: 700,
          fontSize: "1rem",
          backgroundColor: booked ? "success.main" : "primary.main",
          "&:hover": {
            backgroundColor: booked ? "success.dark" : "primary.dark",
          },
          transition: "background-color 0.3s ease",
        }}
      >
        {booked ? "✓ Booking Confirmed!" : "Book Now"}
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
