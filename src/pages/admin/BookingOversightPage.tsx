import React, { useCallback, useEffect, useState } from 'react';
import {
  Box, Typography, Button, Paper, Tabs, Tab, TextField,
  IconButton, Chip, InputAdornment, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions,
  DialogContentText, Divider, Select, FormControl,
  InputLabel, MenuItem, Menu,
} from '@mui/material';
import { Search, FilterList, Visibility, Edit, Close, FileDownload } from '@mui/icons-material';
import {
  getAllBookings,
  updateBookingStatus,
  exportBookingsCsv,
  type AdminBookingDto,
} from '../../services/Admin/adminService';
import SnackbarAlert from '../../components/common/SnackbarAlert';

const TAB_STATUSES = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled', 'Rejected'] as const;

// Backend's update endpoint only accepts these — "Rejected" bookings can be
// viewed but the status can't be set back to Rejected via this dialog.
const EDITABLE_STATUSES = ['Pending', 'Confirmed', 'Completed', 'Cancelled'] as const;

export const BookingOversightPage: React.FC = () => {
  const [bookings, setBookings] = useState<AdminBookingDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<AdminBookingDto | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [editStatus, setEditStatus] = useState<string>('Pending');
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);

  const refreshDashboard = () => {
    window.dispatchEvent(new Event("admin-dashboard-refresh"));
  };

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await getAllBookings();
      setBookings(data);
    } catch {
      setErrorMsg('Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === 'Confirmed').length,
    pending: bookings.filter((b) => b.status === 'Pending').length,
    cancelled: bookings.filter((b) => b.status === 'Cancelled').length,
  };

  const categoryOptions = ['All', ...Array.from(new Set(bookings.map((b) => b.listingCategory)))];

  const filteredBookings = bookings.filter((booking) => {
    const tabStatus = TAB_STATUSES[activeTab];
    const matchesTab = tabStatus === 'All' || booking.status === tabStatus;
    const matchesSearch =
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.listingTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || booking.listingCategory === categoryFilter;
    return matchesTab && matchesSearch && matchesCategory;
  });

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleView = (booking: AdminBookingDto) => {
    setSelectedBooking(booking);
    setViewOpen(true);
  };

  const handleEditOpen = (booking: AdminBookingDto) => {
    setSelectedBooking(booking);
    setEditStatus(EDITABLE_STATUSES.includes(booking.status as typeof EDITABLE_STATUSES[number]) ? booking.status : 'Pending');
    setEditOpen(true);
  };

  const handleEditSave = async () => {
    if (!selectedBooking) return;
    setSaving(true);
    try {
      const updated = await updateBookingStatus(selectedBooking.id, editStatus as 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed');
      setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
      refreshDashboard();
      setEditOpen(false);
      showSuccess('Booking status updated successfully');
    } catch {
      setErrorMsg('Failed to update booking status.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelOpen = (booking: AdminBookingDto) => {
    setSelectedBooking(booking);
    setCancelOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!selectedBooking) return;
    setSaving(true);
    try {
      const updated = await updateBookingStatus(selectedBooking.id, 'Cancelled');
      setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
      refreshDashboard();
      setCancelOpen(false);
      showSuccess(`Booking ${selectedBooking.id} has been cancelled`);
    } catch {
      setErrorMsg('Failed to cancel booking.');
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await exportBookingsCsv();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bookings-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showSuccess('Bookings exported successfully');
    } catch {
      setErrorMsg('Failed to export bookings.');
    } finally {
      setExporting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return { bg: '#D1FAE5', color: '#059669' };
      case 'Completed': return { bg: '#DBEAFE', color: '#1D4ED8' };
      case 'Pending': return { bg: '#FEF3C7', color: '#D97706' };
      case 'Cancelled': return { bg: '#FEE2E2', color: '#DC2626' };
      case 'Rejected': return { bg: '#FEE2E2', color: '#991B1B' };
      default: return { bg: '#E5E7EB', color: '#6B7280' };
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <Box>
      <SnackbarAlert
        open={!!successMsg}
        onClose={() => setSuccessMsg('')}
        severity="success"
        message={successMsg}
      />
      <SnackbarAlert
        open={!!errorMsg}
        onClose={() => setErrorMsg('')}
        severity="error"
        message={errorMsg}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography
            variant="h5"
            sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, letterSpacing: "-0.01em" }}
          >
            Booking Oversight
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>View, modify, and manage all platform bookings</Typography>
        </Box>
        <Button variant="contained" startIcon={<FileDownload />} onClick={handleExport} disabled={exporting}
          sx={{
            background: 'linear-gradient(160deg, #005a8d, #0077b6)',
            '&:hover': { background: 'linear-gradient(160deg, #004a75, #005a8d)' },
            textTransform: 'none',
            px: 3,
            borderRadius: '999px',
          }}>
          {exporting ? 'Exporting...' : 'Export Bookings'}
        </Button>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' }, gap: 2, mb: 3 }}>
        {[
          { label: 'Total Bookings', value: stats.total, color: '#0077b6' },
          { label: 'Confirmed', value: stats.confirmed, color: '#059669' },
          { label: 'Pending', value: stats.pending, color: '#D97706' },
          { label: 'Cancelled', value: stats.cancelled, color: '#DC2626' },
        ].map((stat) => (
          <Paper
            key={stat.label}
            sx={{
              p: 2.5,
              borderRadius: 3,
              border: "1px solid rgba(15,27,45,0.06)",
              background: "linear-gradient(160deg, #FFFFFF 0%, #F0F8FE 100%)",
              boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>{stat.label}</Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color }}>{stat.value}</Typography>
          </Paper>
        ))}
      </Box>

      <Paper
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
          background: "linear-gradient(160deg, #FFFFFF 0%, #E3F1FC 100%)",
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Tabs value={activeTab} onChange={(_, val) => setActiveTab(val)}>
            {TAB_STATUSES.map((label) => (
              <Tab key={label} label={label} sx={{ textTransform: 'none', fontWeight: 500 }} />
            ))}
          </Tabs>
          <Box sx={{ flex: 1, minWidth: 250 }}>
            <TextField fullWidth size="small" placeholder="Search bookings..."
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: '#94A3B8' }} /></InputAdornment> }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '999px', bgcolor: '#fff' } }}
            />
          </Box>
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={(e) => setFilterAnchorEl(e.currentTarget)}
            sx={{ textTransform: 'none', borderColor: '#E2E8F0', color: '#64748B', borderRadius: '999px' }}
          >
            More Filters{categoryFilter !== 'All' ? ' (1)' : ''}
          </Button>
          <Menu anchorEl={filterAnchorEl} open={!!filterAnchorEl} onClose={() => setFilterAnchorEl(null)}>
            <Box sx={{ px: 2, py: 1.5, minWidth: 220 }}>
              <FormControl fullWidth size="small" sx={{ mb: categoryFilter !== 'All' ? 1.5 : 0 }}>
                <InputLabel>Category</InputLabel>
                <Select label="Category" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                  {categoryOptions.map((cat) => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              {categoryFilter !== 'All' && (
                <Button size="small" onClick={() => setCategoryFilter('All')} sx={{ textTransform: 'none' }}>
                  Clear filter
                </Button>
              )}
            </Box>
          </Menu>
        </Box>
      </Paper>

      <Box sx={{ flex: 1 }}>
        <Paper
          sx={{
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
            background: "linear-gradient(160deg, #FFFFFF 0%, #E3F1FC 100%)",
            overflow: "hidden",
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                  {['Booking', 'Customer', 'Service', 'Dates', 'Amount', 'Status', 'Actions'].map((col) => (
                    <TableCell key={col} sx={{ fontWeight: 600 }}>{col}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                        Loading bookings...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : filteredBookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                        No bookings found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBookings.map((booking) => {
                    const statusStyle = getStatusColor(booking.status);
                    return (
                      <TableRow key={booking.id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{booking.id.slice(0, 8)}</Typography>
                          <Typography variant="caption" color="text.secondary">{formatDate(booking.createdAt)}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>{booking.customerName}</Typography>
                          <Typography variant="caption" color="text.secondary">{booking.customerEmail}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>{booking.listingTitle}</Typography>
                          <Chip label={booking.listingCategory} size="small" sx={{ bgcolor: '#E0E7FF', color: '#6366F1', fontWeight: 600, fontSize: '0.688rem', height: 20 }} />
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" sx={{ display: 'block' }}>Start: {formatDate(booking.startDateTime)}</Typography>
                          <Typography variant="caption" sx={{ display: 'block' }}>End: {formatDate(booking.endDateTime)}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1" sx={{ fontWeight: 700, color: '#0077b6' }}>{booking.currency} {booking.totalAmount}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={booking.status} sx={{ bgcolor: statusStyle.bg, color: statusStyle.color, fontWeight: 600, fontSize: '0.75rem' }} />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <IconButton size="small" sx={{ color: '#64748B' }} onClick={() => handleView(booking)} title="View">
                              <Visibility fontSize="small" />
                            </IconButton>
                            <IconButton size="small" sx={{ color: '#64748B' }} onClick={() => handleEditOpen(booking)} title="Update status">
                              <Edit fontSize="small" />
                            </IconButton>
                            {booking.status !== 'Cancelled' && (
                              <IconButton size="small" sx={{ color: '#EF4444' }} onClick={() => handleCancelOpen(booking)} title="Cancel">
                                <Close fontSize="small" />
                              </IconButton>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      {/* View Dialog */}
      <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Booking Details
          <IconButton onClick={() => setViewOpen(false)}><Close /></IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#0077b6' }}>{selectedBooking.id.slice(0, 8)}</Typography>
                <Chip label={selectedBooking.status} sx={{ ...getStatusColor(selectedBooking.status), fontWeight: 600 }} />
              </Box>
              <Divider sx={{ mb: 2 }} />
              {[
                { label: 'Customer', value: selectedBooking.customerName },
                { label: 'Customer Email', value: selectedBooking.customerEmail },
                { label: 'Service', value: selectedBooking.listingTitle },
                { label: 'Category', value: selectedBooking.listingCategory },
                { label: 'Start', value: formatDate(selectedBooking.startDateTime) },
                { label: 'End', value: formatDate(selectedBooking.endDateTime) },
                { label: 'Amount', value: `${selectedBooking.currency} ${selectedBooking.totalAmount}` },
                { label: 'Booked On', value: formatDate(selectedBooking.createdAt) },
              ].map((item) => (
                <Box key={item.label} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid #F1F5F9' }}>
                  <Typography variant="body2" color="text.secondary">{item.label}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.value}</Typography>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewOpen(false)} sx={{ textTransform: 'none' }}>Close</Button>
          <Button variant="contained" onClick={() => { setViewOpen(false); if (selectedBooking) handleEditOpen(selectedBooking); }}
            sx={{
              textTransform: 'none',
              background: 'linear-gradient(160deg, #005a8d, #0077b6)',
              borderRadius: '999px',
              '&:hover': { background: 'linear-gradient(160deg, #004a75, #005a8d)' },
            }}>
            Update Status
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit (status-only — the backend has no endpoint to edit dates/amount/customer) */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Update Booking Status
          <IconButton onClick={() => setEditOpen(false)}><Close /></IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {selectedBooking?.id.slice(0, 8)} — {selectedBooking?.customerName}
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select label="Status" value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                {EDITABLE_STATUSES.map((s) => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button variant="contained" disabled={saving} onClick={handleEditSave}
            sx={{
              textTransform: 'none',
              background: 'linear-gradient(160deg, #005a8d, #0077b6)',
              borderRadius: '999px',
              '&:hover': { background: 'linear-gradient(160deg, #004a75, #005a8d)' },
            }}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Confirm Dialog */}
      <Dialog open={cancelOpen} onClose={() => setCancelOpen(false)} PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel booking <strong>{selectedBooking?.id.slice(0, 8)}</strong> for {selectedBooking?.customerName}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelOpen(false)} sx={{ textTransform: 'none' }}>Keep Booking</Button>
          <Button variant="contained" disabled={saving} onClick={handleCancelConfirm}
            sx={{ textTransform: 'none', bgcolor: '#EF4444', '&:hover': { bgcolor: '#DC2626' } }}>
            {saving ? 'Working...' : 'Cancel Booking'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
