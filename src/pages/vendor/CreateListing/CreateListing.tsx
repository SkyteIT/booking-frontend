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
import { Link } from "react-router-dom";
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

const CreateListing = () => {
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

  const onSubmit = (data: ListingFormData) => {
    console.log("Form Data:", data);
    alert("Listing published successfully (check console)");
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
