import { Box, MenuItem, Switch, TextField, Typography } from "@mui/material";
import { Controller } from "react-hook-form";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import type { ListingFormData } from "../../../../utils/types";

interface BaseFieldsProps {
  register: UseFormRegister<ListingFormData>;
  control: Control<ListingFormData>;
  errors: FieldErrors<ListingFormData>;
}

const categoryOptions: ListingFormData["category"][] = [
  "Hotel",
  "Restaurant",
  "Activity",
  "Event",
  "CarRental",
];

export default function BaseFields({ register, control, errors }: BaseFieldsProps) {
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
      <TextField
        fullWidth
        label="Title"
        placeholder="Enter listing title"
        {...register("title", { required: "Title is required" })}
        error={!!errors.title}
        helperText={errors.title?.message}
      />

      <TextField
        fullWidth
        label="Location"
        placeholder="Enter location"
        {...register("location", { required: "Location is required" })}
        error={!!errors.location}
        helperText={errors.location?.message}
      />

      <TextField
        select
        fullWidth
        label="Category"
        {...register("category")}
      >
        {categoryOptions.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        type="number"
        label="Base Price"
        placeholder="Enter price"
        {...register("price", { valueAsNumber: true })}
        error={!!errors.price}
        helperText={errors.price?.message}
      />

      <Box sx={{ gridColumn: "1 / -1" }}>
        <TextField
          fullWidth
          multiline
          minRows={3}
          label="Description"
          placeholder="Enter listing description"
          {...register("description")}
        />
      </Box>

      <Box sx={{ gridColumn: "1 / -1" }}>
        <TextField
          fullWidth
          label="Image URLs"
          placeholder="Paste comma-separated image URLs"
          {...register("imageUrls")}
        />
      </Box>

      <Box sx={{ gridColumn: "1 / -1" }}>
        <TextField
          fullWidth
          label="Tags"
          placeholder="Comma-separated tags"
          {...register("tagsInput")}
        />
      </Box>

      <Box sx={{ gridColumn: "1 / -1" }}>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
          Listing Status
        </Typography>
        <Controller
          name="isActive"
          control={control}
          render={({ field }) => (
            <Switch
              checked={Boolean(field.value)}
              onChange={(event) => field.onChange(event.target.checked)}
            />
          )}
        />
      </Box>
    </Box>
  );
}
