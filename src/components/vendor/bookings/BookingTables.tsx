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

export type BookingStatus = "Confirmed" | "Pending" | "Cancelled";

export type BookingRow = {
  id: string;
  item: string;
  customer: {
    name: string;
    email?: string;
  };
  dates: string;      // e.g. "Feb 10, 2026 to Feb 12, 2026"
  location?: string;  // optional for dashboard
  status: BookingStatus;
  amount: string;
};

type Props = {
  rows: BookingRow[];
  emptyText?: string;
  showLocation?: boolean;
  showEmail?: boolean;
  showCustomerName?: boolean;
};

export default function BookingsTable({
  rows,
  emptyText = "No bookings found.",
  showLocation = true,
  showEmail = true,
}: Props) {
  return (
    <Box sx={{ overflowX: "auto" }}>
      <Table size="small" sx={{ minWidth: showLocation ? 950 : 750 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: "text.secondary", fontWeight: 700 }}>
              Booking ID
            </TableCell>
            <TableCell sx={{ color: "text.secondary", fontWeight: 700 }}>
              Item
            </TableCell>
            <TableCell sx={{ color: "text.secondary", fontWeight: 700 }}>
              Customer
            </TableCell>
            <TableCell sx={{ color: "text.secondary", fontWeight: 700 }}>
              Dates
            </TableCell>
            {showLocation ? (
              <TableCell sx={{ color: "text.secondary", fontWeight: 700 }}>
                Location
              </TableCell>
            ) : null}
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
            <TableRow key={r.id} hover>
              <TableCell sx={{ color: "primary.main", fontWeight: 800 }}>
                {r.id}
              </TableCell>
              <TableCell>{r.item}</TableCell>

              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {r.customer.name}
                </Typography>
                {r.customer.email && showEmail ? (
                  <Typography variant="caption" color="text.secondary">
                    {r.customer.email}
                  </Typography>
                ) : null}
              </TableCell>

              <TableCell>{r.dates}</TableCell>

              {showLocation ? <TableCell>{r.location ?? "—"}</TableCell> : null}

              <TableCell>
                <StatusChip status={r.status} />
              </TableCell>

              <TableCell align="right" sx={{ fontWeight: 800 }}>
                {r.amount}
              </TableCell>
            </TableRow>
          ))}

          {rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={showLocation ? 7 : 6}
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
