// src/pages/Vendor/CreateListing/CreateListing.tsx
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Link as MuiLink,
  CircularProgress,
} from "@mui/material";
import { isAxiosError } from "axios";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createListing,
  updateListing,
  getCategories,
  getListingById,
} from "../../../services/Vendor/listingService";
import type {
  CreateListingRequest,
  CategoryDto,
  ListingResponse,
  ListingType,
} from "../../../services/Vendor/listingService";
import type { ListingFormData, ListingCategory } from "../../../utils/types";
import ActivityFields from "./components/ActivityFields";
import BaseFields from "./components/BaseFields";
import CarRentalFields from "./components/CarRentalFields";
import EventFields from "./components/EventFields";
import HotelFields from "./components/HotelFields";
import ListingPreview from "./components/ListingPreview";
import RestaurantFields from "./components/RestaurantFields";

// ListingType and ListingCategory are the same set of string literals
// (Hotel/Restaurant/Event/CarRental/Activity) — kept as an explicit map
// rather than a cast so the two concepts read as distinct at each call site.
const typeToCategory: Record<ListingType, ListingCategory> = {
  Hotel: "Hotel",
  Restaurant: "Restaurant",
  Event: "Event",
  CarRental: "CarRental",
  Activity: "Activity",
};

function buildEditFormData(listing: ListingResponse): Partial<ListingFormData> {
  const data: Partial<ListingFormData> = {
    title: listing.title,
    description: listing.description ?? "",
    location: listing.location ?? "",
    price: listing.price,
    category: typeToCategory[listing.type] ?? "Hotel",
    categoryId: listing.categoryId,
    isActive: listing.isActive,
    imageUrls: listing.images?.join(", ") ?? "",
    tagsInput: listing.tags?.join(", ") ?? "",
    cancellationPolicy: listing.cancellationPolicy ?? "",
  };

  const { hotelDetails, restaurantDetails, activityDetails, eventDetails, carRentalDetails } = listing;

  if (hotelDetails) {
    data.pricePerNight = hotelDetails.pricePerNight;
    data.numberOfRooms = hotelDetails.availableRooms;
    data.amenities = hotelDetails.amenities;
    data.checkInTime = hotelDetails.checkInTime;
    data.checkOutTime = hotelDetails.checkOutTime;
    data.roomTypes = hotelDetails.roomTypes;
    data.propertyType = hotelDetails.propertyType ?? "";
    data.roomType = hotelDetails.primaryRoomType ?? "";
  } else if (restaurantDetails) {
    const [openingTime, closingTime] = restaurantDetails.openingHours.split(" - ");
    data.cuisineType = restaurantDetails.cuisineType;
    data.averageCost = restaurantDetails.averageCost;
    data.openingTime = openingTime ?? "06:00";
    data.closingTime = closingTime ?? "23:00";
    data.seatingCapacity = restaurantDetails.tableCapacity;
    data.tableTypes = restaurantDetails.tableTypes;
    data.reservationRules = restaurantDetails.reservationRules ?? "";
  } else if (activityDetails) {
    data.activityType = activityDetails.activityType;
    data.duration = `${activityDetails.durationHours} hours`;
    data.difficultyLevel = activityDetails.difficultyLevel;
    data.activityPrice = activityDetails.price;
    data.minGroupSize = activityDetails.minGroupSize;
    data.maxGroupSize = activityDetails.maxGroupSize;
    data.minAge = activityDetails.minAge;
    data.maxAge = activityDetails.maxAge;
    data.includedServices = activityDetails.includedServices;
    data.safetyRequirements = activityDetails.safetyRequirements;
    data.availabilitySchedule = activityDetails.availabilitySchedule;
  } else if (eventDetails) {
    const [eventDate, eventTime] = eventDetails.dateAndTime.split("T");
    data.organizer = eventDetails.organizer;
    data.eventDate = eventDate ?? "";
    data.eventTime = eventTime ?? "";
    data.seatCount = eventDetails.seatCount;
    data.eventType = eventDetails.eventType ?? "";
    data.venueName = eventDetails.venueName ?? "";
    data.venueAddress = eventDetails.venueAddress ?? "";
    data.ticketTypes = eventDetails.ticketTypes ?? [];
  } else if (carRentalDetails) {
    data.brand = carRentalDetails.brand;
    data.model = carRentalDetails.model;
    data.transmission = carRentalDetails.transmission;
    data.dailyRate = carRentalDetails.pricePerDay;
    data.seatCountCar = carRentalDetails.seatCount;
    data.fuelType = carRentalDetails.fuelType;
    data.availabilityStatus = carRentalDetails.availabilityStatus;
    data.year = carRentalDetails.year;
    data.hourlyRate = carRentalDetails.hourlyRate;
    data.pickupLocation = carRentalDetails.pickupLocation ?? "";
    data.returnLocation = carRentalDetails.returnLocation ?? "";
    data.insuranceOptions = carRentalDetails.insuranceOptions ?? "";
  }

  return data;
}

