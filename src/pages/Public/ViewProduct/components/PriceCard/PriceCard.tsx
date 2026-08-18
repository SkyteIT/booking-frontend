// Sticky summary card: price, a one-line recap of what's selected in
// BookingOptions (the main-section picker), and an Add to Cart action.
// Adds to CartContext (the localStorage cart the whole Cart -> Checkout
// -> Payment flow actually reads from). All interactive selection
// (dates, seats/units, quantity) lives in BookingOptions now - this
// card only reads that state via props and submits it.
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { Box, Typography, Button, Divider, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../../../components/cart/app/contexts/CartContext";
import { useAuth } from "../../../../../context/useAuth";
import { getListingOffers, type ListingOfferDto } from "../../../../../services/Vendor/listingOfferService";
import type { ListingUnitDto } from "../../../../../services/Vendor/listingUnitsService";
import { getPriceQuote } from "../../../../../services/Vendor/seasonalPricingService";
import { calculatePricingTotal } from "../../../../../utils/pricingCalculator";
import type { Listing } from "../../../Search/utils/types";
import { getQuantityConfig } from "../../utils/quantityConfig";

interface PriceCardProps {
  listing: Listing;
  units: ListingUnitDto[] | null;
  selectedUnitId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

const PriceCard = ({ listing, units, selectedUnitId, checkIn, checkOut, guests }: PriceCardProps) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const seatUnits = units?.filter((u) => u.kind === "Seat") ?? [];
  const timeSlotUnits = units?.filter((u) => u.kind === "TimeSlot") ?? [];
  const selectedUnit = units?.find((u) => u.id === selectedUnitId);
  const displayPrice = selectedUnit?.priceOverride ?? listing.price;
  const quantityConfig = getQuantityConfig(listing);
  const effectiveQuantity = seatUnits.length > 0 || timeSlotUnits.length > 0 || !quantityConfig ? 1 : guests;

  const estimatedTotal =
    checkIn && checkOut
      ? calculatePricingTotal(displayPrice, effectiveQuantity, checkIn, checkOut || checkIn, listing.pricingUnit)
      : null;

  // Seasonal pricing rules live server-side only - the client-side
  // estimate above can't know about them. Debounced quote call gives an
  // accurate preview once dates settle, falling back to the client-side
  // estimate while in flight or if it fails, so the UI is never blocked
  // on the network. Keyed by the inputs it was fetched for, so a quote
  // from stale inputs is never shown against the current selection -
  // avoids a synchronous reset in the effect body.
  const quoteKey =
    checkIn && checkOut ? `${listing.id}|${checkIn}|${checkOut}|${selectedUnitId}|${effectiveQuantity}` : null;
  const [quote, setQuote] = useState<{ key: string; total: number } | null>(null);

  useEffect(() => {
    if (!quoteKey || !checkIn || !checkOut) return;

    const timer = setTimeout(() => {
      getPriceQuote(listing.id, {
        startDate: checkIn,
        endDate: checkOut || checkIn,
        unitId: selectedUnitId || undefined,
        quantity: effectiveQuantity,
      })
        .then((result) => setQuote({ key: quoteKey, total: result.totalAmount }))
        .catch(() => {});
    }, 400);

    return () => clearTimeout(timer);
  }, [quoteKey, listing.id, checkIn, checkOut, selectedUnitId, effectiveQuantity]);

  const serverQuote = quote && quote.key === quoteKey ? quote.total : null;
  const displayedTotal = serverQuote ?? estimatedTotal;

  // Full offer text (title/description) isn't on the listing payload
  // itself - fetched separately, same established pattern as units
  // (getUnits). The price above already reflects any discount via the
  // quote call; this block is purely explanatory.
  const [activeOffer, setActiveOffer] = useState<ListingOfferDto | null>(null);

  useEffect(() => {
    let cancelled = false;
    getListingOffers(listing.id)
      .then((offers) => {
        if (cancelled) return;
        const today = new Date().toISOString().slice(0, 10);
        const current = offers.find((o) => o.isActive && o.startDate <= today && o.endDate >= today);
        setActiveOffer(current ?? null);
      })
      .catch(() => setActiveOffer(null));
    return () => {
      cancelled = true;
    };
  }, [listing.id]);

  // One-line recap of what's selected in BookingOptions, so this card
  // reads as a summary instead of just a bare price.
  const selectionSummary = (() => {
    const parts: string[] = [];
    if (selectedUnit && (seatUnits.length > 0 || timeSlotUnits.length > 0 || units?.some((u) => u.kind === "Generic"))) {
      parts.push(selectedUnit.name);
    }
    if (quantityConfig && seatUnits.length === 0 && timeSlotUnits.length === 0) {
      parts.push(`${guests} ${quantityConfig.singular}${guests > 1 ? "s" : ""}`);
    }
    if (checkIn) parts.push(checkOut && checkOut !== checkIn ? `${checkIn} – ${checkOut}` : checkIn);
    return parts.join(" · ");
  })();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate(`/login?next=/view-product/${listing.id}`);
      return;
    }

    if (!checkIn || !checkOut) {
      setStatus("error");
      setErrorMessage("Please select both dates.");
      return;
    }

    if (units && units.length > 0 && !selectedUnitId) {
      setStatus("error");
      setErrorMessage("Please make a selection before adding to cart.");
      return;
    }

    setErrorMessage("");
    try {
      addToCart(
        {
          id: listing.id,
          name: listing.title,
          category: listing.category as string,
          // The selected unit's own price wins when set (e.g. "Deluxe
          // Room" costing more than the listing's base price) - falling
          // back to listing.price always was a real bug: picking a
          // priced unit silently added the wrong amount to the cart.
          price: selectedUnit?.priceOverride ?? listing.price,
          priceUnit: listing.priceUnit ?? "per day",
          pricingUnit: listing.pricingUnit,
          description: listing.description ?? "",
          image: listing.image,
          location: listing.location,
          listingUnitId: selectedUnitId || undefined,
        },
        effectiveQuantity,
        checkIn,
        checkOut
      );
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
            ${displayPrice}
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

      {/* Summary of what's been picked below in the main section */}
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: "text.primary" }}>
          Your selection
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {selectionSummary || "Choose your options below"}
        </Typography>
        {displayedTotal !== null && (
          <Typography variant="body2" sx={{ fontWeight: 600, mt: 1 }}>
            Estimated total: ${displayedTotal.toFixed(2)}
          </Typography>
        )}
      </Box>

      {/* Active vendor offer, if one is running right now */}
      {activeOffer && (
        <>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 2.5 }}>
            <LocalOfferIcon sx={{ fontSize: "1rem", color: "#E85D3D", mt: 0.2 }} />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {activeOffer.title}
                {activeOffer.discountType === "PercentageDiscount" && ` — ${activeOffer.discountValue}% off`}
                {activeOffer.discountType === "FixedAmountDiscount" && ` — ${activeOffer.discountValue} off`}
              </Typography>
              {activeOffer.description && (
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {activeOffer.description}
                </Typography>
              )}
            </Box>
          </Box>
        </>
      )}

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
        disabled={!listing.isAvailable}
        onClick={handleAddToCart}
        sx={{
          borderRadius: "12px",
          py: 1.5,
          fontWeight: 600,
          fontSize: "1rem",
          textTransform: "none",
        }}
      >
        {!listing.isAvailable ? "Currently unavailable" : "Add to cart"}
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
