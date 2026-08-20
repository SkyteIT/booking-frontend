// src/pages/vendor/CreateListing/components/EventFields.tsx
import {
  Box,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useFieldArray } from "react-hook-form";
import type { UseFormRegister, Control, FieldErrors } from "react-hook-form";
import type { ListingFormData } from "../../../../utils/types";

interface EventFieldsProps {
  register: UseFormRegister<ListingFormData>;
  control: Control<ListingFormData>;
  errors: FieldErrors<ListingFormData>;
}

const EventFields = ({ register, control, errors }: EventFieldsProps) => {
  const { fields } = useFieldArray({
    control,
    name: "ticketTypes",
  });

  return (
    <Box sx={{ mt: 4 }}>
      <Typography
        variant="h6"
        sx={{ mb: 3, fontWeight: 700, color: "#0F5A8A" }}
      >
        Event Details
      </Typography>

      <Box
        sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, mb: 3 }}
      >
        <TextField
          fullWidth
          label="Organizer"
          placeholder="e.g., Acme Events"
          {...register("organizer", { required: "Organizer is required" })}
          error={!!errors.organizer}
          helperText={errors.organizer?.message}
        />
        <TextField
          fullWidth
          type="number"
          label="Total Seat Count"
          placeholder="e.g., 200"
          {...register("seatCount", {
            required: "Seat count is required",
            valueAsNumber: true,
            min: { value: 1, message: "Seat count must be greater than 0" },
          })}
          error={!!errors.seatCount}
          helperText={errors.seatCount?.message}
        />
        <TextField
          fullWidth
          label="Event Type"
          placeholder="e.g., Concert, Workshop"
          {...register("eventType")}
        />
        <TextField
          fullWidth
          label="Venue Name"
          placeholder="e.g., Madison Square Garden"
          {...register("venueName")}
        />
        <TextField
          fullWidth
          type="date"
          label="Event Date"
          InputLabelProps={{ shrink: true }}
          {...register("eventDate", { required: "Event date is required" })}
          error={!!errors.eventDate}
          helperText={errors.eventDate?.message}
        />
        <TextField
          fullWidth
          type="time"
          label="Event Time"
          InputLabelProps={{ shrink: true }}
          {...register("eventTime", { required: "Event time is required" })}
          error={!!errors.eventTime}
          helperText={errors.eventTime?.message}
        />
      </Box>

      <TextField
        fullWidth
        label="Venue Address"
        sx={{ mb: 4 }}
        {...register("venueAddress")}
      />

      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
        Ticket Types
      </Typography>

      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{ borderRadius: "12px" }}
      >
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#F8FAFC" }}>
              <TableCell sx={{ fontWeight: 600 }}>Ticket Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Quantity</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Price ($)</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {fields.map((field, index) => (
              <TableRow key={field.id}>
                <TableCell>
                  <TextField
                    size="small"
                    fullWidth
                    variant="standard"
                    {...register(`ticketTypes.${index}.type` as const)}
                  />
                </TableCell>

                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    fullWidth
                    variant="standard"
                    {...register(`ticketTypes.${index}.quantity` as const)}
                  />
                </TableCell>

                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    fullWidth
                    variant="standard"
                    {...register(`ticketTypes.${index}.price` as const)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default EventFields;