function buildCreateListingRequest(
  data: ListingFormData,
  categoryId: string,
): CreateListingRequest {
  const request: CreateListingRequest = {
    categoryId,
    title: data.title,
    description: data.description ?? "",
    price: Number(data.price) || 0,
    currency: "LKR",
    location: data.location,
    isActive: data.isActive ?? true,
    images: data.imageUrls
      ? data.imageUrls.split(",").map((u) => u.trim()).filter(Boolean)
      : data.images?.filter(Boolean) ?? [],
    tags: data.tagsInput
      ? data.tagsInput.split(",").map((t) => t.trim()).filter(Boolean)
      : [],
    cancellationPolicy: data.cancellationPolicy || "Free cancellation within 24 hours",
  };

  switch (data.category) {
    case "Hotel":
      request.hotelDetails = {
        pricePerNight: Number(data.pricePerNight ?? data.price) || 0,
        availableRooms: Number(data.numberOfRooms) || 0,
        amenities: data.amenities ?? [],
        checkInTime: data.checkInTime || "14:00",
        checkOutTime: data.checkOutTime || "12:00",
        roomTypes: data.roomTypes ?? [],
        propertyType: data.propertyType ?? "",
        primaryRoomType: data.roomType ?? "",
      };
      break;
    case "Restaurant":
      request.restaurantDetails = {
        cuisineType: data.cuisineType ?? "",
        averageCost: Number(data.averageCost) || 0,
        openingHours: `${data.openingTime || "06:00"} - ${data.closingTime || "23:00"}`,
        tableCapacity: Number(data.seatingCapacity) || 0,
        tableTypes: data.tableTypes ?? [],
        reservationRules: data.reservationRules ?? "",
      };
      break;
    case "Activity":
      request.activityDetails = {
        activityType: data.activityType ?? "",
        durationHours: parseInt(data.duration?.replace(/\D/g, "") || "0", 10),
        difficultyLevel: data.difficultyLevel || "Easy",
        price: Number(data.activityPrice) || 0,
        minGroupSize: Number(data.minGroupSize) || 1,
        maxGroupSize: Number(data.maxGroupSize) || 10,
        minAge: Number(data.minAge) || 0,
        maxAge: Number(data.maxAge) || 100,
        includedServices: data.includedServices ?? [],
        safetyRequirements: data.safetyRequirements ?? "",
        availabilitySchedule: data.availabilitySchedule ?? "",
      };
      break;
    case "Event":
      request.eventDetails = {
        eventName: data.title,
        organizer: data.organizer ?? "",
        dateAndTime: `${data.eventDate || "2026-05-10"}T${data.eventTime || "19:00"}:00`,
        seatCount: Number(data.seatCount) || 0,
        ticketPrice: Number(data.ticketTypes?.[0]?.price) || 0,
        eventType: data.eventType ?? "",
        venueName: data.venueName ?? "",
        venueAddress: data.venueAddress ?? "",
        ticketTypes: data.ticketTypes ?? [],
      };
      break;
    case "CarRental":
      request.carRentalDetails = {
        brand: data.brand || data.vehicleType || "",
        model: data.model ?? "",
        transmission: data.transmission || "Automatic",
        pricePerDay: Number(data.dailyRate) || 0,
        seatCount: Number(data.seatCountCar) || 0,
        fuelType: data.fuelType ?? "",
        availabilityStatus: data.availabilityStatus || "Available",
        year: Number(data.year) || undefined,
        hourlyRate: Number(data.hourlyRate) || undefined,
        pickupLocation: data.pickupLocation ?? "",
        returnLocation: data.returnLocation ?? "",
        insuranceOptions: data.insuranceOptions || "Basic Insurance",
      };
      break;
  }

  return request;
}

