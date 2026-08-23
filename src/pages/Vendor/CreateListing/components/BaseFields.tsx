import { Box, MenuItem, Switch, TextField, Typography } from "@mui/material";
import { Controller } from "react-hook-form";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import type { CategoryDto } from "../../../../services/Vendor/listingService";
import type { ListingFormData } from "../../../../utils/types";

interface BaseFieldsProps {
  register: UseFormRegister<ListingFormData>;
  control: Control<ListingFormData>;
  errors: FieldErrors<ListingFormData>;
  categories: CategoryDto[];
  selectedCategoryId?: string;
}

export default function BaseFields({
  register,
  control,
  errors,
  categories,
  selectedCategoryId,
}: BaseFieldsProps) {
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
        disabled={categories.length === 0}
        helperText={
          errors.categoryId?.message ??
          (categories.length === 0
            ? "No categories exist yet — ask an admin to create one before publishing."
            : "Determines which detail fields appear below")
        }
        error={!!errors.categoryId}
        value={selectedCategoryId ?? ""}
        {...register("categoryId", { required: "Select a category" })}
      >
        {categories.map((cat) => (
          <MenuItem key={cat.id} value={cat.id}>
            {cat.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        type="number"
        label="Base Price"
        placeholder="Enter price"
        {...register("price", {
          required: "Base price is required",
          valueAsNumber: true,
          min: { value: 1, message: "Base price must be greater than 0" },
        })}
        error={!!errors.price}
        helperText={errors.price?.message}
      />

      <TextField
        fullWidth
        label="Currency"
        placeholder="e.g. LKR, USD"
        helperText="Defaults to your Settings > Localization currency"
        {...register("currency", { required: "Currency is required" })}
        error={!!errors.currency}
      />

      <TextField
        select
        fullWidth
        label="Pricing model"
        helperText="How the base price applies when a customer picks a quantity/participant count"
        defaultValue=""
        {...register("pricingUnitOverride")}
      >
        <MenuItem value="">Use category default</MenuItem>
        <MenuItem value="FixedPrice">
          Flat price for this booking (e.g. a package, regardless of headcount)
        </MenuItem>
        <MenuItem value="PerPerson">Price per person/unit (multiplies by quantity)</MenuItem>
      </TextField>

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
