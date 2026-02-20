import { Box, Card, CardContent, Pagination, Stack, Typography } from "@mui/material";
import { useVendorBookings } from "../../hooks/useVendorBookings";
import BookingsTable from "../../components/vendor/bookings/BookingTables";

export default function Bookings() {
  //  For interim — later this comes from auth context
  const vendorId = "11111111-1111-1111-1111-111111111111";

  const {
    data,
    loading,
    error,
    page,
    setPage,
    pageCount,
  } = useVendorBookings({
    vendorId,
    initialPageSize: 8,
  });

  return (
    <Stack spacing={3}>
      {/* Page Header */}
      <Box>
        <Typography variant="h2" sx={{ fontWeight: 700 }}>
          Bookings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage and track all your bookings.
        </Typography>
      </Box>

      {/* Table Card */}
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          {/* Error state */}
          {error ? (
            <Typography color="error" sx={{ py: 3 }}>
              {error}
            </Typography>
          ) : (
            <BookingsTable
              rows={loading ? [] : data}
              emptyText={loading ? "Loading bookings..." : "No bookings found."}
            />
          )}

          {/* Pagination */}
          <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
            <Pagination
              count={pageCount}
              page={page}
              onChange={(_, value) => setPage(value)}
              siblingCount={1}
              boundaryCount={1}
              showFirstButton
              showLastButton
              sx={{
                "& .MuiPaginationItem-root": {
                  color: "#0077b6",
                },
                "& .Mui-selected": {
                  backgroundColor: "#0077B6",
                  color: "#fff",
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
}