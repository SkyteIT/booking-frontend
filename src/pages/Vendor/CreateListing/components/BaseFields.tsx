import { Box, MenuItem, Switch, TextField, Typography, FormControlLabel } from "@mui/material";
import { Controller } from "react-hook-form";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import type { CategoryDto } from "../../../../services/Vendor/listingService";
import type { ListingFormData } from "../../../../utils/types";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InfoIcon from "@mui/icons-material/Info";

interface BaseFieldsProps {
  register: UseFormRegister<ListingFormData>;
  control: Control<ListingFormData>;
  errors: FieldErrors<ListingFormData>;
  categories: CategoryDto[];
}

export default function BaseFields({ register, control, errors, categories }: BaseFieldsProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
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

        <TextField
          select
          fullWidth
          label="Category"
          disabled={categories.length === 0}
          helperText={
            errors.categoryId?.message ??
            (categories.length === 0
              ? "No categories exist yet — ask an admin to create one before publishing."
              : "Determines which detail fields appear below")
          }
          error={!!errors.categoryId}
          {...register("categoryId", { required: "Select a category" })}
        >
          {categories.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.name}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Box>
        <TextField
          fullWidth
          multiline
          minRows={3}
          label="Description"
          placeholder="Provide a detailed description of your listing..."
          {...register("description", { required: "Description is required" })}
          error={!!errors.description}
          helperText={errors.description?.message}
        />
      </Box>

      {/* Listing Images Upload Section */}
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: "text.primary" }}>
          Listing Images (Max 10 images)
        </Typography>

        <Box
          sx={{
            border: "2px dashed",
            borderColor: "divider",
            borderRadius: "12px",
            p: 4,
            textAlign: "center",
            cursor: "pointer",
            backgroundColor: "background.paper",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              borderColor: "#0F5A8A",
              backgroundColor: "action.hover",
            },
          }}
          onClick={() => document.getElementById("image-upload")?.click()}
        >
          <CloudUploadIcon sx={{ fontSize: 40, color: "text.secondary", mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            Click or drag images to upload (0/10)
          </Typography>

          <input
            id="image-upload"
            type="file"
            multiple
            hidden
            accept="image/*"
            {...register("images" as any)}
          />
        </Box>

        <Box
          sx={{
            mt: 2,
            p: 2,
            backgroundColor: "#F0F7FF",
            borderRadius: "8px",
            display: "flex",
            gap: 1.5,
            alignItems: "flex-start",
          }}
        >
          <InfoIcon sx={{ color: "#0077B6", fontSize: 20, mt: 0.2 }} />
          <Typography variant="caption" color="text.secondary">
            Minimum 1200×800px recommended. First image will be used as the cover photo.
            Supported formats: JPG, PNG, WebP. Maximum file size: 5MB per image.
          </Typography>
        </Box>

        <TextField
          fullWidth
          label="Image URLs (comma separated)"
          placeholder="e.g., https://example.com/image1.jpg, https://example.com/image2.jpg"
          sx={{ mt: 3 }}
          {...register("imageUrls")}
          helperText="Or paste direct image links here if you're not uploading files"
        />
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3, alignItems: "center" }}>
        <TextField
          fullWidth
          label="Tags"
          placeholder="Comma-separated tags (e.g. luxury, beach, pool)"
          {...register("tags")}
        />

        <Box sx={{ display: "flex", gap: 3 }}>
          <FormControlLabel
            control={
              <Controller
                name="isActive"
                control={control}
                defaultValue={true}
                render={({ field }) => (
                  <Switch
                    checked={Boolean(field.value)}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                )}
              />
            }
            label="Active (visible to search)"
          />

          <FormControlLabel
            control={
              <Controller
                name="isAvailable"
                control={control}
                defaultValue={true}
                render={({ field }) => (
                  <Switch
                    checked={Boolean(field.value)}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                )}
              />
            }
            label="Available for Booking"
          />
        </Box>
      </Box>
    </Box>
  );
}

