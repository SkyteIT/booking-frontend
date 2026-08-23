
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { Box, Typography, Button, Divider } from "@mui/material";
import { useEffect, useState } from "react";
import ToastAlert from "../../../../../components/common/ToastAlert";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../../../components/cart/app/contexts/CartContext";
import { useAuth } from "../../../../../context/useAuth";
import {
  getListingOffers,
  type ListingOfferDto,
} from "../../../../../services/Vendor/listingOfferService";
import type { ListingUnitDto } from "../../../../../services/Vendor/listingUnitsService";
import { getPriceQuote } from "../../../../../services/Vendor/seasonalPricingService";
import { businessDateToday } from "../../../../../utils/businessDate";
import { calculatePricingTotal } from "../../../../../utils/pricingCalculator";
import type { Listing } from "../../../Search/utils/types";
import { getQuantityConfig } from "../../utils/quantityConfig";

interface PriceCardProps {
  listing: Listing;
  units: ListingUnitDto[] | null;
  selectedUnitId: string;
  selectedSeatIds: string[];
  checkIn: string;
  checkOut: string;
  guests: number;
  selectedOptionValueIds: Record<string, string>;
}

const PriceCard = ({
  listing,
  units,
  selectedUnitId,
  selectedSeatIds,
  checkIn,
  checkOut,
  guests,
  selectedOptionValueIds,
}: PriceCardProps) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const seatUnits = units?.filter((u) => u.kind === "Seat") ?? [];
  const timeSlotUnits = units?.filter((u) => u.kind === "TimeSlot") ?? [];
  const selectedUnit = units?.find((u) => u.id === selectedUnitId);
  const selectedSeats = seatUnits.filter((u) => selectedSeatIds.includes(u.id));

  
  const allOptionValues = listing.optionGroups?.flatMap((g) => g.values) ?? [];
  const selectedOptionValues = Object.values(selectedOptionValueIds)
    .map((valueId) => allOptionValues.find((v) => v.id === valueId))
    .filter((v): v is NonNullable<typeof v> => Boolean(v));
  const optionModifierSum = selectedOptionValues.reduce(
    (sum, v) => sum + v.priceModifier,
    0,
  );
  // A selected value's own PriceOverride replaces the base rate entirely
  // (e.g. "Family package" @ 1500/person instead of the base 2000/person)
  // rather than adjusting it - mirrors CheckoutService's resolution order.
  const optionPriceOverride = [...selectedOptionValues]
    .reverse()
    .find((v) => v.priceOverride != null)?.priceOverride;

  const hasOptionGroups = (listing.optionGroups?.length ?? 0) > 0;
  const showSeatGrid =
    seatUnits.length > 0 &&
    (!hasOptionGroups || selectedOptionValues.some((v) => v.requiresSeatSelection));

  const displayPrice =
    (showSeatGrid
      ? (optionPriceOverride ?? selectedSeats[0]?.priceOverride ?? listing.price)
      : (optionPriceOverride ?? selectedUnit?.priceOverride ?? listing.price)) +
    optionModifierSum;
  const quantityConfig = getQuantityConfig(listing);
  const effectiveQuantity =
    showSeatGrid
      ? selectedSeats.length
      : timeSlotUnits.length > 0 || !quantityConfig
        ? 1
        : guests;

  // Seats can each carry their own priceOverride (e.g. front-row vs back-row
  // pricing), so the seat-map total is a per-seat sum, not one price × count.
  const estimatedTotal =
    checkIn && checkOut
      ? showSeatGrid
        ? selectedSeats.length > 0
          ? selectedSeats.reduce(
              (sum, seat) =>
                sum +
                calculatePricingTotal(
                  (optionPriceOverride ?? seat.priceOverride ?? listing.price) +
                    optionModifierSum,
                  1,
                  checkIn,
                  checkOut || checkIn,
                  listing.pricingUnit,
                ),
              0,
            )
          : null
        : calculatePricingTotal(
            displayPrice,
            effectiveQuantity,
            checkIn,
            checkOut || checkIn,
            listing.pricingUnit,
          )
      : null;

  // The server price-quote endpoint only knows about unitId/quantity - it
  // has no concept of a selected option value's PriceOverride, so it would
  // silently ignore an active override and quote the wrong total. Skip it
  // and use the local estimate (which does account for it) whenever one
  // is in play, same as the seat-grid case below.
  const quoteKey =
    checkIn && checkOut && !showSeatGrid && optionPriceOverride == null
      ? `${listing.id}|${checkIn}|${checkOut}|${selectedUnitId}|${effectiveQuantity}`
      : null;
  const [quote, setQuote] = useState<{ key: string; total: number } | null>(
    null,
  );

  useEffect(() => {
    if (!quoteKey || !checkIn || !checkOut) return;

    const timer = setTimeout(() => {
      getPriceQuote(listing.id, {
        startDate: checkIn,
        endDate: checkOut || checkIn,
        unitId: selectedUnitId || undefined,
        quantity: effectiveQuantity,
      })
        .then((result) =>
          setQuote({ key: quoteKey, total: result.totalAmount }),
        )
        .catch(() => {});
    }, 400);

    return () => clearTimeout(timer);
  }, [
    quoteKey,
    listing.id,
    checkIn,
    checkOut,
    selectedUnitId,
    effectiveQuantity,
  ]);

  const serverQuote = quote && quote.key === quoteKey ? quote.total : null;
  const displayedTotal = serverQuote ?? estimatedTotal;

  const [activeOffer, setActiveOffer] = useState<ListingOfferDto | null>(null);

  useEffect(() => {
    let cancelled = false;
    getListingOffers(listing.id)
      .then((offers) => {
        if (cancelled) return;
        const today = businessDateToday();
        const current = offers.find(
          (o) => o.isActive && o.startDate <= today && o.endDate >= today,
        );
        setActiveOffer(current ?? null);
      })
      .catch(() => setActiveOffer(null));
    return () => {
      cancelled = true;
    };
  }, [listing.id]);

 
  const selectionSummary = (() => {
    const parts: string[] = [];
    if (showSeatGrid && selectedSeats.length > 0) {
      parts.push(selectedSeats.map((s) => s.code ?? s.name).join(", "));
    } else if (
      selectedUnit &&
      (timeSlotUnits.length > 0 || units?.some((u) => u.kind === "Generic"))
    ) {
      parts.push(selectedUnit.name);
    }
    if (
      quantityConfig &&
      !showSeatGrid &&
      timeSlotUnits.length === 0
    ) {
      parts.push(
        `${guests} ${quantityConfig.singular}${guests > 1 ? "s" : ""}`,
      );
    }
    selectedOptionValues.forEach((v) => parts.push(v.name));
    if (checkIn)
      parts.push(
        checkOut && checkOut !== checkIn ? `${checkIn} – ${checkOut}` : checkIn,
      );
    return parts.join(" · ");
  })();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate(`/login?next=/view-product/${listing.id}`);
      return;
    }

    if (!checkIn || !checkOut) {
      setStatus("error");
      setErrorMessage(
        listing.type === "Hotel"
          ? "Please select check-in and check-out dates."
          : listing.type === "CarRental"
            ? "Please select pickup and return dates."
            : "Please select a booking date.",
      );
      return;
    }

    if (showSeatGrid && selectedSeats.length === 0) {
      setStatus("error");
      setErrorMessage("Please choose at least one seat before adding to cart.");
      return;
    }

    if (
      !showSeatGrid &&
      seatUnits.length === 0 &&
      units &&
      units.length > 0 &&
      !selectedUnitId
    ) {
      setStatus("error");
      setErrorMessage("Please make a selection before adding to cart.");
      return;
    }

    setErrorMessage("");
    try {
      const optionValueIds = selectedOptionValues.map((v) => v.id);
      const baseItem = {
        id: listing.id,
        name: listing.title,
        category: listing.category as string,
        currency: listing.currency,
        priceUnit: listing.priceUnit ?? "per day",
        pricingUnit: listing.pricingUnit,
        description: listing.description ?? "",
        image: listing.image,
        location: listing.location,
        optionValueIds: optionValueIds.length > 0 ? optionValueIds : undefined,
      };

      if (showSeatGrid) {
      
        selectedSeats.forEach((seat) => {
          addToCart(
            {
              ...baseItem,
              name: `${listing.title} — ${seat.code ?? seat.name}`,
              price:
                (optionPriceOverride ?? seat.priceOverride ?? listing.price) +
                optionModifierSum,
              listingUnitId: seat.id,
            },
            1,
            checkIn,
            checkOut,
          );
        });
      } else {
        addToCart(
          {
            ...baseItem,
            price:
              (optionPriceOverride ?? selectedUnit?.priceOverride ?? listing.price) +
              optionModifierSum,
            listingUnitId: selectedUnitId || undefined,
          },
          effectiveQuantity,
          checkIn,
          checkOut,
        );
      }
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
        borderRadius: "24px",
        overflow: "hidden",
        boxShadow: "0 20px 48px rgba(15,27,45,0.12)",
        position: { md: "sticky" },
        top: { md: "88px" },
        backgroundColor: "background.paper",
      }}
    >
      {/* Gradient header - price lives here, matching the landing page's
          card-accent treatment rather than a flat white block. */}
      <Box
        sx={{
          background: "linear-gradient(160deg, #005a8d, #0077b6)",
          px: 3,
          py: 2.75,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}
          >
            {listing.currency} {displayPrice}
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.85)" }}>
            /{listing.priceUnit}
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.75)" }}>
          Plus taxes and fees
        </Typography>
      </Box>

      <Box sx={{ p: 3 }}>
        {/* Summary of what's been picked below in the main section */}
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            alignItems: "flex-start",
            mb: 2.5,
            p: 1.75,
            borderRadius: "14px",
            backgroundColor: "rgba(0,119,182,0.06)",
          }}
        >
          <CalendarMonthOutlinedIcon
            sx={{ fontSize: "1.2rem", color: "primary.main", mt: 0.2 }}
          />
          <Box>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, mb: 0.25, color: "text.primary" }}
            >
              Your selection
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {selectionSummary || "Choose your options below"}
            </Typography>
            {displayedTotal !== null && (
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, mt: 0.75, color: "primary.main" }}
              >
                Estimated total: {listing.currency} {displayedTotal.toFixed(2)}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Active vendor offer, if one is running right now */}
        {activeOffer && (
          <>
            <Divider sx={{ mb: 2 }} />
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1,
                mb: 2.5,
              }}
            >
              <LocalOfferIcon
                sx={{ fontSize: "1rem", color: "#E85D3D", mt: 0.2 }}
              />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {activeOffer.title}
                  {activeOffer.discountType === "PercentageDiscount" &&
                    ` — ${activeOffer.discountValue}% off`}
                  {activeOffer.discountType === "FixedAmountDiscount" &&
                    ` — ${activeOffer.discountValue} off`}
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
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1,
                mb: 2.5,
              }}
            >
              <CheckCircleOutlineIcon
                sx={{ fontSize: "1rem", color: "primary.main", mt: 0.2 }}
              />
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {listing.cancellationPolicy}
              </Typography>
            </Box>
          </>
        )}

        <ToastAlert
          open={status === "success"}
          onClose={() => setStatus("idle")}
          severity="success"
          message="Added to your cart"
        />
        <ToastAlert
          open={status === "error"}
          onClose={() => setStatus("idle")}
          severity="error"
          message={errorMessage}
        />

        <Button
          fullWidth
          size="large"
          disabled={!listing.isAvailable}
          onClick={handleAddToCart}
          sx={{
            borderRadius: "999px",
            py: 1.5,
            fontWeight: 700,
            fontSize: "1rem",
            textTransform: "none",
            color: "#fff",
            background: listing.isAvailable
              ? "linear-gradient(160deg, #005a8d, #0077b6)"
              : undefined,
            "&:hover": {
              background: listing.isAvailable
                ? "linear-gradient(160deg, #004a75, #005a8d)"
                : undefined,
              boxShadow: listing.isAvailable
                ? "0 12px 28px rgba(0,119,182,0.32)"
                : "none",
            },
            "&.Mui-disabled": { color: "rgba(15,27,45,0.4)" },
          }}
        >
          {!listing.isAvailable ? "Currently unavailable" : "Add to cart"}
        </Button>

        <Typography
          variant="caption"
          sx={{
            display: "block",
            textAlign: "center",
            color: "text.secondary",
            mt: 1.25,
          }}
        >
          You won't be charged yet
        </Typography>
      </Box>
    </Box>
  );
};

export default PriceCard;
