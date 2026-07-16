import React, { useState } from 'react';
import {
  Box, Typography, Button, Paper, Tabs, Tab, TextField,
  IconButton, Chip, InputAdornment, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions,
  DialogContentText, Divider, Select, FormControl,
  InputLabel, MenuItem, Alert,
} from '@mui/material';
import { Search, FilterList, Visibility, Edit, Close, CheckCircle, FileDownload } from '@mui/icons-material';
import AdminLayout from '../../layouts/AdminLayout/AdminLayout';
import MainFooter from '../../components/footer/MainFooter';

interface Booking {
  id: string;
  date: string;
  customer: string;
  company: string;
  service: string;
  serviceType: string;
  category: string;
  checkIn: string;
  checkOut: string;
  amount: number;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
}

const initialBookings: Booking[] = [
  { id: 'BK-1234', date: 'Feb 18, 2024', customer: 'John Doe', company: 'Luxury Resorts Inc.', service: 'Deluxe Ocean View Room', serviceType: 'Hotels', category: 'Hotels', checkIn: 'Feb 25, 2024', checkOut: 'Feb 28, 2024', amount: 1200, status: 'Confirmed' },
  { id: 'BK-1235', date: 'Feb 17, 2024', customer: 'Sarah Smith', company: 'City Car Rentals', service: 'Tesla Model 3', serviceType: 'Car Rentals', category: 'Car Rentals', checkIn: 'Feb 20, 2024', checkOut: 'Feb 23, 2024', amount: 450, status: 'Pending' },
  { id: 'BK-1236', date: 'Feb 15, 2024', customer: 'Mike Johnson', company: 'Adventure Tours', service: 'Safari Experience', serviceType: 'Activities', category: 'Activities', checkIn: 'Mar 05, 2024', checkOut: 'Mar 07, 2024', amount: 890, status: 'Confirmed' },
  { id: 'BK-1237', date: 'Feb 15, 2024', customer: 'Emma Davis', company: 'Beach Hotels', service: 'Standard Room', serviceType: 'Hotels', category: 'Hotels', checkIn: 'Feb 22, 2024', checkOut: 'Feb 24, 2024', amount: 340, status: 'Cancelled' },
];

