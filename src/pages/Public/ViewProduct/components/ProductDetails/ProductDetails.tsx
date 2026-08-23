// Shows title, location, rating, category badge, real description and
// real amenities — all driven directly by the Listing prop. No fabricated
// copy, amenities, or reviews: if the backend didn't return it, we don't
// show it.
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import { Box, Typography, Chip, Rating, Divider } from "@mui/material";
import type { Listing } from "../../../Search/utils/types";
import LocationMap from "../LocationMap/LocationMap";
import ListingQuestions from "./ListingQuestions";
import ListingReviews from "./ListingReviews";

// Small key-value grid, same visual pattern as the amenities grid below,
// reused for Vehicle Details.
function SpecGrid({ specs }: { specs: { label: string; value: string }[] }) {
  return (
    <Box
      sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5, mb: 1 }}
    >
      {specs.map((s) => (
        <Box
          key={s.label}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "10px",
            px: 2,
            py: 1.25,
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", display: "block" }}
          >
            {s.label}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {s.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

interface ProductDetailsProps {
  listing: Listing;
}

const ProductDetails = ({ listing }: ProductDetailsProps) => {
  const categorySpecs: { label: string; value: string }[] = (() => {
    if (listing.type === "Hotel")
      return [
        ...(listing.propertyType
          ? [{ label: "Property type", value: listing.propertyType }]
          : []),
        ...(listing.availableRooms
          ? [
              {
                label: "Available rooms",
                value: String(listing.availableRooms),
              },
            ]
          : []),
        ...(listing.roomTypes?.length
          ? [{ label: "Room types", value: listing.roomTypes.join(", ") }]
          : []),
        ...(listing.primaryRoomType
          ? [{ label: "Room type", value: listing.primaryRoomType }]
          : []),
        ...(listing.checkInTime
          ? [{ label: "Check-in time", value: listing.checkInTime }]
          : []),
        ...(listing.checkOutTime
          ? [{ label: "Check-out time", value: listing.checkOutTime }]
          : []),
      ];
    if (listing.type === "Restaurant")
      return [
        ...(listing.cuisineType
          ? [{ label: "Cuisine", value: listing.cuisineType }]
          : []),
        ...(listing.averageCost
          ? [
              {
                label: "Average cost",
                value: `${listing.currency} ${listing.averageCost}`,
              },
            ]
          : []),
        ...(listing.tableCapacity
          ? [
              {
                label: "Seating capacity",
                value: String(listing.tableCapacity),
              },
            ]
          : []),
        ...(listing.openingHours
          ? [{ label: "Opening hours", value: listing.openingHours }]
          : []),
        ...(listing.tableTypes?.length
          ? [{ label: "Table types", value: listing.tableTypes.join(", ") }]
          : []),
        ...(listing.reservationRules
          ? [{ label: "Reservation rules", value: listing.reservationRules }]
          : []),
      ];
    if (listing.type === "Activity")
      return [
        ...(listing.activityType
          ? [{ label: "Activity", value: listing.activityType }]
          : []),
        ...(listing.durationHours
          ? [{ label: "Duration", value: `${listing.durationHours} hours` }]
          : []),
        ...(listing.difficultyLevel
          ? [{ label: "Difficulty", value: listing.difficultyLevel }]
          : []),
        ...(listing.minGroupSize || listing.maxGroupSize
          ? [
              {
                label: "Group size",
                value: `${listing.minGroupSize ?? 1}–${listing.maxGroupSize ?? "Any"}`,
              },
            ]
          : []),
        ...(listing.minAge || listing.maxAge
          ? [
              {
                label: "Age range",
                value: `${listing.minAge ?? 0}–${listing.maxAge ?? "Any"}`,
              },
            ]
          : []),
        ...(listing.availabilitySchedule
          ? [{ label: "Availability", value: listing.availabilitySchedule }]
          : []),
        ...(listing.safetyRequirements
          ? [
              {
                label: "Safety requirements",
                value: listing.safetyRequirements,
              },
            ]
          : []),
      ];
    if (listing.type === "Event")
      return [
        ...(listing.eventDateTime
          ? [
              {
                label: "Date and time",
                value: new Date(listing.eventDateTime).toLocaleString(),
              },
            ]
          : []),
        ...(listing.eventType
          ? [{ label: "Event type", value: listing.eventType }]
          : []),
        ...(listing.organizer
          ? [{ label: "Organizer", value: listing.organizer }]
          : []),
        ...(listing.seatCount
          ? [{ label: "Capacity", value: String(listing.seatCount) }]
          : []),
        ...(listing.ticketPrice
          ? [
              {
                label: "Ticket price",
                value: `${listing.currency} ${listing.ticketPrice}`,
              },
            ]
          : []),
        ...(listing.ticketTypes?.length
          ? [
              {
                label: "Tickets",
                value: listing.ticketTypes
                  .map((ticket) => `${ticket.type} (${ticket.price})`)
                  .join(", "),
              },
            ]
          : []),
      ];
    if (listing.type === "CarRental")
      return [
        ...(listing.vehicleSeatCount
          ? [{ label: "Seats", value: String(listing.vehicleSeatCount) }]
          : []),
        ...(listing.pickupLocation
          ? [{ label: "Pickup", value: listing.pickupLocation }]
          : []),
        ...(listing.returnLocation
          ? [{ label: "Return", value: listing.returnLocation }]
          : []),
        ...(listing.hourlyRate
          ? [
              {
                label: "Hourly rate",
                value: `${listing.currency} ${listing.hourlyRate}`,
              },
            ]
          : []),
        ...(listing.availabilityStatus
          ? [{ label: "Status", value: listing.availabilityStatus }]
          : []),
      ];
    return [];
  })();

  return (
    <Box>
      {/* Title - category is already shown as a badge on the hero photo */}
      <Typography
        variant="h4"
        sx={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700,
          color: "text.primary",
          mb: 1,
          letterSpacing: "-0.02em",
        }}
      >
        {listing.title}
      </Typography>

      {/* Rating + Location + Vendor row */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
          mb: 3,
        }}
      >
        {listing.reviews > 0 && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <Rating
              value={listing.rating}
              precision={0.5}
              readOnly
              size="small"
              sx={{ "& .MuiRating-iconFilled": { color: "#F5A623" } }}
            />
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {listing.rating.toFixed(1)} ({listing.reviews} review
              {listing.reviews === 1 ? "" : "s"})
            </Typography>
          </Box>
        )}

        {/* Opens the real address in Google Maps rather than just being static text. */}
        <Box
          component="a"
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(listing.venueAddress || listing.location)}`}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            textDecoration: "none",
            "&:hover .product-location-text": { textDecoration: "underline" },
          }}
        >
          <LocationOnIcon sx={{ fontSize: "1rem", color: "text.secondary" }} />
          <Typography
            variant="body2"
            className="product-location-text"
            sx={{ color: "text.secondary" }}
          >
            {listing.location}
          </Typography>
        </Box>

        {listing.vendorName && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <StorefrontOutlinedIcon
              sx={{ fontSize: "1rem", color: "text.secondary" }}
            />
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {listing.vendorName}
            </Typography>
          </Box>
        )}

        <Chip
          label={listing.isAvailable ? "Available" : "Unavailable"}
          size="small"
          sx={{
            backgroundColor: listing.isAvailable
              ? "rgba(16,185,129,0.12)"
              : "rgba(220,38,38,0.1)",
            color: listing.isAvailable ? "success.main" : "error.main",
            fontWeight: 600,
            fontSize: "0.7rem",
          }}
        />
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* About */}
      <Typography
        variant="h6"
        sx={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700,
          mb: 1.5,
          letterSpacing: "-0.01em",
        }}
      >
        About this listing
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: "text.secondary", lineHeight: 1.8, mb: 3 }}
      >
        {listing.description?.trim() ||
          "No description provided for this listing yet."}
      </Typography>

      {categorySpecs.length > 0 && (
        <>
          <Divider sx={{ mb: 3 }} />
          <Typography
            variant="h6"
            sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, mb: 2 }}
          >
            {listing.type === "Hotel"
              ? "Hotel details"
              : listing.type === "Restaurant"
                ? "Dining details"
                : listing.type === "Activity"
                  ? "Activity details"
                  : listing.type === "Event"
                    ? "Event details"
                    : "Rental details"}
          </Typography>
          <SpecGrid specs={categorySpecs} />
        </>
      )}

      {/* Additional details — admin-configured custom fields for this
          listing's category (CategoryCustomField). Shown for any category
          that has them, not just a fixed set of types. */}
      {!!listing.customFieldValues?.length && (
        <>
          <Divider sx={{ mb: 3 }} />
          <Typography
            variant="h6"
            sx={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              mb: 2,
              letterSpacing: "-0.01em",
            }}
          >
            Additional details
          </Typography>
          <SpecGrid
            specs={listing.customFieldValues.map((field) => ({
              label: field.label,
              value: field.value,
            }))}
          />
        </>
      )}

      {/* Venue — Event listings only, shown when the vendor set one */}
      {listing.type === "Event" &&
        (listing.venueName || listing.venueAddress) && (
          <>
            <Divider sx={{ mb: 3 }} />
            <Typography
              variant="h6"
              sx={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                mb: 2,
                letterSpacing: "-0.01em",
              }}
            >
              Venue
            </Typography>
            <SpecGrid
              specs={[
                ...(listing.venueName
                  ? [{ label: "Venue", value: listing.venueName }]
                  : []),
                ...(listing.venueAddress
                  ? [{ label: "Address", value: listing.venueAddress }]
                  : []),
              ]}
            />
          </>
        )}

      {/* Vehicle Details — Car Rental listings only */}
      {listing.type === "CarRental" &&
        (listing.vehicleBrand || listing.vehicleModel) && (
          <>
            <Divider sx={{ mb: 3 }} />
            <Typography
              variant="h6"
              sx={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                mb: 2,
                letterSpacing: "-0.01em",
              }}
            >
              Vehicle Details
            </Typography>
            <SpecGrid
              specs={[
                ...(listing.vehicleBrand
                  ? [{ label: "Brand", value: listing.vehicleBrand }]
                  : []),
                ...(listing.vehicleModel
                  ? [{ label: "Model", value: listing.vehicleModel }]
                  : []),
                ...(listing.vehicleYear
                  ? [{ label: "Year", value: String(listing.vehicleYear) }]
                  : []),
                ...(listing.vehicleTransmission
                  ? [
                      {
                        label: "Transmission",
                        value: listing.vehicleTransmission,
                      },
                    ]
                  : []),
                ...(listing.vehicleFuelType
                  ? [{ label: "Fuel Type", value: listing.vehicleFuelType }]
                  : []),
              ]}
            />
          </>
        )}

      {/* Amenities — only shown when the backend actually returned some */}
      {listing.amenities.length > 0 && (
        <>
          <Divider sx={{ mb: 3 }} />
          <Typography
            variant="h6"
            sx={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              mb: 2,
              letterSpacing: "-0.01em",
            }}
          >
            What's included
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 1.5,
              mb: 1,
            }}
          >
            {listing.amenities.map((item) => (
              <Box
                key={item}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: "10px",
                  px: 2,
                  py: 1.25,
                  color: "text.secondary",
                }}
              >
                <CheckCircleOutlineIcon
                  sx={{ fontSize: "1.1rem", color: "primary.main" }}
                />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {item}
                </Typography>
              </Box>
            ))}
          </Box>
        </>
      )}

      {/* Real interactive location pin - prefers the Event venue address
          when set (more precise than the general listing location). */}
      <Divider sx={{ mb: 3 }} />
      <Typography
        variant="h6"
        sx={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700,
          mb: 2,
          letterSpacing: "-0.01em",
        }}
      >
        Location
      </Typography>
      <LocationMap
        query={listing.venueAddress || listing.location}
        label={listing.title}
      />

      <ListingReviews listingId={listing.id} />
      <ListingQuestions listingId={listing.id} />
    </Box>
  );
};

export default ProductDetails;
