import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Chip,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

type VendorRow = {
  id: string;
  userName: string;
  contactNumber: string;
  businessName: string;
  businessType: string;
  submittedAt: string | Date;
  status: string;
};

type Props = {
  rows: VendorRow[];
  emptyText?: string;
  onRowClick?: (id: string) => void;
};

export default function VendorApplicationsTable({
  rows,
  emptyText = "No applications found.",
  onRowClick,
}: Props) {
  return (
    <Box
      sx={{
        overflowX: "auto",

        // 🔥 container (IMPORTANT)
        borderRadius: 4,
        bgcolor: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(0,0,0,0.04)",
        boxShadow: "0 10px 30px rgba(15,23,42,0.05)",
      }}
    >
      <Table size="small" sx={{ minWidth: 900 }}>
        {/* 🔹 HEADER */}
        <TableHead>
          <TableRow
            sx={{
              bgcolor: "rgba(0,0,0,0.02)",
            }}
          >
            {["Vendor", "Phone", "Business", "Type", "Submitted", "Status"].map((h) => (
              <TableCell
                key={h}
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

        {/* 🔹 BODY */}
        <TableBody>
          {rows.map((r: VendorRow) => {
            const status = String(r.status).toLowerCase();

            return (
              <TableRow
                key={r.id}
                hover
                onClick={() => onRowClick?.(r.id)}
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
                {/* Vendor */}
                <TableCell>
                  <Typography sx={{ fontWeight: 700 }}>
                    {r.userName}
                  </Typography>
                </TableCell>

                {/* Phone */}
                <TableCell>
                  <Typography color="text.secondary">
                    {r.contactNumber}
                  </Typography>
                </TableCell>

                {/* Business */}
                <TableCell>
                  <Typography sx={{ fontWeight: 600 }}>
                    {r.businessName}
                  </Typography>
                </TableCell>

                {/* Type */}
                <TableCell>
                  <Typography color="text.secondary">
                    {r.businessType}
                  </Typography>
                </TableCell>

                {/* Submitted */}
                <TableCell>
                  {new Date(r.submittedAt).toLocaleDateString()}
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Chip
                    label={r.status}
                    size="small"
                    sx={(theme) => ({
                      fontWeight: 600,
                      textTransform: "capitalize",

                      // 🔥 system theme colors
                      bgcolor:
                        status === "approved"
                          ? alpha(theme.palette.success.main, 0.1)
                          : status === "rejected"
                          ? alpha(theme.palette.error.main, 0.1)
                          : alpha(theme.palette.warning.main, 0.1),

                      color:
                        status === "approved"
                          ? theme.palette.success.dark
                          : status === "rejected"
                          ? theme.palette.error.dark
                          : theme.palette.warning.dark,

                      border: "none",
                    })}
                  />
                </TableCell>
              </TableRow>
            );
          })}

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