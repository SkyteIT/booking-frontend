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
  CircularProgress,
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
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
  updateListing,
  getCategories,
  getCurrentVendor,
  getListingById,
  ListingType,
} from "../../../services/Vendor/listingService";
import type {
  CreateListingRequest,
  CategoryDto,
  ListingResponse,
} from "../../../services/Vendor/listingService";

const CreateListing = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [vendorId, setVendorId] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(isEditMode);

  const {
    register,
    control,
    watch,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ListingFormData>({
    defaultValues: {
      category: "Hotel" as ListingCategory,
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
        const [cats, vendor] = await Promise.all([
          getCategories(),
          getCurrentVendor(),
        ]);
        setCategories(cats);
        setVendorId(vendor.id);

        if (isEditMode && id) {
          const listingData: ListingResponse = await getListingById(id);

          const typeMap: Record<string | number, ListingCategory> = {
            0: "Hotel",
            1: "Restaurant",
            2: "Event",
            3: "CarRental",
            4: "Activity",
            "Hotel": "Hotel",
            "Restaurant": "Restaurant",
            "Event": "Event",
            "CarRental": "CarRental",
            "Activity": "Activity",
          };

          // Map backend response to form data
          const typeValueFromApi =
            listingData.type !== undefined
              ? listingData.type
              : (listingData as any).Type;
          
          const categoryValue = typeMap[typeValueFromApi] || "Hotel";

          const initialFormData: any = {
            title: listingData.title || (listingData as any).Title || "",
            description:
              listingData.description || (listingData as any).Description || "",
            location:
              listingData.location || (listingData as any).Location || "",
            price: listingData.basePrice || (listingData as any).BasePrice || 0,
            categoryId: listingData.categoryId,
            category: categoryValue,
            status:
              (listingData.status || (listingData as any).Status) === "Live" ||
              (listingData.status || (listingData as any).Status) === "Active"
                ? "Active"
                : "Inactive",
            isActive: listingData.isActive,
            isAvailable:
              listingData.isAvailable !== undefined
                ? listingData.isAvailable
                : (listingData as any).IsAvailable !== undefined
                  ? (listingData as any).IsAvailable
                  : true,
            imageUrls:
              (listingData.images || (listingData as any).Images)?.join(", ") ||
              "",
            tags:
              (listingData.tags || (listingData as any).Tags)?.join(", ") || "",
            cancellationPolicy:
              listingData.cancellationPolicy ||
              (listingData as any).CancellationPolicy ||
              "",
          };

          // Map detail fields (handling potential PascalCase or camelCase from API)
          const hotel =
            listingData.hotelDetails || (listingData as any).HotelDetails;
          const restaurant =
            listingData.restaurantDetails ||
            (listingData as any).RestaurantDetails;
          const activity =
            listingData.activityDetails || (listingData as any).ActivityDetails;
          const event =
            listingData.eventDetails || (listingData as any).EventDetails;
          const carRental =
            listingData.carRentalDetails ||
            (listingData as any).CarRentalDetails;

          if (hotel) {
            initialFormData.pricePerNight =
              hotel.pricePerNight ||
              hotel.PricePerNight ||
              initialFormData.price;
            initialFormData.numberOfRooms =
              hotel.availableRooms || hotel.AvailableRooms || 0;
            initialFormData.amenities =
              hotel.amenities || hotel.Amenities || [];
            initialFormData.checkInTime =
              hotel.checkInTime || hotel.CheckInTime || "";
            initialFormData.checkOutTime =
              hotel.checkOutTime || hotel.CheckOutTime || "";
            initialFormData.roomTypes =
              hotel.roomTypes || hotel.RoomTypes || [];
            initialFormData.propertyType =
              hotel.propertyType || hotel.PropertyType || "";
            initialFormData.roomType =
              hotel.primaryRoomType || hotel.PrimaryRoomType || "";
          } else if (restaurant) {
            initialFormData.cuisineType =
              restaurant.cuisineType || restaurant.CuisineType || "";
            initialFormData.averageCost =
              restaurant.averageCost || restaurant.AverageCost || 0;
            const hours = (
              restaurant.openingHours || restaurant.OpeningHours
            )?.split(" - ");
            initialFormData.openingTime = hours?.[0] || "06:00";
            initialFormData.closingTime = hours?.[1] || "23:00";
            initialFormData.seatingCapacity =
              restaurant.tableCapacity || restaurant.TableCapacity || 0;
            initialFormData.tableTypes =
              restaurant.tableTypes || restaurant.TableTypes || [];
            initialFormData.reservationRules =
              restaurant.reservationRules || restaurant.ReservationRules || "";
          } else if (activity) {
            initialFormData.activityType =
              activity.activityType || activity.ActivityType || "";
            const dur = activity.durationHours || activity.DurationHours;
            initialFormData.duration = dur ? String(dur) : "";
            initialFormData.difficultyLevel =
              activity.difficultyLevel || activity.DifficultyLevel || "Easy";
            initialFormData.activityPrice =
              activity.price || activity.Price || 0;
            initialFormData.minGroupSize =
              activity.minGroupSize || activity.MinGroupSize || 1;
            initialFormData.maxGroupSize =
              activity.maxGroupSize || activity.MaxGroupSize || 10;
            initialFormData.minAge = activity.minAge || activity.MinAge || 0;
            initialFormData.maxAge = activity.maxAge || activity.MaxAge || 100;
            initialFormData.includedServices =
              activity.includedServices || activity.IncludedServices || [];
            initialFormData.safetyRequirements =
              activity.safetyRequirements || activity.SafetyRequirements || "";
            initialFormData.availabilitySchedule =
              activity.availabilitySchedule ||
              activity.AvailabilitySchedule ||
              "";
          } else if (event) {
            initialFormData.organizer =
              event.organizer || event.Organizer || "";
            const dateTime = (event.dateAndTime || event.DateAndTime)?.split(
              "T",
            );
            initialFormData.eventDate = dateTime?.[0] || "";
            initialFormData.eventTime = dateTime?.[1]?.substring(0, 5) || "";
            initialFormData.seatCount = event.seatCount || event.SeatCount || 0;
            initialFormData.eventType =
              event.eventType || event.EventType || "";
            initialFormData.venueName =
              event.venueName || event.VenueName || "";
            initialFormData.venueAddress =
              event.venueAddress || event.VenueAddress || "";
            initialFormData.ticketTypes =
              event.ticketTypes || event.TicketTypes || [];
          } else if (carRental) {
            initialFormData.brand = carRental.brand || carRental.Brand || "";
            initialFormData.model = carRental.model || carRental.Model || "";
            initialFormData.transmission =
              carRental.transmission || carRental.Transmission || "Automatic";
            initialFormData.dailyRate =
              carRental.pricePerDay || carRental.PricePerDay || 0;
            initialFormData.seatCountCar =
              carRental.seatCount || carRental.SeatCount || 0;
            initialFormData.fuelType =
              carRental.fuelType || carRental.FuelType || "";
            initialFormData.availabilityStatus =
              carRental.availabilityStatus ||
              carRental.AvailabilityStatus ||
              "Available";
            initialFormData.year = carRental.year || carRental.Year || 2024;
            initialFormData.hourlyRate =
              carRental.hourlyRate || carRental.HourlyRate || 0;
            initialFormData.pickupLocation =
              carRental.pickupLocation || carRental.PickupLocation || "";
            initialFormData.returnLocation =
              carRental.returnLocation || carRental.ReturnLocation || "";
            initialFormData.insuranceOptions =
              carRental.insuranceOptions || carRental.InsuranceOptions || "";
          }

          reset(initialFormData);
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
  const categoryId = watch("categoryId");
  const selectedCategory = watch("category");

  // Sync category string type based on category GUID
  useEffect(() => {
    if (categoryId && categories.length > 0) {
      const selectedCat = categories.find((c) => c.id === categoryId);
      if (selectedCat && selectedCat.type) {
        setValue("category", selectedCat.type as ListingCategory);
      }
    }
  }, [categoryId, categories, setValue]);

  const to12HourAndPeriod = (time24?: string): { time: string; period: string } => {
    if (!time24) return { time: "06:00", period: "AM" };
    const cleanTime = time24.split(" ")[0];
    const parts = cleanTime.split(":");
    let hours = Number(parts[0]);
    const minutes = parts[1] || "00";
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    if (hours === 0) hours = 12;
    return {
      time: `${hours}:${minutes}`,
      period
    };
  };

  const onSubmit = async (data: ListingFormData) => {
    try {
      const type = data.category;

      let categoryId = data.categoryId || "00000000-0000-0000-0000-000000000000";
      if (!data.categoryId && categories.length > 0) {
        const categoryMatch = categories.find(
          (c) =>
            c.name.toLowerCase().includes(data.category.toLowerCase()) ||
            data.category
              .toLowerCase()
              .includes(c.name.toLowerCase().replace("s", "")),
        );
        if (categoryMatch) {
          categoryId = categoryMatch.id;
        } else {
          categoryId = categories[0].id;
        }
      }

      if (!vendorId) {
        alert("Vendor profile not loaded. Please try again.");
        return;
      }

      // Map category-specific price input to base price
      let resolvedPrice = 0;
      if (type === "Hotel") {
        resolvedPrice = Number(data.pricePerNight) || 0;
      } else if (type === "Restaurant") {
        resolvedPrice = Number(data.averageCost) || 0;
      } else if (type === "Activity") {
        resolvedPrice = Number(data.activityPrice) || 0;
      } else if (type === "Event") {
        resolvedPrice = Number(data.ticketTypes?.[0]?.price) || 0;
      } else if (type === "CarRental") {
        resolvedPrice = Number(data.dailyRate) || 0;
      }

      const request: CreateListingRequest = {
        vendorId: vendorId,
        categoryId: categoryId,
        type: ListingType[type as keyof typeof ListingType],
        title: data.title,
        description: data.description || "",
        price: resolvedPrice,
        basePrice: resolvedPrice,
        currency: data.currency || "LKR",
        location: data.location,
        status: data.status || "Active",
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
        isAvailable:
          data.isAvailable !== undefined ? Boolean(data.isAvailable) : true,
        images: data.imageUrls
          ? data.imageUrls
              .split(",")
              .map((u) => u.trim())
              .filter((u) => u !== "")
          : Array.isArray(data.images) && data.images.length > 0
            ? data.images
            : [],
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

      if (type === "Hotel") {
        const checkIn = to12HourAndPeriod(data.checkInTime || "14:00");
        const checkOut = to12HourAndPeriod(data.checkOutTime || "12:00");
        request.hotelDetails = {
          pricePerNight: Number(data.pricePerNight) || 0,
          availableRooms: Number(data.numberOfRooms) || 0,
          amenities: data.amenities || [],
          checkInTime: `${checkIn.time} ${checkIn.period}`,
          checkOutTime: `${checkOut.time} ${checkOut.period}`,
          roomTypes: data.roomTypes || [],
          propertyType: data.propertyType || "",
          primaryRoomType: data.roomType || "",
        };
      } else if (type === "Restaurant") {
        const opening = to12HourAndPeriod(data.openingTime);
        const closing = to12HourAndPeriod(data.closingTime);
        request.restaurantDetails = {
          cuisineType: data.cuisineType || "",
          averageCost: Number(data.averageCost) || 0,
          openingTime: opening.time,
          openingPeriod: opening.period,
          closingTime: closing.time,
          closingPeriod: closing.period,
          openingHours: `${opening.time} ${opening.period} - ${closing.time} ${closing.period}`,
          tableCapacity: Number(data.seatingCapacity) || 0,
          tableTypes: data.tableTypes || [],
          reservationRules: data.reservationRules || "",
        };
      } else if (type === "Activity") {
        request.activityDetails = {
          activityType: data.activityType || "",
          durationHours: Number(data.duration) || 0,
          difficultyLevel: data.difficultyLevel || "Easy",
          price: Number(data.activityPrice) || 0,
          minGroupSize: Number(data.minGroupSize) || 1,
          maxGroupSize: Number(data.maxGroupSize) || 10,
          minAge: Number(data.minAge) || 0,
          maxAge: Number(data.maxAge) || 100,
          includedServices: data.includedServices || [],
          safetyRequirements: data.safetyRequirements || "",
          availabilitySchedule: data.availabilitySchedule || "",
        };
      } else if (type === "Event") {
        request.eventDetails = {
          eventName: data.title,
          organizer: data.organizer || "",
          dateAndTime: `${data.eventDate || "2026-05-10"}T${
            data.eventTime
              ? data.eventTime.length === 5
                ? `${data.eventTime}:00`
                : data.eventTime
              : "19:00:00"
          }`,
          seatCount: Number(data.seatCount) || 0,
          ticketPrice: Number(data.ticketTypes?.[0]?.price) || 0,
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
          pricePerDay: Number(data.dailyRate) || 0,
          seatCount: Number(data.seatCountCar) || 0,
          fuelType: data.fuelType || "",
          availabilityStatus: data.availabilityStatus || "Available",
          year: Number(data.year) || 2024,
          hourlyRate: Number(data.hourlyRate) || 0,
          pickupLocation: data.pickupLocation || "",
          returnLocation: data.returnLocation || "",
          insuranceOptions: data.insuranceOptions || "Basic Insurance",
        };
      }

      // Collect uploaded files from input element
      const fileInput = document.getElementById("image-upload") as HTMLInputElement | null;
      const files = fileInput?.files ? Array.from(fileInput.files) : [];

      if (isEditMode && id) {
        await updateListing(id, request, files);
        alert("Listing updated successfully!");
      } else {
        await createListing(request, files);
        alert("Listing published successfully!");
      }
      navigate("/vendor/listings");
    } catch (error) {
      console.error(error);
      alert(`Failed to ${isEditMode ? "update" : "publish"} listing.`);
    }
  };

  const renderCategoryFields = () => {
    switch (selectedCategory) {
      case "Hotel":
        return (
          <HotelFields register={register} control={control} errors={errors} />
        );
      case "Restaurant":
        return (
          <RestaurantFields
            register={register}
            control={control}
            errors={errors}
          />
        );
      case "Activity":
        return (
          <ActivityFields
            register={register}
            control={control}
            errors={errors}
          />
        );
      case "Event":
        return (
          <EventFields register={register} control={control} errors={errors} />
        );
      case "CarRental":
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
            <BaseFields
              register={register}
              control={control}
              errors={errors}
              categories={categories}
            />

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