const CreateListing = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(isEditMode);

  const {
    register,
    control,
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ListingFormData>({
    defaultValues: {
      category: "Hotel",
      ticketTypes: [
        { type: "General Admission", quantity: 100, price: 50 },
        { type: "VIP", quantity: 100, price: 150 },
        { type: "Early Bird", quantity: 100, price: 35 },
      ],
    },
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);

        if (isEditMode && id) {
          const listing = await getListingById(id);
          reset(buildEditFormData(listing) as ListingFormData);
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        alert("Failed to load listing data.");
        navigate("/vendor/listings");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [id, isEditMode, navigate, reset]);

  const formData = watch();
  const selectedCategory = watch("category");
  const selectedCategoryId = watch("categoryId");

  // ListingType is no longer picked independently — it's derived from the
  // chosen category's Type, which decides which detail-fields section
  // renders below (see typeToCategory above).
  useEffect(() => {
    const chosen = categories.find((c) => c.id === selectedCategoryId);
    if (chosen?.type !== undefined && chosen.type !== null) {
      setValue("category", typeToCategory[chosen.type]);
    }
  }, [selectedCategoryId, categories, setValue]);

  const onSubmit = async (data: ListingFormData) => {
    try {
      // The category select is required and only ever offers real,
      // currently-fetched admin categories — no fallback to "closest match"
      // or "first available". If it doesn't exist as a real category, this
      // listing cannot be published as that category.
      const categoryExists = categories.some((c) => c.id === data.categoryId);
      if (!categoryExists) {
        alert("Please select a valid category.");
        return;
      }

      const request = buildCreateListingRequest(data, data.categoryId);

      if (isEditMode && id) {
        await updateListing(id, request);
        alert("Listing updated successfully!");
      } else {
        await createListing(request);
        alert("Listing published successfully!");
      }
      navigate("/vendor/listings");
    } catch (error) {
      console.error(error);
      const backendMessage = isAxiosError(error)
        ? (error.response?.data as { message?: string } | undefined)?.message
        : undefined;
      alert(backendMessage || `Failed to ${isEditMode ? "update" : "publish"} listing.`);
    }
  };

  const renderCategoryFields = () => {
    switch (selectedCategory) {
      case "Hotel":
        return <HotelFields register={register} control={control} errors={errors} />;
      case "Restaurant":
        return <RestaurantFields register={register} control={control} errors={errors} />;
      case "Activity":
        return <ActivityFields register={register} control={control} errors={errors} />;
      case "Event":
        return <EventFields register={register} control={control} errors={errors} />;
      case "CarRental":
        return <CarRentalFields register={register} control={control} errors={errors} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 20, textAlign: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading listing details...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 4 }}>
        <MuiLink
          component={Link}
          to="/vendor/listings"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "text.secondary",
            textDecoration: "none",
            fontWeight: 500,
            fontSize: "0.9rem",
            "&:hover": { color: "#0F5A8A" },
          }}
        >
          <ArrowBackIcon sx={{ fontSize: 18 }} />
          Back to Listings
        </MuiLink>
      </Box>

      <Typography
        variant="h4"
        sx={{ mb: 4, fontWeight: 700, color: "#1E293B" }}
      >
        {isEditMode ? "Edit Listing" : "Create New Listing"}
      </Typography>

      <Card
        sx={{
          borderRadius: "16px",
          boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
          border: "1px solid #E2E8F0",
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <BaseFields register={register} control={control} errors={errors} categories={categories} />

            {renderCategoryFields()}

            <Box
              sx={{
                mt: 6,
                pt: 4,
                borderTop: "1px solid #E2E8F0",
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="outlined"
                onClick={() => navigate("/vendor/listings")}
                sx={{ borderRadius: "10px", px: 3 }}
              >
                Cancel
              </Button>
              {!isEditMode && (
                <Button
                  variant="outlined"
                  startIcon={<SaveIcon />}
                  sx={{ borderRadius: "10px", px: 3 }}
                >
                  Save Draft
                </Button>
              )}
              <Button
                variant="outlined"
                startIcon={<VisibilityIcon />}
                onClick={() => setPreviewOpen(true)}
                sx={{ borderRadius: "10px", px: 3 }}
              >
                Preview
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                sx={{
                  borderRadius: "10px",
                  px: 4,
                  backgroundColor: "#0F5A8A",
                  "&:hover": { backgroundColor: "#0C4A73" },
                }}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} sx={{ color: "white" }} />
                ) : isEditMode ? (
                  "Update Listing"
                ) : (
                  "Publish Listing"
                )}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>

      <ListingPreview
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        data={formData}
      />
    </Container>
  );
};

export default CreateListing;
