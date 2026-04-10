import React, { useState } from 'react';
import {
  Box, Typography, Paper, TextField, IconButton, Chip,
  InputAdornment, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, Menu, MenuItem, Dialog,
  DialogTitle, DialogContent, DialogActions, DialogContentText,
  Avatar, Divider, Select, FormControl, InputLabel, Alert,
} from '@mui/material';
import {
  Search, FilterList, Visibility, Block, MoreVert,
  Close, Edit, CheckCircle, Person,
} from '@mui/icons-material';
import { AdminLayout } from '../../layouts/AdminLayout/AdminLayout';
import MainFooter from '../../components/footer/MainFooter';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'Customer' | 'Vendor' | 'Admin';
  status: 'Active' | 'Inactive' | 'Suspended';
  joinDate: string;
  bookings: number;
  phone?: string;
  location?: string;
}

const initialUsers: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Customer', status: 'Active', joinDate: '2024-01-15', bookings: 12, phone: '+1 555-0101', location: 'New York, USA' },
  { id: 2, name: 'Sarah Smith', email: 'sarah@example.com', role: 'Customer', status: 'Active', joinDate: '2024-01-20', bookings: 8, phone: '+1 555-0102', location: 'Miami, USA' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Vendor', status: 'Active', joinDate: '2024-02-01', bookings: 145, phone: '+1 555-0103', location: 'Chicago, USA' },
  { id: 4, name: 'Emma Wilson', email: 'emma@example.com', role: 'Customer', status: 'Inactive', joinDate: '2024-01-10', bookings: 3, phone: '+1 555-0104', location: 'Los Angeles, USA' },
  { id: 5, name: 'David Brown', email: 'david@example.com', role: 'Vendor', status: 'Active', joinDate: '2024-01-25', bookings: 67, phone: '+1 555-0105', location: 'Houston, USA' },
];

