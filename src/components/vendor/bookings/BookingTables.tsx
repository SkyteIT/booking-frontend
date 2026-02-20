import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import StatusChip from "../dashboard/StatusChip";
import type { VendorBookingDto } from "./BookingTypes";

type Props = {
  rows: VendorBookingDto[];
  emptyText?: string;
  showEmail?: boolean;
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
  showEmail = true,
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
            <TableRow key={r.bookingId} hover>
              <TableCell sx={{ color: "primary.main", fontWeight: 800 }}>
                {r.bookingId.slice(0, 4).toLocaleUpperCase()}
              </TableCell>

              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {r.listingTitle}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {r.listingId.slice(0, 4).toLocaleUpperCase()}
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {r.customerName}
                </Typography>

                {showEmail ? (
                  <Typography variant="caption" color="text.secondary">
                    {r.customerEmail}
                  </Typography>
                ) : null}
              </TableCell>

              <TableCell>
                {formatDateRange(r.startDateTime, r.endDateTime)}
              </TableCell>

              <TableCell>
                <StatusChip label={r.statusLabel} category={r.statusCategory} />
              </TableCell>

              <TableCell align="right" sx={{ fontWeight: 800 }}>
                {formatMoney(r.currency, r.totalAmount)}
              </TableCell>
            </TableRow>
          ))}

          {rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                sx={{ py: 4, textAlign: "center", color: "text.secondary" }}
              >
                {emptyText}
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </Box>
  );
}