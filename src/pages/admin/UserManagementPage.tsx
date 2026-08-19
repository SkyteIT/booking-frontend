import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, TextField, IconButton, Chip,
  InputAdornment, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, Menu, MenuItem, Dialog,
  DialogTitle, DialogContent, DialogActions, DialogContentText,
  Avatar, Divider, Select, FormControl, InputLabel, Alert,
  CircularProgress,
} from '@mui/material';
import {
  Search, FilterList, Visibility, Block, MoreVert,
  Close, Edit, CheckCircle, Error as ErrorIcon,
} from '@mui/icons-material';
import {
  getAllUsers,
  updateUserRole,
  updateUserStatus,
  type AdminUserDto,
} from '../../services/Admin/adminService';

type User = AdminUserDto;

export const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [editForm, setEditForm] = useState<Pick<User, 'role'>>({ role: 'Customer' });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllUsers();
        setUsers(data);
      } catch (err: any) {
        console.error('Error fetching users:', err);
        setError(err.response?.data?.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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
    setEditForm({ role: user.role });
    setEditOpen(true);
    handleMenuClose();
  };

  const handleEditSave = async () => {
    if (!selectedUser || !editForm.role) return;

    try {
      setUpdating(true);
      if (editForm.role !== selectedUser.role) {
        const updatedUser = await updateUserRole(selectedUser.id, editForm.role);
        setUsers((currentUsers) => currentUsers.map((user) => (user.id === selectedUser.id ? { ...user, ...updatedUser } : user)));
        setSelectedUser({ ...selectedUser, ...updatedUser });
      }
      setEditOpen(false);
      showSuccess('User updated successfully');
    } catch (err: any) {
      console.error('Error updating user:', err);
      showError(err.response?.data?.message || 'Failed to update user');
    } finally {
      setUpdating(false);
    }
  };

  const handleBlock = (user: User) => {
    setSelectedUser(user);
    setBlockOpen(true);
    handleMenuClose();
  };

  const handleBlockConfirm = async () => {
    if (!selectedUser) return;

    try {
      setUpdating(true);
      const isSuspending = selectedUser.status === 'Active';
      const updatedUser = await updateUserStatus(selectedUser.id, isSuspending);
      setUsers((currentUsers) => currentUsers.map((user) => (user.id === selectedUser.id ? { ...user, ...updatedUser } : user)));
      setSelectedUser({ ...selectedUser, ...updatedUser });
      setBlockOpen(false);
      showSuccess(`User ${isSuspending ? 'suspended' : 'reactivated'} successfully`);
    } catch (err: any) {
      console.error('Error updating user status:', err);
      showError(err.response?.data?.message || 'Failed to update user status');
    } finally {
      setUpdating(false);
    }
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const showError = (msg: string) => {
    setError(msg);
    setTimeout(() => setError(null), 5000);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

  const getStatusColor = (status: User['status']) => {
    return status === 'Active' ? '#10B981' : '#DC2626';
  };

  const getStatusText = (status: User['status']) => {
    return status === 'Active' ? 'Active' : 'Suspended';
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ p: 3, minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
        {error && (
          <Alert icon={<ErrorIcon />} severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

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
              fullWidth
              size="small"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: '#94A3B8' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ maxWidth: 400 }}
            />
            <Button variant="outlined" startIcon={<FilterList />} sx={{ textTransform: 'none', borderColor: '#E2E8F0', color: '#64748B' }}>
              Filters
            </Button>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
              {filteredUsers.length} of {users.length} users
            </Typography>
          </Box>
        </Paper>

        <Box sx={{ flex: 1 }}>
          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                    <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Bookings</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => {
                      const roleStyle = getRoleColor(user.role);
                      const isActive = user.status === 'Active';

                      return (
                        <TableRow key={user.id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar sx={{ width: 32, height: 32, bgcolor: '#0891B2', fontSize: '0.75rem' }}>
                                {user.fullName?.charAt(0) || 'U'}
                              </Avatar>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {user.fullName}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{user.email}</Typography>
                          </TableCell>
                          <TableCell>
                            <Chip label={user.role} size="small" sx={{ bgcolor: roleStyle.bg, color: roleStyle.color, fontWeight: 600, fontSize: '0.75rem' }} />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: getStatusColor(user.status) }} />
                              <Typography variant="body2" sx={{ color: getStatusColor(user.status), fontWeight: 600 }}>
                                {getStatusText(user.status)}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{user.totalBookings}</Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              <IconButton size="small" sx={{ color: '#64748B' }} onClick={() => handleView(user)} title="View Details">
                                <Visibility fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                sx={{ color: isActive ? '#EF4444' : '#10B981' }}
                                onClick={() => handleBlock(user)}
                                title={isActive ? 'Suspend' : 'Reactivate'}
                              >
                                <Block fontSize="small" />
                              </IconButton>
                              <IconButton size="small" sx={{ color: '#64748B' }} onClick={(e) => handleMenuClick(e, user)}>
                                <MoreVert fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ textAlign: 'center', py: 3 }}>
                        <Typography color="text.secondary">No users found</Typography>
                      </TableCell>
                    </TableRow>
                  )}
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
          <Divider />
          <MenuItem onClick={() => selectedUser && handleBlock(selectedUser)} sx={{ color: '#EF4444' }}>
            <Block fontSize="small" sx={{ mr: 1 }} />
            {selectedUser?.status === 'Active' ? 'Suspend User' : 'Reactivate User'}
          </MenuItem>
        </Menu>

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
                    {selectedUser.fullName?.charAt(0) || 'U'}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {selectedUser.fullName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">{selectedUser.email}</Typography>
                  </Box>
                </Box>
                <Divider sx={{ mb: 2 }} />
                {[
                  { label: 'Role', value: selectedUser.role },
                  { label: 'Status', value: getStatusText(selectedUser.status) },
                  { label: 'Phone Number', value: selectedUser.phoneNumber || 'Not provided' },
                  { label: 'Join Date', value: new Date(selectedUser.createdAt).toLocaleDateString() },
                  { label: 'Total Bookings', value: String(selectedUser.totalBookings) },
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
            <Button
              variant="contained"
              onClick={() => {
                setViewOpen(false);
                selectedUser && handleEditOpen(selectedUser);
              }}
              sx={{ textTransform: 'none', bgcolor: '#0891B2', '&:hover': { bgcolor: '#0E7490' } }}
            >
              Edit User
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Edit User
            <IconButton onClick={() => setEditOpen(false)} disabled={updating}><Close /></IconButton>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField label="Full Name" fullWidth value={selectedUser?.fullName || ''} InputProps={{ readOnly: true }} disabled={updating} />
              <TextField label="Email" fullWidth value={selectedUser?.email || ''} InputProps={{ readOnly: true }} disabled={updating} />
              <FormControl fullWidth disabled={updating}>
                <InputLabel>Role</InputLabel>
                <Select
                  label="Role"
                  value={editForm.role || ''}
                  onChange={(e) => setEditForm({ role: e.target.value as User['role'] })}
                >
                  <MenuItem value="Customer">Customer</MenuItem>
                  <MenuItem value="Vendor">Vendor</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditOpen(false)} sx={{ textTransform: 'none' }} disabled={updating}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleEditSave}
              disabled={updating}
              sx={{ textTransform: 'none', bgcolor: '#0891B2', '&:hover': { bgcolor: '#0E7490' } }}
            >
              {updating ? <CircularProgress size={20} sx={{ mr: 1 }} /> : 'Save Changes'}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={blockOpen} onClose={() => setBlockOpen(false)}>
          <DialogTitle>
            {selectedUser?.status === 'Active' ? 'Suspend User' : 'Reactivate User'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {selectedUser?.status === 'Active'
                ? `Are you sure you want to suspend ${selectedUser?.fullName}? They will lose access to the platform.`
                : `Are you sure you want to reactivate ${selectedUser?.fullName}? They will regain access to the platform.`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setBlockOpen(false)} sx={{ textTransform: 'none' }} disabled={updating}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleBlockConfirm}
              disabled={updating}
              sx={{
                textTransform: 'none',
                bgcolor: selectedUser?.status === 'Active' ? '#EF4444' : '#10B981',
                '&:hover': { bgcolor: selectedUser?.status === 'Active' ? '#DC2626' : '#059669' },
              }}
            >
              {updating ? <CircularProgress size={20} sx={{ mr: 1 }} /> : selectedUser?.status === 'Active' ? 'Suspend' : 'Reactivate'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};