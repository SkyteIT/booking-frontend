import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Typography, Paper, TextField, IconButton, Chip,
  InputAdornment, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, Menu, MenuItem, Dialog,
  DialogTitle, DialogContent, DialogActions, DialogContentText,
  Avatar, Divider, Select, FormControl, InputLabel, Alert,
} from '@mui/material';
import {
  Search, FilterList, Visibility, Block, MoreVert,
  Close, Edit, CheckCircle,
} from '@mui/icons-material';
import {
  getAllUsers,
  updateUserRole,
  updateUserStatus,
  type AdminUserDto,
} from '../../services/Admin/adminService';
import { getApiErrorMessage } from '../../utils/getApiErrorMessage';

export const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUserDto | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [editRole, setEditRole] = useState('');
  const [saving, setSaving] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch {
      setErrorMsg('Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, user: AdminUserDto) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleView = (user: AdminUserDto) => {
    setSelectedUser(user);
    setViewOpen(true);
    handleMenuClose();
  };

  const handleEditOpen = (user: AdminUserDto) => {
    setSelectedUser(user);
    setEditRole(user.role);
    setEditOpen(true);
    handleMenuClose();
  };

  const handleEditSave = async () => {
    if (!selectedUser) return;
    setSaving(true);
    try {
      const outcome = await updateUserRole(selectedUser.id, editRole);
      if (outcome.appliedImmediately && outcome.user) {
        const updated = outcome.user;
        setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
        showSuccess('User role updated successfully');
      } else {
        // Plain Admin actor - nothing changed yet, a SuperAdmin has to approve it.
        showSuccess('Request submitted for SuperAdmin approval');
      }
      setEditOpen(false);
    } catch (err) {
      setErrorMsg(getApiErrorMessage(err, 'Failed to update user role.'));
    } finally {
      setSaving(false);
    }
  };

  const handleBlock = (user: AdminUserDto) => {
    setSelectedUser(user);
    setBlockOpen(true);
    handleMenuClose();
  };

  const handleBlockConfirm = async () => {
    if (!selectedUser) return;
    const suspend = selectedUser.status !== 'Suspended';
    setSaving(true);
    try {
      const updated = await updateUserStatus(selectedUser.id, suspend);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      setBlockOpen(false);
      showSuccess(`User ${suspend ? 'suspended' : 'reactivated'} successfully`);
    } catch {
      setErrorMsg('Failed to update user status.');
    } finally {
      setSaving(false);
    }
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const roleOptions = ['All', ...Array.from(new Set(users.map((u) => u.role)))];
  const activeFilterCount = (roleFilter !== 'All' ? 1 : 0) + (statusFilter !== 'All' ? 1 : 0);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'User': return { bg: '#DBEAFE', color: '#1D4ED8' };
      case 'Vendor': return { bg: '#E0E7FF', color: '#6366F1' };
      case 'Admin': return { bg: '#FEE2E2', color: '#DC2626' };
      default: return { bg: '#E5E7EB', color: '#6B7280' };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return '#10B981';
      case 'Suspended': return '#DC2626';
      default: return '#6B7280';
    }
  };

  return (
    <Box>
      <Box sx={{ p: 3, minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>

        {successMsg && (
          <Alert icon={<CheckCircle />} severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>
        )}
        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMsg('')}>{errorMsg}</Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, letterSpacing: "-0.01em" }}
          >
            User Management
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Manage all platform users and their activities
          </Typography>
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
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              fullWidth size="small" placeholder="Search users..."
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: '#94A3B8' }} /></InputAdornment> }}
              sx={{
                maxWidth: 400,
                '& .MuiOutlinedInput-root': { borderRadius: '999px', bgcolor: '#fff' },
              }}
            />
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={(e) => setFilterAnchorEl(e.currentTarget)}
              sx={{ textTransform: 'none', borderColor: '#E2E8F0', color: '#64748B', borderRadius: '999px' }}
            >
              Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
            </Button>
            <Menu anchorEl={filterAnchorEl} open={!!filterAnchorEl} onClose={() => setFilterAnchorEl(null)}>
              <Box sx={{ px: 2, py: 1.5, minWidth: 220 }}>
                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <InputLabel>Role</InputLabel>
                  <Select label="Role" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                    {roleOptions.map((role) => (
                      <MenuItem key={role} value={role}>{role}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth size="small" sx={{ mb: activeFilterCount > 0 ? 1.5 : 0 }}>
                  <InputLabel>Status</InputLabel>
                  <Select label="Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <MenuItem value="All">All</MenuItem>
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Suspended">Suspended</MenuItem>
                  </Select>
                </FormControl>
                {activeFilterCount > 0 && (
                  <Button
                    size="small"
                    onClick={() => { setRoleFilter('All'); setStatusFilter('All'); }}
                    sx={{ textTransform: 'none' }}
                  >
                    Clear filters
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
                    <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Join Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Bookings</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                          Loading users...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                          No users found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => {
                      const roleStyle = getRoleColor(user.role);
                      return (
                        <TableRow key={user.id} hover>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>{user.fullName}</Typography>
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
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </Typography>
                          </TableCell>
                          <TableCell><Typography variant="body2" sx={{ fontWeight: 600 }}>{user.totalBookings}</Typography></TableCell>
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
                    })
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
            <Edit fontSize="small" sx={{ mr: 1 }} /> Change Role
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => selectedUser && handleBlock(selectedUser)} sx={{ color: '#EF4444' }}>
            <Block fontSize="small" sx={{ mr: 1 }} />
            {selectedUser?.status === 'Suspended' ? 'Reactivate User' : 'Suspend User'}
          </MenuItem>
        </Menu>

        {/* View Dialog */}
        <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            User Details
            <IconButton onClick={() => setViewOpen(false)}><Close /></IconButton>
          </DialogTitle>
          <DialogContent>
            {selectedUser && (
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Avatar sx={{ width: 64, height: 64, background: 'linear-gradient(160deg, #005a8d, #0077b6)', fontSize: '1.5rem' }}>
                    {selectedUser.fullName.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{selectedUser.fullName}</Typography>
                    <Typography variant="body2" color="text.secondary">{selectedUser.email}</Typography>
                  </Box>
                </Box>
                <Divider sx={{ mb: 2 }} />
                {[
                  { label: 'Role', value: selectedUser.role },
                  { label: 'Status', value: selectedUser.status },
                  { label: 'Join Date', value: new Date(selectedUser.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) },
                  { label: 'Total Bookings', value: selectedUser.totalBookings },
                  { label: 'Phone', value: selectedUser.phoneNumber || 'N/A' },
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
            <Button variant="contained" onClick={() => { setViewOpen(false); if (selectedUser) handleEditOpen(selectedUser); }}
              sx={{ textTransform: 'none', background: 'linear-gradient(160deg, #005a8d, #0077b6)', borderRadius: '999px', '&:hover': { background: 'linear-gradient(160deg, #004a75, #005a8d)' } }}>
              Change Role
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit (role-only — that's the only field the admin API supports changing besides status) */}
        <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Change Role
            <IconButton onClick={() => setEditOpen(false)}><Close /></IconButton>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {selectedUser?.fullName} ({selectedUser?.email})
              </Typography>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select label="Role" value={editRole} onChange={(e) => setEditRole(e.target.value)}>
                  <MenuItem value="User">User</MenuItem>
                  <MenuItem value="Vendor">Vendor</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="Finance">Finance</MenuItem>
                  <MenuItem value="SuperAdmin">SuperAdmin</MenuItem>
                </Select>
              </FormControl>
              <Typography variant="caption" color="text.secondary">
                If you're not a SuperAdmin, this submits a request for SuperAdmin approval instead
                of changing the role immediately.
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditOpen(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
            <Button variant="contained" disabled={saving} onClick={handleEditSave}
              sx={{ textTransform: 'none', background: 'linear-gradient(160deg, #005a8d, #0077b6)', borderRadius: '999px', '&:hover': { background: 'linear-gradient(160deg, #004a75, #005a8d)' } }}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Block Confirm Dialog */}
        <Dialog open={blockOpen} onClose={() => setBlockOpen(false)} PaperProps={{ sx: { borderRadius: '20px' } }}>
          <DialogTitle>{selectedUser?.status === 'Suspended' ? 'Reactivate User' : 'Suspend User'}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {selectedUser?.status === 'Suspended'
                ? `Are you sure you want to reactivate ${selectedUser?.fullName}? They will regain access to the platform.`
                : `Are you sure you want to suspend ${selectedUser?.fullName}? They will lose access to the platform.`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setBlockOpen(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
            <Button variant="contained" disabled={saving} onClick={handleBlockConfirm}
              sx={{ textTransform: 'none', bgcolor: selectedUser?.status === 'Suspended' ? '#10B981' : '#EF4444', '&:hover': { bgcolor: selectedUser?.status === 'Suspended' ? '#059669' : '#DC2626' } }}>
              {saving ? 'Working...' : selectedUser?.status === 'Suspended' ? 'Reactivate' : 'Suspend'}
            </Button>
          </DialogActions>
        </Dialog>

      </Box>
    </Box>
  );
};
