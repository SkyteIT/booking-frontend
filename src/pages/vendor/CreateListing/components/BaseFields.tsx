// src/pages/vendor/CreateListing/components/BaseFields.tsx
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
} from "@mui/material";
import { Controller } from "react-hook-form";
import type { UseFormRegister, Control, FieldErrors } from "react-hook-form";
import type { ListingFormData } from "../../../../utils/types";

interface BaseFieldsProps {
  register: UseFormRegister<ListingFormData>;
  control: Control<ListingFormData>;
  errors: FieldErrors<ListingFormData>;
}

const categories = [
  "Hotels",
  "Restaurants",
  "Activities",
  "Events",
  "Car Rentals",
] as const;

const BaseFields = ({ register, control, errors }: BaseFieldsProps) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <TextField
        fullWidth
        label="Listing Title"
        placeholder="e.g., Luxury Beachfront Hotel"
        {...register("title", { required: "Title is required" })}
        error={!!errors.title}
        helperText={errors.title?.message}
      />

      <TextField
        fullWidth
        label="Location"
        placeholder="e.g., Miami Beach, FL"
        {...register("location", { required: "Location is required" })}
        error={!!errors.location}
        helperText={errors.location?.message}
      />

      <FormControl fullWidth error={!!errors.category}>
        <InputLabel id="category-label">Category</InputLabel>
        <Controller
          name="category"
          control={control}
          rules={{ required: "Category is required" }}
          render={({ field }) => (
            <Select labelId="category-label" label="Category" {...field}>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          )}
        />
        {errors.category?.message && (
          <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
            {errors.category.message}
          </Typography>
        )}
      </FormControl>

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          Listing Images
        </Typography>

        <Box
          sx={{
            border: "2px dashed",
            borderColor: "divider",
            borderRadius: "12px",
            p: 4,
            textAlign: "center",
            cursor: "pointer",
            "&:hover": {
              borderColor: "primary.main",
              backgroundColor: "action.hover",
            },
          }}
        >
          {/* keep your icon as-is if you have it */}
          <Typography variant="body2" color="text.secondary">
            Click or drag images to upload (0/10)
          </Typography>

          <input
            type="file"
            multiple
            hidden
            accept="image/*"
            {...register("images")}
          />
        </Box>

        {errors.images && (
          <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
            {errors.images.message}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default BaseFields;
