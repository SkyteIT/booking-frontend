import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";


import StatusChip from "../Vendor/Dashboard/StatusChip";
import type { VendorBookingDto } from "./BookingTypes";

type Props = {
  rows: VendorBookingDto[];
  emptyText?: string;
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
    <Box
      sx={{
        overflowX: "auto",

        // container
        borderRadius: 4,
        bgcolor: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(0,0,0,0.04)",
        boxShadow: "0 10px 30px rgba(15,23,42,0.05)",
      }}
    >
      <Table size="small" sx={{ minWidth: 950 }}>
        {/* HEADER */}
        <TableHead>
          <TableRow sx={{ bgcolor: "rgba(0,0,0,0.02)" }}>
            {[
              "Booking ID",
              "Listing",
              "Customer",
              "Dates",
              "Status",
              "Amount",
            ].map((h) => (
              <TableCell
                key={h}
                align={h === "Amount" ? "right" : "left"}
                sx={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  color: "text.secondary",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  borderBottom: "1px solid rgba(0,0,0,0.05)",
                }}
              >
                {h}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        {/* BODY */}
        <TableBody>
          {rows.map((r) => (
            <TableRow
              key={r.bookingId}
              hover
              onClick={() => onRowClick?.(r.bookingId)}
              sx={{
                cursor: onRowClick ? "pointer" : "default",
                transition: "all 0.2s ease",

                "& td": {
                  py: 2.2,
                  borderBottom: "1px solid rgba(0,0,0,0.04)",
                },

                "&:hover": {
                  bgcolor: "rgba(0,0,0,0.02)",
                  transform: "scale(1.002)",
                },
              }}
            >
              {/* Booking ID */}
              <TableCell sx={{ color: "primary.main", fontWeight: 700 }}>
                {(r.bookingNumber ?? "").toUpperCase()}
              </TableCell>

              {/* Listing */}
              <TableCell>
                <Typography sx={{ fontWeight: 600 }}>
                  {r.listingTitle}
                </Typography>
              </TableCell>

              {/* Customer */}
              <TableCell>
                <Typography sx={{ fontWeight: 500 }}>
                  {r.customerName}
                </Typography>
              </TableCell>

              {/* Dates */}
              <TableCell sx={{ color: "text.secondary" }}>
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
              <TableCell align="right" sx={{ fontWeight: 700 }}>
                {formatMoney(r.currency, r.totalAmount)}
              </TableCell>
            </TableRow>
          ))}

          {/* EMPTY */}
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} sx={{ textAlign: "center", py: 5 }}>
                <Typography color="text.secondary">
                  {emptyText}
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );
}