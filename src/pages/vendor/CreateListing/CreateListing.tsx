// src/pages/vendor/CreateListing/CreateListing.tsx
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
import type { ListingFormData, ListingCategory } from "../../../utils/types";
import { createListing, ListingType } from "../../../services/Vendor/listingService";
import type { CreateListingRequest } from "../../../services/Vendor/listingService";

const CreateListing = () => {
  const navigate = useNavigate();
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

  const selectedCategory = watch("category");

  const onSubmit = async (data: ListingFormData) => {
    try {
      let type: ListingType;
      switch(data.category) {
        case "Hotels": type = ListingType.Hotel; break;
        case "Restaurants": type = ListingType.Restaurant; break;
        case "Activities": type = ListingType.Activity; break;
        case "Events": type = ListingType.Event; break;
        case "Car Rentals": type = ListingType.CarRental; break;
        default: type = ListingType.Hotel;
      }

      const request: CreateListingRequest = {
        vendorId: "00000000-0000-0000-0000-000000000000", // TODO: Replace with auth vendor ID
        categoryId: "00000000-0000-0000-0000-000000000000", // TODO: Category logic
        title: data.title,
        description: data.description || "",
        price: data.price || 0,
        currency: "LKR",
        location: data.location,
        type: type,
      };

      if (type === ListingType.Hotel) {
        request.hotelDetails = {
          pricePerNight: data.pricePerNight || 0,
          location: data.location,
          availableRooms: data.numberOfRooms || 0,
          amenities: (data.amenities || []).join(", "),
          checkInTime: data.checkInTime ? data.checkInTime + ":00" : "14:00:00",
          checkOutTime: data.checkOutTime ? data.checkOutTime + ":00" : "12:00:00"
        };
      } else if (type === ListingType.Restaurant) {
        request.restaurantDetails = {
          cuisineType: data.cuisineType || "",
          averageCost: data.averageCost || 0,
          openingHours: `${data.openingTime || "08:00"} - ${data.closingTime || "22:00"}`,
          tableCapacity: data.seatingCapacity || 0,
          location: data.location
        };
      } else if (type === ListingType.Activity) {
        request.activityDetails = {
          activityType: data.activityType || "",
          durationHours: parseInt(data.duration || "0") || 0,
          difficultyLevel: data.difficultyLevel || "",
          price: data.activityPrice || 0,
          location: data.location
        };
      } else if (type === ListingType.Event) {
        request.eventDetails = {
          eventName: data.title,
          organizer: data.organizer || "",
          dateAndTime: `${data.eventDate || "2024-01-01"}T${data.eventTime || "00:00:00"}Z`,
          location: data.location || data.venueAddress || "",
          seatCount: data.seatCount || 0,
          ticketPrice: data.ticketTypes?.[0]?.price || 0
        };
      } else if (type === ListingType.CarRental) {
        request.carRentalDetails = {
          brand: data.brand || "",
          model: data.model || "",
          transmission: data.transmission || "",
          pricePerDay: data.dailyRate || 0,
          seatCount: data.seatCountCar || 0,
          fuelType: data.fuelType || "",
          availabilityStatus: data.availabilityStatus || "Available"
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
    </Container>
  );
};

export default CreateListing;
