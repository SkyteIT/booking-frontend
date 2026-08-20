import { Box, TextField, Typography } from "@mui/material";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import type { ListingFormData } from "../../../../utils/types";

interface ImagesStepProps {
  register: UseFormRegister<ListingFormData>;
  control: Control<ListingFormData>;
  errors: FieldErrors<ListingFormData>;
}

export default function ImagesStep({ register }: ImagesStepProps) {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Paste comma-separated image URLs. The first image is used as the
        cover photo.
      </Typography>
      <TextField
        fullWidth
        label="Image URLs"
        placeholder="https://example.com/photo1.jpg, https://example.com/photo2.jpg"
        {...register("imageUrls")}
      />
    </Box>
  );
}
