// src/pages/Vendor/CreateListing/components/BaseFields.tsx
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Switch,
  FormControlLabel,
  Stack,
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
  "Hotel",
  "Restaurant",
  "Activity",
  "Event",
  "CarRental",
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

      <Stack direction="row" spacing={3}>
        <TextField
          fullWidth
          type="number"
          label="Base Price (LKR)"
          placeholder="e.g., 25000"
          {...register("price", { required: "Price is required" })}
          error={!!errors.price}
          helperText={errors.price?.message}
        />

        <FormControlLabel
          sx={{ minWidth: 220 }}
          control={
            <Controller
              name="isActive"
              control={control}
              defaultValue={true}
              render={({ field }) => (
                <Switch
                  checked={field.value ?? true}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              )}
            />
          }
          label="Active / Available for Booking"
        />
      </Stack>

      <TextField
        fullWidth
        multiline
        rows={3}
        label="Description"
        placeholder="Provide a detailed description of your listing..."
        {...register("description", { required: "Description is required" })}
        error={!!errors.description}
        helperText={errors.description?.message}
      />

      <TextField
        fullWidth
        label="Tags (comma separated)"
        placeholder="e.g., luxury, city, business"
        {...register("tagsInput")}
      />

      <TextField
        fullWidth
        label="Cancellation Policy"
        placeholder="e.g., Free cancellation within 24 hours"
        {...register("cancellationPolicy")}
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
            mb: 2,
            "&:hover": {
              borderColor: "primary.main",
              backgroundColor: "action.hover",
            },
          }}
          onClick={() => document.getElementById("image-upload")?.click()}
        >
          <Typography variant="body2" color="text.secondary">
            Click or drag images to upload (0/10)
          </Typography>

          <input
            id="image-upload"
            type="file"
            multiple
            hidden
            accept="image/*"
            {...register("images")}
          />
        </Box>

        <TextField
          fullWidth
          label="Image URLs (comma separated)"
          placeholder="e.g., https://example.com/image1.jpg, https://example.com/image2.jpg"
          {...register("imageUrls")}
          helperText="Or paste direct image links here"
        />

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
