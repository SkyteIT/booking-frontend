import { Typography,Card,CardContent,Box,Stack,Pagination } from "@mui/material";
import { alpha } from "@mui/material/styles";
import VendorDetailsDialog from "../../../components/Admin/VendorManagement/VendorDetailDialog";
import VendorManagementHeader from "../../../components/Admin/VendorManagement/VendorManagementHeader";
import VendorManagementTabs from "../../../components/Admin/VendorManagement/VendorManagementTabs";
import VendorManagementToolbar from "../../../components/Admin/VendorManagement/VendorManagementToolbar";
import VendorTable from "../../../components/Admin/VendorManagement/VendorTable";
import SnackbarAlert from "../../../components/common/SnackbarAlert";
import { useVendorManagement } from "./useVendorManagement";

export default function VendorManagement() {
  const {
    activeTab,
    setActiveTab,
    vendors,
    loading,
    search,
    setSearch,
    sortOptions,
    setSortOptions,
    page,
    setPage,
    pageSize,
    setPageSize,
    pageCount,
    selectedStatusLabel,
    selectedVendor,
    setSelectedVendor,
    loadingDetails,
    rejectMode,
    rejectionReason,
    setRejectionReason,
    setRejectMode,
    snackbar,
    setSnackbar,
    handleRowClick,
    handleAction,
    handleReject,
  } = useVendorManagement();

  return (
    <>
      <Stack spacing={3}>
        <VendorManagementHeader />

        <Card
          sx={(theme) => ({
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            boxShadow: `0 8px 20px ${alpha(theme.palette.common.black, 0.05)}`,
          })}
        >
          <CardContent sx={{ p: 2.5 }}>
            <VendorManagementTabs
              value={activeTab}
              onChange={setActiveTab}
            />

            <VendorManagementToolbar
              search={search}
              onSearchChange={setSearch}
              sortOptions={sortOptions}
              onSortChange={setSortOptions}
              selectedStatusLabel={selectedStatusLabel}
            />

            <Box
              sx={{
                mt: 2,
                overflowX: "auto",
                borderTop: "1px solid",
                borderColor: "divider",
                pt: 2,
              }}
            >
              {loading ? (
                <Typography color="text.secondary">
                  Loading vendor applications...
                </Typography>
              ) : vendors.length === 0 ? (
                <Typography color="text.secondary">
                  No vendor applications found for the selected filters.
                </Typography>
              ) : (
                <VendorTable
                  rows={vendors}
                  onRowClick={handleRowClick}
                />
              )}
            </Box>

            <Box
              sx={{
                mt: 3,
                display: "flex",
                justifyContent: "center",
              }}
            >
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
                    color: "text.secondary",
                  },
                  "& .MuiPaginationItem-root.Mui-selected": {
                    bgcolor: (t) => alpha(t.palette.primary.main, 0.12),
                    color: "primary.main",
                    fontWeight: 500,
                  },
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </Stack>

      {/* 🔹 DIALOG */}
      {selectedVendor && (
        <VendorDetailsDialog
          open={Boolean(selectedVendor)}
          vendor={selectedVendor}
          loading={loadingDetails}

          rejectMode={rejectMode}
          rejectionReason={rejectionReason}
          onReasonChange={setRejectionReason}
          onRejectSubmit={handleReject}
          onCancelReject={() => setRejectMode(false)}

          onClose={() => setSelectedVendor(null)}
          onApprove={() => handleAction("Approved")}
          onReject={() => handleAction("Rejected")}
        />
      )}

      {/* 🔹 SNACKBAR */}
      <SnackbarAlert
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() =>
          setSnackbar((prev) => ({ ...prev, open: false }))
        }
      />
    </>
  );
}