export const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [editForm, setEditForm] = useState<Partial<User>>({});

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, user: User) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleView = (user: User) => {
    setSelectedUser(user);
    setViewOpen(true);
    handleMenuClose();
  };

  const handleEditOpen = (user: User) => {
    setSelectedUser(user);
    setEditForm({ ...user });
    setEditOpen(true);
    handleMenuClose();
  };

  const handleEditSave = () => {
    if (!selectedUser) return;
    setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...editForm } as User : u));
    setEditOpen(false);
    showSuccess('User updated successfully');
  };

  const handleBlock = (user: User) => {
    setSelectedUser(user);
    setBlockOpen(true);
    handleMenuClose();
  };

  const handleBlockConfirm = () => {
    if (!selectedUser) return;
    const newStatus = selectedUser.status === 'Suspended' ? 'Active' : 'Suspended';
    setUsers(users.map(u => u.id === selectedUser.id ? { ...u, status: newStatus } : u));
    setBlockOpen(false);
    showSuccess(`User ${newStatus === 'Suspended' ? 'suspended' : 'reactivated'} successfully`);
  };

  const handleSendMessage = () => {
    handleMenuClose();
    showSuccess(`Message sent to ${selectedUser?.name}`);
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Customer': return { bg: '#DBEAFE', color: '#1D4ED8' };
      case 'Vendor': return { bg: '#E0E7FF', color: '#6366F1' };
      case 'Admin': return { bg: '#FEE2E2', color: '#DC2626' };
      default: return { bg: '#E5E7EB', color: '#6B7280' };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return '#10B981';
      case 'Inactive': return '#6B7280';
      case 'Suspended': return '#DC2626';
      default: return '#6B7280';
    }
  };

  return (
    <AdminLayout>
      <Box sx={{ p: 3, minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>

        {successMsg && (
          <Alert icon={<CheckCircle />} severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>User Management</Typography>
          <Typography variant="body2" color="text.secondary">Manage all platform users and their activities</Typography>
        </Box>

        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              fullWidth size="small" placeholder="Search users..."
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: '#94A3B8' }} /></InputAdornment> }}
              sx={{ maxWidth: 400 }}
            />
            <Button variant="outlined" startIcon={<FilterList />} sx={{ textTransform: 'none', borderColor: '#E2E8F0', color: '#64748B' }}>
              Filters
            </Button>
          </Box>
        </Paper>

        <Box sx={{ flex: 1 }}>
          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                    <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Join Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Bookings</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => {
                    const roleStyle = getRoleColor(user.role);
                    return (
                      <TableRow key={user.id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>{user.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={user.role} size="small" sx={{ bgcolor: roleStyle.bg, color: roleStyle.color, fontWeight: 600, fontSize: '0.75rem' }} />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: getStatusColor(user.status) }} />
                            <Typography variant="body2" sx={{ color: getStatusColor(user.status), fontWeight: 600 }}>{user.status}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell><Typography variant="body2">{user.joinDate}</Typography></TableCell>
                        <TableCell><Typography variant="body2" sx={{ fontWeight: 600 }}>{user.bookings}</Typography></TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <IconButton size="small" sx={{ color: '#64748B' }} onClick={() => handleView(user)} title="View Details">
                              <Visibility fontSize="small" />
                            </IconButton>
                            <IconButton size="small" sx={{ color: user.status === 'Suspended' ? '#10B981' : '#EF4444' }} onClick={() => handleBlock(user)} title={user.status === 'Suspended' ? 'Unblock' : 'Block'}>
                              <Block fontSize="small" />
                            </IconButton>
                            <IconButton size="small" sx={{ color: '#64748B' }} onClick={(e) => handleMenuClick(e, user)}>
                              <MoreVert fontSize="small" />
                            </IconButton>
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

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={() => selectedUser && handleView(selectedUser)}>
            <Visibility fontSize="small" sx={{ mr: 1 }} /> View Details
          </MenuItem>
          <MenuItem onClick={() => selectedUser && handleEditOpen(selectedUser)}>
            <Edit fontSize="small" sx={{ mr: 1 }} /> Edit User
          </MenuItem>
          <MenuItem onClick={handleSendMessage}>
            <Person fontSize="small" sx={{ mr: 1 }} /> Send Message
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => selectedUser && handleBlock(selectedUser)} sx={{ color: '#EF4444' }}>
            <Block fontSize="small" sx={{ mr: 1 }} />
            {selectedUser?.status === 'Suspended' ? 'Reactivate User' : 'Suspend User'}
          </MenuItem>
        </Menu>

        {/* View Dialog */}
        <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            User Details
            <IconButton onClick={() => setViewOpen(false)}><Close /></IconButton>
          </DialogTitle>
          <DialogContent>
            {selectedUser && (
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Avatar sx={{ width: 64, height: 64, bgcolor: '#0891B2', fontSize: '1.5rem' }}>
                    {selectedUser.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{selectedUser.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{selectedUser.email}</Typography>
                  </Box>
                </Box>
                <Divider sx={{ mb: 2 }} />
                {[
                  { label: 'Role', value: selectedUser.role },
                  { label: 'Status', value: selectedUser.status },
                  { label: 'Join Date', value: selectedUser.joinDate },
                  { label: 'Total Bookings', value: selectedUser.bookings },
                  { label: 'Phone', value: selectedUser.phone || 'N/A' },
                  { label: 'Location', value: selectedUser.location || 'N/A' },
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
            <Button variant="contained" onClick={() => { setViewOpen(false); selectedUser && handleEditOpen(selectedUser); }}
              sx={{ textTransform: 'none', bgcolor: '#0891B2', '&:hover': { bgcolor: '#0E7490' } }}>
              Edit User
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Edit User
            <IconButton onClick={() => setEditOpen(false)}><Close /></IconButton>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField label="Name" fullWidth value={editForm.name || ''} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
              <TextField label="Email" fullWidth value={editForm.email || ''} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
              <TextField label="Phone" fullWidth value={editForm.phone || ''} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
              <TextField label="Location" fullWidth value={editForm.location || ''} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} />
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select label="Role" value={editForm.role || ''} onChange={(e) => setEditForm({ ...editForm, role: e.target.value as User['role'] })}>
                  <MenuItem value="Customer">Customer</MenuItem>
                  <MenuItem value="Vendor">Vendor</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select label="Status" value={editForm.status || ''} onChange={(e) => setEditForm({ ...editForm, status: e.target.value as User['status'] })}>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                  <MenuItem value="Suspended">Suspended</MenuItem>
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

        {/* Block Confirm Dialog */}
        <Dialog open={blockOpen} onClose={() => setBlockOpen(false)}>
          <DialogTitle>{selectedUser?.status === 'Suspended' ? 'Reactivate User' : 'Suspend User'}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {selectedUser?.status === 'Suspended'
                ? `Are you sure you want to reactivate ${selectedUser?.name}? They will regain access to the platform.`
                : `Are you sure you want to suspend ${selectedUser?.name}? They will lose access to the platform.`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setBlockOpen(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
            <Button variant="contained" onClick={handleBlockConfirm}
              sx={{ textTransform: 'none', bgcolor: selectedUser?.status === 'Suspended' ? '#10B981' : '#EF4444', '&:hover': { bgcolor: selectedUser?.status === 'Suspended' ? '#059669' : '#DC2626' } }}>
              {selectedUser?.status === 'Suspended' ? 'Reactivate' : 'Suspend'}
            </Button>
          </DialogActions>
        </Dialog>

      </Box>
      <MainFooter />
    </AdminLayout>
  );
};