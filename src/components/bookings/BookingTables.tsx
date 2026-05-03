import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import StatusChip from "../vendor/dashboard/StatusChip";
import type { VendorBookingDto } from "./BookingTypes";

type Props = {
  rows: VendorBookingDto[];
  emptyText?: string;
  showEmail?: boolean;
  onRowClick?: (id: string) => void;
};

function formatDateRange(startIso: string, endIso: string) {
  const s = new Date(startIso);
  const e = new Date(endIso);
  return `${s.toLocaleDateString()} - ${e.toLocaleDateString()}`;
}

function formatMoney(currency: string, amount: number) {
  return `${currency} ${amount.toLocaleString()}`;
}

export default function BookingsTable({
  rows,
  emptyText = "No bookings found.",
  onRowClick,
}: Props) {
  return (
    <Box sx={{ overflowX: "auto" }}>
      <Table size="small" sx={{ minWidth: 950 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: "text.secondary", fontWeight: 700 }}>
              Booking ID
            </TableCell>
            <TableCell sx={{ color: "text.secondary", fontWeight: 700 }}>
              Listing
            </TableCell>
            <TableCell sx={{ color: "text.secondary", fontWeight: 700 }}>
              Customer
            </TableCell>
            <TableCell sx={{ color: "text.secondary", fontWeight: 700 }}>
              Dates
            </TableCell>
            <TableCell sx={{ color: "text.secondary", fontWeight: 700 }}>
              Status
            </TableCell>
            <TableCell
              sx={{ color: "text.secondary", fontWeight: 700 }}
              align="right"
            >
              Amount
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
  {rows.map((r) => (
    <TableRow 
      key={r.bookingId} 
      hover
      onClick={() => onRowClick?.(r.bookingId)}
      sx ={{ "& td":{
        py: 2},cursor: onRowClick ? "pointer" : "default" }}
      >
      
      {/* Booking ID */}
      <TableCell sx={{ color: "primary.main", fontWeight: 800 }}>
        {(r.bookingNumber ?? "").toUpperCase()}
      </TableCell>

      {/* Listing */}
      <TableCell>
        <Typography sx={{ fontWeight: 700 }}>
          {r.listingTitle}
        </Typography>
      </TableCell>

      {/* Customer */}
      <TableCell>
        <Typography sx={{ fontWeight: 600 }}>
          {r.customerName}
        </Typography>
      </TableCell>

      {/* Dates */}
      <TableCell>
        {formatDateRange(r.startDateTime, r.endDateTime)}
      </TableCell>

      {/* Status */}
      <TableCell>
        <StatusChip
          label={r.status}
          category={r.status}
        />
      </TableCell>

      {/* Amount */}
      <TableCell align="right" sx={{ fontWeight: 800 }}>
        {formatMoney(r.currency, r.totalAmount)}
      </TableCell>

    </TableRow>
  ))}

  {rows.length === 0 && (
    <TableRow>
      <TableCell colSpan={6} sx={{ textAlign: "center", py: 4 }}>
        {emptyText}
      </TableCell>
    </TableRow>
  )}
</TableBody>
      </Table>
    </Box>
  );
}