export const BookingOversightPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Booking>>({});

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'Confirmed').length,
    pending: bookings.filter(b => b.status === 'Pending').length,
    cancelled: bookings.filter(b => b.status === 'Cancelled').length,
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesTab =
      activeTab === 0 ||
      (activeTab === 1 && booking.status === 'Confirmed') ||
      (activeTab === 2 && booking.status === 'Pending') ||
      (activeTab === 3 && booking.status === 'Cancelled');
    const matchesSearch =
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.service.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleView = (booking: Booking) => {
    setSelectedBooking(booking);
    setViewOpen(true);
  };

  const handleEditOpen = (booking: Booking) => {
    setSelectedBooking(booking);
    setEditForm({ ...booking });
    setEditOpen(true);
  };

  const handleEditSave = () => {
    if (!selectedBooking) return;
    setBookings(bookings.map(b => b.id === selectedBooking.id ? { ...b, ...editForm } as Booking : b));
    setEditOpen(false);
    showSuccess('Booking updated successfully');
  };

  const handleCancelOpen = (booking: Booking) => {
    setSelectedBooking(booking);
    setCancelOpen(true);
  };

  const handleCancelConfirm = () => {
    if (!selectedBooking) return;
    setBookings(bookings.map(b => b.id === selectedBooking.id ? { ...b, status: 'Cancelled' } : b));
    setCancelOpen(false);
    showSuccess(`Booking ${selectedBooking.id} has been cancelled`);
  };

  const handleExport = () => {
    const csv = [
      ['Booking ID', 'Customer', 'Service', 'Check-in', 'Check-out', 'Amount', 'Status'],
      ...bookings.map(b => [b.id, b.customer, b.service, b.checkIn, b.checkOut, `$${b.amount}`, b.status])
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bookings.csv';
    a.click();
    showSuccess('Bookings exported successfully');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return { bg: '#D1FAE5', color: '#059669' };
      case 'Pending': return { bg: '#FEF3C7', color: '#D97706' };
      case 'Cancelled': return { bg: '#FEE2E2', color: '#DC2626' };
      default: return { bg: '#E5E7EB', color: '#6B7280' };
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Hotels': return { bg: '#DBEAFE', color: '#1D4ED8' };
      case 'Car Rentals': return { bg: '#FECACA', color: '#DC2626' };
      case 'Activities': return { bg: '#E0E7FF', color: '#6366F1' };
      default: return { bg: '#E5E7EB', color: '#6B7280' };
    }
  };

  return (
    <AdminLayout>
      <Box sx={{ p: 3, minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>

        {successMsg && (
          <Alert icon={<CheckCircle />} severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>Booking Oversight</Typography>
            <Typography variant="body2" color="text.secondary">View, modify, and manage all platform bookings</Typography>
          </Box>
          <Button variant="contained" startIcon={<FileDownload />} onClick={handleExport}
            sx={{ bgcolor: '#0891B2', '&:hover': { bgcolor: '#0E7490' }, textTransform: 'none', px: 3 }}>
            Export Bookings
          </Button>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' }, gap: 2, mb: 3 }}>
          {[
            { label: 'Total Bookings', value: stats.total, color: '#0891B2' },
            { label: 'Confirmed', value: stats.confirmed, color: '#059669' },
            { label: 'Pending', value: stats.pending, color: '#D97706' },
            { label: 'Cancelled', value: stats.cancelled, color: '#DC2626' },
          ].map((stat) => (
            <Paper key={stat.label} sx={{ p: 2.5 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>{stat.label}</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color }}>{stat.value}</Typography>
            </Paper>
          ))}
        </Box>

        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <Tabs value={activeTab} onChange={(_, val) => setActiveTab(val)}>
              {['All', 'Confirmed', 'Pending', 'Cancelled'].map((label) => (
                <Tab key={label} label={label} sx={{ textTransform: 'none', fontWeight: 500 }} />
              ))}
            </Tabs>
            <Box sx={{ flex: 1, minWidth: 250 }}>
              <TextField fullWidth size="small" placeholder="Search bookings..."
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: '#94A3B8' }} /></InputAdornment> }}
              />
            </Box>
            <Button variant="outlined" startIcon={<FilterList />} sx={{ textTransform: 'none', borderColor: '#E2E8F0', color: '#64748B' }}>
              More Filters
            </Button>
          </Box>
        </Paper>

        <Box sx={{ flex: 1 }}>
          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                    {['Booking ID', 'Customer', 'Service', 'Dates', 'Amount', 'Status', 'Actions'].map(col => (
                      <TableCell key={col} sx={{ fontWeight: 600 }}>{col}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredBookings.map((booking) => {
                    const statusStyle = getStatusColor(booking.status);
                    const categoryStyle = getCategoryColor(booking.category);
                    return (
                      <TableRow key={booking.id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{booking.id}</Typography>
                          <Typography variant="caption" color="text.secondary">{booking.date}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>{booking.customer}</Typography>
                          <Typography variant="caption" color="text.secondary">{booking.company}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>{booking.service}</Typography>
                          <Chip label={booking.serviceType} size="small" sx={{ bgcolor: categoryStyle.bg, color: categoryStyle.color, fontWeight: 600, fontSize: '0.688rem', height: 20 }} />
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" sx={{ display: 'block' }}>Check-in: {booking.checkIn}</Typography>
                          <Typography variant="caption" sx={{ display: 'block' }}>Check-out: {booking.checkOut}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1" sx={{ fontWeight: 700, color: '#0891B2' }}>${booking.amount}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={booking.status} sx={{ bgcolor: statusStyle.bg, color: statusStyle.color, fontWeight: 600, fontSize: '0.75rem' }} />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <IconButton size="small" sx={{ color: '#64748B' }} onClick={() => handleView(booking)} title="View">
                              <Visibility fontSize="small" />
                            </IconButton>
                            <IconButton size="small" sx={{ color: '#64748B' }} onClick={() => handleEditOpen(booking)} title="Edit">
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
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>

        {/* View Dialog */}
        <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Booking Details
            <IconButton onClick={() => setViewOpen(false)}><Close /></IconButton>
          </DialogTitle>
          <DialogContent>
            {selectedBooking && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#0891B2' }}>{selectedBooking.id}</Typography>
                  <Chip label={selectedBooking.status} sx={{ ...getStatusColor(selectedBooking.status), fontWeight: 600 }} />
                </Box>
                <Divider sx={{ mb: 2 }} />
                {[
                  { label: 'Customer', value: selectedBooking.customer },
                  { label: 'Company', value: selectedBooking.company },
                  { label: 'Service', value: selectedBooking.service },
                  { label: 'Category', value: selectedBooking.category },
                  { label: 'Check-in', value: selectedBooking.checkIn },
                  { label: 'Check-out', value: selectedBooking.checkOut },
                  { label: 'Amount', value: `$${selectedBooking.amount}` },
                  { label: 'Booking Date', value: selectedBooking.date },
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
            <Button variant="contained" onClick={() => { setViewOpen(false); selectedBooking && handleEditOpen(selectedBooking); }}
              sx={{ textTransform: 'none', bgcolor: '#0891B2', '&:hover': { bgcolor: '#0E7490' } }}>
              Edit Booking
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Edit Booking
            <IconButton onClick={() => setEditOpen(false)}><Close /></IconButton>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField label="Customer Name" fullWidth value={editForm.customer || ''} onChange={(e) => setEditForm({ ...editForm, customer: e.target.value })} />
              <TextField label="Service" fullWidth value={editForm.service || ''} onChange={(e) => setEditForm({ ...editForm, service: e.target.value })} />
              <TextField label="Check-in Date" fullWidth value={editForm.checkIn || ''} onChange={(e) => setEditForm({ ...editForm, checkIn: e.target.value })} />
              <TextField label="Check-out Date" fullWidth value={editForm.checkOut || ''} onChange={(e) => setEditForm({ ...editForm, checkOut: e.target.value })} />
              <TextField label="Amount ($)" type="number" fullWidth value={editForm.amount || ''} onChange={(e) => setEditForm({ ...editForm, amount: Number(e.target.value) })} />
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select label="Status" value={editForm.status || ''} onChange={(e) => setEditForm({ ...editForm, status: e.target.value as Booking['status'] })}>
                  <MenuItem value="Confirmed">Confirmed</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditOpen(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
            <Button variant="contained" onClick={handleEditSave}
              sx={{ textTransform: 'none', bgcolor: '#0891B2', '&:hover': { bgcolor: '#0E7490' } }}>
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>

        {/* Cancel Confirm Dialog */}
        <Dialog open={cancelOpen} onClose={() => setCancelOpen(false)}>
          <DialogTitle>Cancel Booking</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to cancel booking <strong>{selectedBooking?.id}</strong> for {selectedBooking?.customer}? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCancelOpen(false)} sx={{ textTransform: 'none' }}>Keep Booking</Button>
            <Button variant="contained" onClick={handleCancelConfirm}
              sx={{ textTransform: 'none', bgcolor: '#EF4444', '&:hover': { bgcolor: '#DC2626' } }}>
              Cancel Booking
            </Button>
          </DialogActions>
        </Dialog>

      </Box>
      <MainFooter />
    </AdminLayout>
  );
};