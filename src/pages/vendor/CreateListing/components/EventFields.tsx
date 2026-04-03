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
import {
  type UseFormRegister,
  type Control,
  useFieldArray,
} from "react-hook-form";

interface EventFieldsProps {
  register: UseFormRegister<any>;
  control: Control<any>;
  errors: any;
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
          label="Event Type"
          placeholder="e.g., Concert, Workshop"
          {...register("eventType", { required: "Event type is required" })}
          error={!!errors.eventType}
          helperText={errors.eventType?.message}
        />
        <TextField
          fullWidth
          label="Venue Name"
          placeholder="e.g., Madison Square Garden"
          {...register("venueName", { required: "Venue name is required" })}
          error={!!errors.venueName}
          helperText={errors.venueName?.message}
        />
        <TextField
          fullWidth
          type="date"
          label="Event Date"
          InputLabelProps={{ shrink: true }}
          {...register("eventDate", { required: true })}
        />
        <TextField
          fullWidth
          type="time"
          label="Event Time"
          InputLabelProps={{ shrink: true }}
          {...register("eventTime", { required: true })}
        />
      </Box>

      <TextField
        fullWidth
        label="Venue Address"
        sx={{ mb: 4 }}
        {...register("venueAddress", { required: true })}
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
            {fields.map((field: any, index: number) => (
              <TableRow key={field.id}>
                <TableCell>
                  <TextField
                    size="small"
                    fullWidth
                    variant="standard"
                    {...register(`ticketTypes.${index}.type`)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    fullWidth
                    variant="standard"
                    {...register(`ticketTypes.${index}.quantity`)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    fullWidth
                    variant="standard"
                    {...register(`ticketTypes.${index}.price`)}
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
