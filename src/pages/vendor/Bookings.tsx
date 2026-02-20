import { Box, Card, CardContent, Pagination, Stack, Typography } from "@mui/material";
import { useVendorBookings } from "../../hooks/useVendorBookings";
import BookingsTable from "../../components/vendor/bookings/BookingTables";
import { useMemo, useState, useEffect } from "react";
import BookingsStatusTabs, { type BookingStatusFilter } from "../../components/vendor/bookings/BookingStatusTabs";
import BookingsToolbar from "../../components/vendor/bookings/BookingToolbar";

export default function Bookings() {
  const vendorId = "11111111-1111-1111-1111-111111111111";
  const [statusFilter, setStatusFilter] = useState<BookingStatusFilter>("All");
  const [search, setSearch] = useState("");
  const { data, loading, error, page, setPage, pageCount } = useVendorBookings({
    vendorId,
    initialPageSize: 8,
  });
  
  useEffect(() => {
  // if current page is greater than the available pages, bring it back
  setPage((p) => Math.min(p, pageCount));
  }, [pageCount, setPage]);
  

  // If hook returns BookingRow[]
  const rows = data ?? [];

  //  hook returns PageResult<BookingRow>
  // const rows = data?.items ?? [];

  const filteredRows = useMemo(() => {
    if (statusFilter === "All") return rows;
    return rows.filter((r) => r.bookingStatus === statusFilter);
  }, [rows, statusFilter]);

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
        {/* Tabs row */}
        <BookingsStatusTabs value={statusFilter} onChange={setStatusFilter} />
        <BookingsToolbar
            search={search}
            onSearchChange={setSearch}
            onDateRangeClick={() => console.log("open date range")}
            onFiltersClick={() => console.log("open filters")}
        />

        <CardContent>
          {/* Error state */}
          {error ? (
            <Typography color="error" sx={{ py: 3 }}>
              {error}
            </Typography>
          ) : (
            <BookingsTable
              rows={loading ? [] : filteredRows}
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
                "& .MuiPaginationItem-root": { color: "#0077b6" },
                "& .Mui-selected": { background: "#0077b6",
                   color: "#fff" },
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
}