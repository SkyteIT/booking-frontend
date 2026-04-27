import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Link as MuiLink,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BaseFields from "./components/BaseFields";
import HotelFields from "./components/HotelFields";
import RestaurantFields from "./components/RestaurantFields";
import ActivityFields from "./components/ActivityFields";
import EventFields from "./components/EventFields";
import CarRentalFields from "./components/CarRentalFields";
import ListingPreview from "./components/ListingPreview";
import type { ListingFormData, ListingCategory } from "../../../utils/types";
import {
  createListing,
  getCategories,
  getCurrentVendor,
  ListingType,
} from "../../../services/Vendor/listingService";
import type {
  CreateListingRequest,
  CategoryDto,
} from "../../../services/Vendor/listingService";

const CreateListing = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [vendorId, setVendorId] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [cats, vendor] = await Promise.all([
          getCategories(),
          getCurrentVendor(),
        ]);
        setCategories(cats);
        setVendorId(vendor.id);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };
    fetchInitialData();
  }, []);

  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<ListingFormData>({
    defaultValues: {
      category: "Hotels" as ListingCategory,
      ticketTypes: [
        { type: "General Admission", quantity: 100, price: 50 },
        { type: "VIP", quantity: 100, price: 150 },
        { type: "Early Bird", quantity: 100, price: 35 },
      ],
    },
  });

  const formData = watch();

  const selectedCategory = watch("category");

  const onSubmit = async (data: ListingFormData) => {
    try {
      let type: string;
      switch (data.category) {
        case "Hotels":
          type = "Hotel";
          break;
        case "Restaurants":
          type = "Restaurant";
          break;
        case "Activities":
          type = "Activity";
          break;
        case "Events":
          type = "Event";
          break;
        case "Car Rentals":
          type = "CarRental";
          break;
        default:
          type = "Hotel";
      }

      let categoryId = "00000000-0000-0000-0000-000000000000";
      const categoryMatch = categories.find((c) =>
        c.name
          .toLowerCase()
          .includes(data.category.toLowerCase().replace("s", "")),
      );
      if (categoryMatch) {
        categoryId = categoryMatch.id;
      } else if (categories.length > 0) {
        categoryId = categories[0].id;
      }

      if (!vendorId) {
        alert(
          "Vendor profile not loaded. Ensure database is seeded and try again.",
        );
        return;
      }

      const request: CreateListingRequest = {
        vendorId: vendorId,
        categoryId: categoryId,
        type: ListingType[type as keyof typeof ListingType],
        title: data.title,
        description: data.description || "",
        basePrice: data.price || 0,
        currency: "LKR",
        location: data.location,
        status: data.status || "Active",
        isAvailable:
          data.isAvailable !== undefined
            ? fieldToBoolean(data.isAvailable)
            : true,
        images: data.imageUrls
          ? (data.imageUrls as string)
            .split(",")
            .map((u) => u.trim())
            .filter((u) => u !== "")
          : Array.isArray(data.images) && data.images.length > 0
            ? data.images
            : ["https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000"], // Better placeholder
        tags:
          typeof data.tags === "string"
            ? (data.tags as string)
              .split(",")
              .map((t) => t.trim())
              .filter((t) => t !== "")
            : data.tags || [],
        cancellationPolicy:
          data.cancellationPolicy || "Free cancellation within 24 hours",
      };

      // Helper function to ensure boolean
      function fieldToBoolean(val: any): boolean {
        if (typeof val === "boolean") return val;
        return val === "true";
      }

      if (type === "Hotel") {
        request.hotelDetails = {
          pricePerNight: data.pricePerNight || data.price || 0,
          availableRooms: data.numberOfRooms || 0,
          amenities: data.amenities || [],
          checkInTime: data.checkInTime || "14:00",
          checkOutTime: data.checkOutTime || "12:00",
          roomTypes: data.roomTypes || [],
          propertyType: data.propertyType || "",
          primaryRoomType: data.roomType || "",
        };
      } else if (type === "Restaurant") {
        request.restaurantDetails = {
          cuisineType: data.cuisineType || "",
          averageCost: data.averageCost || 0,
          openingHours: `${data.openingTime || "06:00"} - ${data.closingTime || "23:00"}`,
          tableCapacity: data.seatingCapacity || 0,
          tableTypes: data.tableTypes || [],
          reservationRules: data.reservationRules || "",
        };
      } else if (type === "Activity") {
        request.activityDetails = {
          activityType: data.activityType || "",


          durationHours: parseInt(data.duration?.replace(/\D/g, "") || "0"),

          difficultyLevel: data.difficultyLevel || "Easy",

          price: data.activityPrice || 0,

          // NEW FIELDS (must match backend DTO)
          minGroupSize: data.minGroupSize || 1,
          maxGroupSize: data.maxGroupSize || 10,
          minAge: data.minAge || 0,
          maxAge: data.maxAge || 100,

          includedServices: data.includedServices || [],

          safetyRequirements: data.safetyRequirements || "",
          availabilitySchedule: data.availabilitySchedule || "",
        };
      } else if (type === "Event") {
        request.eventDetails = {
          eventName: data.title,
          organizer: data.organizer || "",
          dateAndTime: `${data.eventDate || "2026-05-10"}T${data.eventTime || "19:00:00"}`,
          seatCount: data.seatCount || 0,
          ticketPrice: data.ticketTypes?.[0]?.price || 0,
          eventType: data.eventType || "",
          venueName: data.venueName || "",
          venueAddress: data.venueAddress || "",
          ticketTypes: data.ticketTypes || [],
        };
      } else if (type === "CarRental") {
        request.carRentalDetails = {
          brand: data.brand || data.vehicleType || "",
          model: data.model || "",
          transmission: data.transmission || "Automatic",
          pricePerDay: data.dailyRate || 0,
          seatCount: data.seatCountCar || 0,
          fuelType: data.fuelType || "",
          availabilityStatus: data.availabilityStatus || "Available",
          year: data.year || 2024,
          hourlyRate: data.hourlyRate || 0,
          pickupLocation: data.pickupLocation || "",
          returnLocation: data.returnLocation || "",
          insuranceOptions: data.insuranceOptions || "Basic Insurance",
        };
      }

      await createListing(request);
      alert("Listing published successfully!");
      navigate("/vendor/listings");
    } catch (error) {
      console.error(error);
      alert("Failed to publish listing. Check console for details.");
    }
  };

  const renderCategoryFields = () => {
    switch (selectedCategory) {
      case "Hotels":
        return (
          <HotelFields register={register} control={control} errors={errors} />
        );
      case "Restaurants":
        return (
          <RestaurantFields
            register={register}
            control={control}
            errors={errors}
          />
        );
      case "Activities":
        return (
          <ActivityFields
            register={register}
            control={control}
            errors={errors}
          />
        );
      case "Events":
        return (
          <EventFields register={register} control={control} errors={errors} />
        );
      case "Car Rentals":
        return (
          <CarRentalFields
            register={register}
            control={control}
            errors={errors}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Back button */}
      <Box sx={{ mb: 4 }}>
        <MuiLink
          component={Link}
          to="/vendor/dashboard"
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
          Back to Dashboard
        </MuiLink>
      </Box>

      <Typography
        variant="h4"
        sx={{ mb: 4, fontWeight: 700, color: "#1E293B" }}
      >
        Create New Listing
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
            <BaseFields register={register} control={control} errors={errors} />

            {renderCategoryFields()}

            {/* Form Actions */}
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
              <Button variant="outlined" sx={{ borderRadius: "10px", px: 3 }}>
                Cancel
              </Button>
              <Button
                variant="outlined"
                startIcon={<SaveIcon />}
                sx={{ borderRadius: "10px", px: 3 }}
              >
                Save Draft
              </Button>
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
                sx={{
                  borderRadius: "10px",
                  px: 4,
                  backgroundColor: "#0F5A8A",
                  "&:hover": { backgroundColor: "#0C4A73" },
                }}
              >
                Publish Listing
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
