import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Divider,
  TextField,
  Box,
  Chip,
} from "@mui/material";
import { resolveAssetUrl } from "../../../pages/Vendor/Settings/vendorSettings";
import LoadingSpinner from "../../common/LoadingSpinner";
import type { VendorApplicationDetail } from "../../../services/Admin/vendor";

type Props = {
  open: boolean;
  vendor: VendorApplicationDetail | null;
  loading: boolean;

  rejectMode?: boolean;
  rejectionReason?: string;
  onReasonChange?: (reason: string) => void;
  onRejectSubmit?: (reason: string) => void;
  onCancelReject?: () => void;

  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
};

export default function VendorDetailsDialog({
  open,
  vendor,
  loading,

  rejectMode,
  rejectionReason,
  onReasonChange,
  onRejectSubmit,
  onCancelReject,
  onClose,
  onApprove,
  onReject,
}: Props) {
  const status = String(vendor?.status ?? "").toLowerCase();
  const isReviewable =
    status.includes("pending") ||
    status.includes("submitted") ||
    status.includes("review");
  const statusLabel = isReviewable
    ? "Pending review"
    : vendor?.status ?? "";

  const fieldRow = (label: string, value: React.ReactNode) => (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "160px 1fr" },
        gap: 1,
      }}
    >
      <Typography sx={{ fontSize: "0.8rem", color: "text.secondary", fontWeight: 600 }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: "0.9rem", fontWeight: 500 }}>
        {value}
      </Typography>
    </Box>
  );

  const sectionTitle = (text: string) => (
    <Typography
      sx={{
        fontSize: "0.72rem",
        fontWeight: 700,
        letterSpacing: "0.6px",
        textTransform: "uppercase",
        color: "text.secondary",
      }}
    >
      {text}
    </Typography>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 4,
          bgcolor: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(14px)",
          border: "1px solid rgba(0,0,0,0.04)",
          boxShadow: "0 20px 60px rgba(15,23,42,0.12)",
        },
      }}
    >
      {/* HEADER */}
      <DialogTitle
        sx={{
          fontWeight: 700,
          fontSize: "1.2rem",
          pb: 1.5,
        }}
      >
        Vendor Application
      </DialogTitle>

      {/* CONTENT */}
      <DialogContent sx={{ px: 3, py: 2.5 }}>
        {loading ? (
          <LoadingSpinner fullScreen={false} py={4} />
        ) : vendor ? (
          <Stack spacing={3}>
            {/* TOP INFO */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography sx={{ fontWeight: 700 }}>
                  {vendor.firstName} {vendor.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {vendor.businessName}
                </Typography>
              </Box>

              <Chip
                label={statusLabel}
                size="small"
                sx={{
                  fontWeight: 600,
                  textTransform: "capitalize",
                  bgcolor:
                    status === "approved"
                      ? "rgba(34,197,94,0.1)"
                      : status === "rejected"
                      ? "rgba(239,68,68,0.1)"
                      : "rgba(234,179,8,0.12)",
                  color:
                    status === "approved"
                      ? "success.dark"
                      : status === "rejected"
                      ? "error.dark"
                      : "warning.dark",
                }}
              />
            </Stack>

            <Divider />

            {/* BUSINESS */}
            <Stack spacing={1}>
              {sectionTitle("Business Information")}
              {fieldRow("Name", vendor.businessName)}
              {fieldRow("Type", vendor.businessType)}
              {fieldRow("Address", vendor.address)}
            </Stack>

            <Divider />

            {/* CONTACT */}
            <Stack spacing={1}>
              {sectionTitle("Contact Details")}
              {fieldRow("Contact Person", `${vendor.firstName} ${vendor.lastName}`)}
              {fieldRow("Phone", vendor.phone)}
            </Stack>

            <Divider />

            {/* DESCRIPTION */}
            <Stack spacing={1}>
              {sectionTitle("Description")}
              <Typography sx={{ fontSize: "0.9rem", lineHeight: 1.6 }}>
                {vendor.description}
              </Typography>
            </Stack>

            <Divider />

            {/* DOCUMENTS */}
            <Stack spacing={1}>
              {sectionTitle("Documents")}
              <Stack spacing={0.5}>
                {[
                  { label: "Business License", url: resolveAssetUrl(vendor.businessLicensePath) },
                  { label: "Insurance Certificate", url: resolveAssetUrl(vendor.insuranceCertificatePath) },
                  { label: "Tax Document", url: resolveAssetUrl(vendor.taxDocumentPath) },
                ].map((doc) => (
                  <Box
                    key={doc.label}
                    component="a"
                    href={doc.url}
                    target="_blank"
                    rel="noreferrer"
                    sx={{
                      color: "primary.main",
                      fontWeight: 600,
                      textDecoration: "none",
                      fontSize: "0.9rem",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    {doc.label}
                  </Box>
                ))}
              </Stack>
            </Stack>

            <Divider />

            {/* DATE */}
            <Stack spacing={0.5}>
              <Typography variant="caption" color="text.secondary">
                Submitted: {new Date(vendor.submittedAt).toLocaleString()}
              </Typography>

              {vendor.reviewedAt && (
                <Typography variant="caption" color="text.secondary">
                  Reviewed: {new Date(vendor.reviewedAt).toLocaleString()}
                </Typography>
              )}
            </Stack>

            {/* REJECT INPUT */}
            {rejectMode && (
              <Stack spacing={1}>
                {sectionTitle("Rejection Reason")}
                <TextField
                  multiline
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => onReasonChange?.(e.target.value)}
                  placeholder="Enter rejection reason..."
                  fullWidth
                />
              </Stack>
            )}
          </Stack>
        ) : null}
      </DialogContent>

      {/* ACTIONS */}
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: "1px solid rgba(0,0,0,0.04)",
        }}
      >
        {isReviewable && !rejectMode && (
          <>
            <Button
              variant="contained"
              onClick={onApprove}
              sx={{
                bgcolor: "primary.main",
                "&:hover": { bgcolor: "primary.dark" },
              }}
            >
              Approve
            </Button>

            <Button
              variant="outlined"
              onClick={onReject}
              sx={{
                borderColor: "primary.main",
                color: "primary.main",
                "&:hover": {
                  bgcolor: "rgba(25,118,210,0.05)",
                },
              }}
            >
              Reject
            </Button>
          </>
        )}

        {rejectMode && (
          <>
            <Button
              variant="contained"
              onClick={() => onRejectSubmit?.(rejectionReason || "")}
              sx={{
                bgcolor: "primary.main",
                "&:hover": { bgcolor: "primary.dark" },
              }}
            >
              Submit
            </Button>

            <Button onClick={onCancelReject}>Back</Button>
          </>
        )}

        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
