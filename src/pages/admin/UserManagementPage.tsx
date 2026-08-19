
// /*
// import React, { useEffect, useState, useCallback } from 'react';
// import {
//   Box, Typography, Paper, TextField, IconButton, Chip,
//   InputAdornment, Table, TableBody, TableCell, TableContainer,
//   TableHead, TableRow, Button, Menu, MenuItem, Dialog,
//   DialogTitle, DialogContent, DialogActions, DialogContentText,
//   Avatar, Divider, Select, FormControl, InputLabel, Alert,
//   CircularProgress,
// } from '@mui/material';
// import {
//   Search, FilterList, Visibility, Block, MoreVert,
//   Close, Edit, CheckCircle, Error as ErrorIcon,
// } from '@mui/icons-material';
// import {
//   getAllUsers,
//   updateUserRole,
//   updateUserStatus,
//   type AdminUserDto,
// } from '../../services/Admin/adminService';

// /*
// //<<<<<<< HEAD

// type User = AdminUserDto;

// export const UserManagementPage: React.FC = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
// =======
// */

// export const UserManagementPage: React.FC = () => {
//   const [users, setUsers] = useState<AdminUserDto[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [errorMsg, setErrorMsg] = useState('');
// //>>>>>>> origin/develop


//   const [searchQuery, setSearchQuery] = useState('');
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const [selectedUser, setSelectedUser] = useState<AdminUserDto | null>(null);
//   const [viewOpen, setViewOpen] = useState(false);
//   const [editOpen, setEditOpen] = useState(false);
//   const [blockOpen, setBlockOpen] = useState(false);
//   const [successMsg, setSuccessMsg] = useState('');
// //<<<<<<< HEAD
//   const [editForm, setEditForm] = useState<Pick<User, 'role'>>({ role: 'Customer' });
//   const [updating, setUpdating] = useState(false);

//   // incoming
// const [editRole, setEditRole] = useState('');
// const [saving, setSaving] = useState(false);



//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const data = await getAllUsers();
//         setUsers(data);
//       } catch (err: any) {
//         console.error('Error fetching users:', err);
//         setError(err.response?.data?.message || 'Failed to load users');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);
// //=======
// /*
//   const [editRole, setEditRole] = useState('');
//   const [saving, setSaving] = useState(false);
// //>>>>>>> origin/develop
//  */

//   const refreshDashboard = () => {
//     window.dispatchEvent(new Event("admin-dashboard-refresh"));
//   };

//   const loadUsers = useCallback(async () => {
//     setLoading(true);
//     setErrorMsg('');
//     try {
//       const data = await getAllUsers();
//       setUsers(data);
//     } catch {
//       setErrorMsg('Failed to load users.');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     loadUsers();
//   }, [loadUsers]);

//   const handleMenuClick = (event: React.MouseEvent<HTMLElement>, user: AdminUserDto) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedUser(user);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleView = (user: AdminUserDto) => {
//     setSelectedUser(user);
//     setViewOpen(true);
//     handleMenuClose();
//   };

//   const handleEditOpen = (user: AdminUserDto) => {
//     setSelectedUser(user);
// /*
//     //<<<<<<< HEAD
//     setEditForm({ role: user.role });
// =======
// */
//     setEditRole(user.role);
// //>>>>>>> origin/develop
//     setEditOpen(true);
//     handleMenuClose();
//   };

//   const handleEditSave = async () => {
//     /*
// <<<<<<< HEAD
//     if (!selectedUser || !editForm.role) return;

//     try {
//       setUpdating(true);
//       if (editForm.role !== selectedUser.role) {
//         const updatedUser = await updateUserRole(selectedUser.id, editForm.role);
//         setUsers((currentUsers) => currentUsers.map((user) => (user.id === selectedUser.id ? { ...user, ...updatedUser } : user)));
//         setSelectedUser({ ...selectedUser, ...updatedUser });
//       }
//       setEditOpen(false);
//       showSuccess('User updated successfully');
//     } catch (err: any) {
//       console.error('Error updating user:', err);
//       showError(err.response?.data?.message || 'Failed to update user');
//     } finally {
//       setUpdating(false);
// =======
// */
//     if (!selectedUser) return;
//     setSaving(true);
//     try {
//       const updated = await updateUserRole(selectedUser.id, editRole);
//       setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
//       refreshDashboard();
//       setEditOpen(false);
//       showSuccess('User role updated successfully');
//     } catch {
//       setErrorMsg('Failed to update user role.');
//     } finally {
//       setSaving(false);
// //>>>>>>> origin/develop
//     }
//   };

//   const handleBlock = (user: AdminUserDto) => {
//     setSelectedUser(user);
//     setBlockOpen(true);
//     handleMenuClose();
//   };

//   const handleBlockConfirm = async () => {
//     if (!selectedUser) return;
// //<<<<<<< HEAD
// /*
//     try {
//       setUpdating(true);
//       const isSuspending = selectedUser.status === 'Active';
//       const updatedUser = await updateUserStatus(selectedUser.id, isSuspending);
//       setUsers((currentUsers) => currentUsers.map((user) => (user.id === selectedUser.id ? { ...user, ...updatedUser } : user)));
//       setSelectedUser({ ...selectedUser, ...updatedUser });
//       setBlockOpen(false);
//       showSuccess(`User ${isSuspending ? 'suspended' : 'reactivated'} successfully`);
//     } catch (err: any) {
//       console.error('Error updating user status:', err);
//       showError(err.response?.data?.message || 'Failed to update user status');
//     } finally {
//       setUpdating(false);
// =======
// */
//     const suspend = selectedUser.status !== 'Suspended';
//     setSaving(true);
//     try {
//       const updated = await updateUserStatus(selectedUser.id, suspend);
//       setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
//       refreshDashboard();
//       setBlockOpen(false);
//       showSuccess(`User ${suspend ? 'suspended' : 'reactivated'} successfully`);
//     } catch {
//       setErrorMsg('Failed to update user status.');
//     } finally {
//       setSaving(false);
// //>>>>>>> origin/develop
//     }
//   };

//   const showSuccess = (msg: string) => {
//     setSuccessMsg(msg);
//     setTimeout(() => setSuccessMsg(''), 3000);
//   };

//   const showError = (msg: string) => {
//     setError(msg);
//     setTimeout(() => setError(null), 5000);
//   };

//   const filteredUsers = users.filter(
//     (user) =>
//       user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       user.email.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const getRoleColor = (role: string) => {
//     switch (role) {
//       case 'User': return { bg: '#DBEAFE', color: '#1D4ED8' };
//       case 'Vendor': return { bg: '#E0E7FF', color: '#6366F1' };
//       case 'Admin': return { bg: '#FEE2E2', color: '#DC2626' };
//       default: return { bg: '#E5E7EB', color: '#6B7280' };
//     }
//   };

// //<<<<<<< HEAD
// /*
//   const getStatusColor = (status: User['status']) => {
//     return status === 'Active' ? '#10B981' : '#DC2626';
// =======
// */
//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'Active': return '#10B981';
//       case 'Suspended': return '#DC2626';
//       default: return '#6B7280';
//     }
// //>>>>>>> origin/develop
//   };

//   const getStatusText = (status: User['status']) => {
//     return status === 'Active' ? 'Active' : 'Suspended';
//   };

//   if (loading) {
//     return (
//       <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box>
//       <Box sx={{ p: 3, minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
//         {error && (
//           <Alert icon={<ErrorIcon />} severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
//             {error}
//           </Alert>
//         )}

//         {successMsg && (
//           <Alert icon={<CheckCircle />} severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>
//         )}
//         {errorMsg && (
//           <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMsg('')}>{errorMsg}</Alert>
//         )}

//         <Box sx={{ mb: 3 }}>
//           <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>User Management</Typography>
//           <Typography variant="body2" color="text.secondary">Manage all platform users and their activities</Typography>
//         </Box>

//         <Paper sx={{ p: 2, mb: 3 }}>
//           <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
//             <TextField
//               fullWidth
//               size="small"
//               placeholder="Search users..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <Search sx={{ color: '#94A3B8' }} />
//                   </InputAdornment>
//                 ),
//               }}
//               sx={{ maxWidth: 400 }}
//             />
//             <Button variant="outlined" startIcon={<FilterList />} sx={{ textTransform: 'none', borderColor: '#E2E8F0', color: '#64748B' }}>
//               Filters
//             </Button>
//             <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
//               {filteredUsers.length} of {users.length} users
//             </Typography>
//           </Box>
//         </Paper>

//         <Box sx={{ flex: 1 }}>
//           <Paper>
//             <TableContainer>
//               <Table>
//                 <TableHead>
//                   <TableRow sx={{ bgcolor: '#F8FAFC' }}>
//                     <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
//                     <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
//                     <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
//                     <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
//                     <TableCell sx={{ fontWeight: 600 }}>Bookings</TableCell>
//                     <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>


//            {/*       
// <<<<<<< HEAD
//                   {filteredUsers.length > 0 ? (
//                     filteredUsers.map((user) => {
//                       const roleStyle = getRoleColor(user.role);
//                       const isActive = user.status === 'Active';

//                       return (
//                         <TableRow key={user.id} hover>
//                           <TableCell>
//                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                               <Avatar sx={{ width: 32, height: 32, bgcolor: '#0891B2', fontSize: '0.75rem' }}>
//                                 {user.fullName?.charAt(0) || 'U'}
//                               </Avatar>
//                               <Typography variant="body2" sx={{ fontWeight: 600 }}>
//                                 {user.fullName}
//                               </Typography>
//                             </Box>
//                           </TableCell>
//                           <TableCell>
//                             <Typography variant="body2">{user.email}</Typography>
// =======
//                   {loading ? (
//                     <TableRow>
//                       <TableCell colSpan={6}>
//                         <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
//                           Loading users...
//                         </Typography>
//                       </TableCell>
//                     </TableRow>
//                   ) : filteredUsers.length === 0 ? (
//                     <TableRow>
//                       <TableCell colSpan={6}>
//                         <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
//                           No users found
//                         </Typography>
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     filteredUsers.map((user) => {
//                       const roleStyle = getRoleColor(user.role);
//                       return (
//                         <TableRow key={user.id} hover>
//                           <TableCell>
//                             <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>{user.fullName}</Typography>
//                             <Typography variant="caption" color="text.secondary">{user.email}</Typography>
// >>>>>>> origin/develop
// */}



//                   {filteredUsers.length === 0 ? (
//                     <TableRow>
//                       <TableCell colSpan={6}>
//                         <Typography
//                           variant="body2"
//                           color="text.secondary"
//                           sx={{ py: 4, textAlign: 'center' }}
//                         >
//                           No users found
//                         </Typography>
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     filteredUsers.map((user) => {
//                       const roleStyle = getRoleColor(user.role);

//                       return (
//                         <TableRow key={user.id} hover>
//                           <TableCell>
//                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                               <Avatar
//                                 sx={{
//                                   width: 32,
//                                   height: 32,
//                                   bgcolor: '#0891B2',
//                                   fontSize: '0.75rem',
//                                 }}
//                               >
//                                 {user.fullName?.charAt(0) || 'U'}
//                               </Avatar>
//                               <Typography variant="body2" sx={{ fontWeight: 600 }}>
//                                 {user.fullName}
//                               </Typography>
//                             </Box>
//                           </TableCell>

//                           <TableCell>
//                             <Typography variant="body2">{user.email}</Typography>
//                           </TableCell>

//                           <TableCell>
//                             <Chip
//                               label={user.role}
//                               size="small"
//                               sx={{
//                                 bgcolor: roleStyle.bg,
//                                 color: roleStyle.color,
//                                 fontWeight: 600,
//                                 fontSize: '0.75rem',
//                               }}
//                             />
//                           </TableCell>

//                           <TableCell>
//                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                               <Box
//                                 sx={{
//                                   width: 8,
//                                   height: 8,
//                                   borderRadius: '50%',
//                                   bgcolor: getStatusColor(user.status),
//                                 }}
//                               />
//                               <Typography
//                                 variant="body2"
//                                 sx={{
//                                   color: getStatusColor(user.status),
//                                   fontWeight: 600,
//                                 }}
//                               >
//                                 {user.status}
//                               </Typography>
//                             </Box>
//                           </TableCell>

//                           <TableCell>
//                             <Typography variant="body2" sx={{ fontWeight: 600 }}>
//                               {user.totalBookings}
//                             </Typography>
//                           </TableCell>

//                           <TableCell>
//                             <Box sx={{ display: 'flex', gap: 0.5 }}>
//                               <IconButton
//                                 size="small"
//                                 sx={{ color: '#64748B' }}
//                                 onClick={() => handleView(user)}
//                                 title="View Details"
//                               >
//                                 <Visibility fontSize="small" />
//                               </IconButton>

//                               <IconButton
//                                 size="small"
//                                 sx={{
//                                   color:
//                                     user.status === 'Suspended'
//                                       ? '#10B981'
//                                       : '#EF4444',
//                                 }}
//                                 onClick={() => handleBlock(user)}
//                                 title={
//                                   user.status === 'Suspended'
//                                     ? 'Unblock'
//                                     : 'Block'
//                                 }
//                               >
//                                 <Block fontSize="small" />
//                               </IconButton>

//                               <IconButton
//                                 size="small"
//                                 sx={{ color: '#64748B' }}
//                                 onClick={(e) => handleMenuClick(e, user)}
//                               >
//                                 <MoreVert fontSize="small" />
//                               </IconButton>
//                             </Box>
//                           </TableCell>
//                         </TableRow>
//                       );
//                     })
//                   )}


















//                           </TableCell>
//                           <TableCell>
//                             <Chip label={user.role} size="small" sx={{ bgcolor: roleStyle.bg, color: roleStyle.color, fontWeight: 600, fontSize: '0.75rem' }} />
//                           </TableCell>
//                           <TableCell>
//                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                               <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: getStatusColor(user.status) }} />


// {/*
// <<<<<<< HEAD
//                               <Typography variant="body2" sx={{ color: getStatusColor(user.status), fontWeight: 600 }}>
//                                 {getStatusText(user.status)}
//                               </Typography>
//                             </Box>
//                           </TableCell>
//                           <TableCell>
//                             <Typography variant="body2">{user.totalBookings}</Typography>
//                           </TableCell>
// //=======
// */}
//                               <Typography variant="body2" sx={{ color: getStatusColor(user.status), fontWeight: 600 }}>{user.status}</Typography>
//                             </Box>
//                           </TableCell>
//                           <TableCell>
//                             <Typography variant="body2">
//                               {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
//                             </Typography>
//                           </TableCell>
//                           <TableCell><Typography variant="body2" sx={{ fontWeight: 600 }}>{user.totalBookings}</Typography></TableCell>
// {/*}>>>>>>> origin/develop*/}


//                           <TableCell>
//                             <Box sx={{ display: 'flex', gap: 0.5 }}>
//                               <IconButton size="small" sx={{ color: '#64748B' }} onClick={() => handleView(user)} title="View Details">
//                                 <Visibility fontSize="small" />
//                               </IconButton>
// <<<<<<< HEAD
//                               <IconButton
//                                 size="small"
//                                 sx={{ color: isActive ? '#EF4444' : '#10B981' }}
//                                 onClick={() => handleBlock(user)}
//                                 title={isActive ? 'Suspend' : 'Reactivate'}
//                               >
// =======
//                               <IconButton size="small" sx={{ color: user.status === 'Suspended' ? '#10B981' : '#EF4444' }} onClick={() => handleBlock(user)} title={user.status === 'Suspended' ? 'Unblock' : 'Block'}>
// >>>>>>> origin/develop
//                                 <Block fontSize="small" />
//                               </IconButton>
//                               <IconButton size="small" sx={{ color: '#64748B' }} onClick={(e) => handleMenuClick(e, user)}>
//                                 <MoreVert fontSize="small" />
//                               </IconButton>
//                             </Box>
//                           </TableCell>
//                         </TableRow>
//                       );
//                     })
// <<<<<<< HEAD
//                   ) : (
//                     <TableRow>
//                       <TableCell colSpan={6} sx={{ textAlign: 'center', py: 3 }}>
//                         <Typography color="text.secondary">No users found</Typography>
//                       </TableCell>
//                     </TableRow>
// =======
// >>>>>>> origin/develop
//                   )}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </Paper>
//         </Box>

//         <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
//           <MenuItem onClick={() => selectedUser && handleView(selectedUser)}>
//             <Visibility fontSize="small" sx={{ mr: 1 }} /> View Details
//           </MenuItem>
//           <MenuItem onClick={() => selectedUser && handleEditOpen(selectedUser)}>
// <<<<<<< HEAD
//             <Edit fontSize="small" sx={{ mr: 1 }} /> Edit User
// =======
//             <Edit fontSize="small" sx={{ mr: 1 }} /> Change Role
// >>>>>>> origin/develop
//           </MenuItem>
//           <Divider />
//           <MenuItem onClick={() => selectedUser && handleBlock(selectedUser)} sx={{ color: '#EF4444' }}>
//             <Block fontSize="small" sx={{ mr: 1 }} />
//             {selectedUser?.status === 'Active' ? 'Suspend User' : 'Reactivate User'}
//           </MenuItem>
//         </Menu>

//         <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="sm" fullWidth>
//           <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//             User Details
//             <IconButton onClick={() => setViewOpen(false)}><Close /></IconButton>
//           </DialogTitle>
//           <DialogContent>
//             {selectedUser && (
//               <Box>
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
//                   <Avatar sx={{ width: 64, height: 64, bgcolor: '#0891B2', fontSize: '1.5rem' }}>
// <<<<<<< HEAD
//                     {selectedUser.fullName?.charAt(0) || 'U'}
//                   </Avatar>
//                   <Box>
//                     <Typography variant="h6" sx={{ fontWeight: 700 }}>
//                       {selectedUser.fullName}
//                     </Typography>
// =======
//                     {selectedUser.fullName.charAt(0)}
//                   </Avatar>
//                   <Box>
//                     <Typography variant="h6" sx={{ fontWeight: 700 }}>{selectedUser.fullName}</Typography>
// >>>>>>> origin/develop
//                     <Typography variant="body2" color="text.secondary">{selectedUser.email}</Typography>
//                   </Box>
//                 </Box>
//                 <Divider sx={{ mb: 2 }} />
//                 {[
//                   { label: 'Role', value: selectedUser.role },
// <<<<<<< HEAD
//                   { label: 'Status', value: getStatusText(selectedUser.status) },
//                   { label: 'Phone Number', value: selectedUser.phoneNumber || 'Not provided' },
//                   { label: 'Join Date', value: new Date(selectedUser.createdAt).toLocaleDateString() },
//                   { label: 'Total Bookings', value: String(selectedUser.totalBookings) },
// =======
//                   { label: 'Status', value: selectedUser.status },
//                   { label: 'Join Date', value: new Date(selectedUser.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) },
//                   { label: 'Total Bookings', value: selectedUser.totalBookings },
//                   { label: 'Phone', value: selectedUser.phoneNumber || 'N/A' },
// >>>>>>> origin/develop
//                 ].map((item) => (
//                   <Box key={item.label} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid #F1F5F9' }}>
//                     <Typography variant="body2" color="text.secondary">{item.label}</Typography>
//                     <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.value}</Typography>
//                   </Box>
//                 ))}
//               </Box>
//             )}
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setViewOpen(false)} sx={{ textTransform: 'none' }}>Close</Button>
// <<<<<<< HEAD
//             <Button
//               variant="contained"
//               onClick={() => {
//                 setViewOpen(false);
//                 selectedUser && handleEditOpen(selectedUser);
//               }}
//               sx={{ textTransform: 'none', bgcolor: '#0891B2', '&:hover': { bgcolor: '#0E7490' } }}
//             >
//               Edit User
// =======
//             <Button variant="contained" onClick={() => { setViewOpen(false); if (selectedUser) handleEditOpen(selectedUser); }}
//               sx={{ textTransform: 'none', bgcolor: '#0891B2', '&:hover': { bgcolor: '#0E7490' } }}>
//               Change Role
// >>>>>>> origin/develop
//             </Button>
//           </DialogActions>
//         </Dialog>

// <<<<<<< HEAD
//         <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
//           <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//             Edit User
//             <IconButton onClick={() => setEditOpen(false)} disabled={updating}><Close /></IconButton>
//           </DialogTitle>
//           <DialogContent>
//             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
//               <TextField label="Full Name" fullWidth value={selectedUser?.fullName || ''} InputProps={{ readOnly: true }} disabled={updating} />
//               <TextField label="Email" fullWidth value={selectedUser?.email || ''} InputProps={{ readOnly: true }} disabled={updating} />
//               <FormControl fullWidth disabled={updating}>
//                 <InputLabel>Role</InputLabel>
//                 <Select
//                   label="Role"
//                   value={editForm.role || ''}
//                   onChange={(e) => setEditForm({ role: e.target.value as User['role'] })}
//                 >
//                   <MenuItem value="Customer">Customer</MenuItem>
// =======
//         {/* Edit (role-only — that's the only field the admin API supports changing besides status) */}
//         <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
//           <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//             Change Role
//             <IconButton onClick={() => setEditOpen(false)}><Close /></IconButton>
//           </DialogTitle>
//           <DialogContent>
//             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
//               <Typography variant="body2" color="text.secondary">
//                 {selectedUser?.fullName} ({selectedUser?.email})
//               </Typography>
//               <FormControl fullWidth>
//                 <InputLabel>Role</InputLabel>
//                 <Select label="Role" value={editRole} onChange={(e) => setEditRole(e.target.value)}>
//                   <MenuItem value="User">User</MenuItem>
// >>>>>>> origin/develop
//                   <MenuItem value="Vendor">Vendor</MenuItem>
//                   <MenuItem value="Admin">Admin</MenuItem>
//                 </Select>
//               </FormControl>
//             </Box>
//           </DialogContent>
//           <DialogActions>
// <<<<<<< HEAD
//             <Button onClick={() => setEditOpen(false)} sx={{ textTransform: 'none' }} disabled={updating}>Cancel</Button>
//             <Button
//               variant="contained"
//               onClick={handleEditSave}
//               disabled={updating}
//               sx={{ textTransform: 'none', bgcolor: '#0891B2', '&:hover': { bgcolor: '#0E7490' } }}
//             >
//               {updating ? <CircularProgress size={20} sx={{ mr: 1 }} /> : 'Save Changes'}
// =======
//             <Button onClick={() => setEditOpen(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
//             <Button variant="contained" disabled={saving} onClick={handleEditSave}
//               sx={{ textTransform: 'none', bgcolor: '#0891B2', '&:hover': { bgcolor: '#0E7490' } }}>
//               {saving ? 'Saving...' : 'Save Changes'}
// >>>>>>> origin/develop
//             </Button>
//           </DialogActions>
//         </Dialog>

//         <Dialog open={blockOpen} onClose={() => setBlockOpen(false)}>
//           <DialogTitle>
//             {selectedUser?.status === 'Active' ? 'Suspend User' : 'Reactivate User'}
//           </DialogTitle>
//           <DialogContent>
//             <DialogContentText>
// <<<<<<< HEAD
//               {selectedUser?.status === 'Active'
//                 ? `Are you sure you want to suspend ${selectedUser?.fullName}? They will lose access to the platform.`
//                 : `Are you sure you want to reactivate ${selectedUser?.fullName}? They will regain access to the platform.`}
//             </DialogContentText>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setBlockOpen(false)} sx={{ textTransform: 'none' }} disabled={updating}>Cancel</Button>
//             <Button
//               variant="contained"
//               onClick={handleBlockConfirm}
//               disabled={updating}
//               sx={{
//                 textTransform: 'none',
//                 bgcolor: selectedUser?.status === 'Active' ? '#EF4444' : '#10B981',
//                 '&:hover': { bgcolor: selectedUser?.status === 'Active' ? '#DC2626' : '#059669' },
//               }}
//             >
//               {updating ? <CircularProgress size={20} sx={{ mr: 1 }} /> : selectedUser?.status === 'Active' ? 'Suspend' : 'Reactivate'}
// =======
//               {selectedUser?.status === 'Suspended'
//                 ? `Are you sure you want to reactivate ${selectedUser?.fullName}? They will regain access to the platform.`
//                 : `Are you sure you want to suspend ${selectedUser?.fullName}? They will lose access to the platform.`}
//             </DialogContentText>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setBlockOpen(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
//             <Button variant="contained" disabled={saving} onClick={handleBlockConfirm}
//               sx={{ textTransform: 'none', bgcolor: selectedUser?.status === 'Suspended' ? '#10B981' : '#EF4444', '&:hover': { bgcolor: selectedUser?.status === 'Suspended' ? '#059669' : '#DC2626' } }}>
//               {saving ? 'Working...' : selectedUser?.status === 'Suspended' ? 'Reactivate' : 'Suspend'}
// >>>>>>> origin/develop
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </Box>
//     </Box>
//   );
// };



// */




import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  IconButton,
  Chip,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Avatar,
  Divider,
  Select,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Search,
  FilterList,
  Visibility,
  Block,
  MoreVert,
  Close,
  Edit,
  CheckCircle,
} from "@mui/icons-material";
import {
  getAllUsers,
  updateUserRole,
  updateUserStatus,
  type AdminUserDto,
} from "../../services/Admin/adminService";

export const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUserDto | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [editRole, setEditRole] = useState("");
  const [saving, setSaving] = useState(false);

  const refreshDashboard = () => {
    window.dispatchEvent(new Event("admin-dashboard-refresh"));
  };

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to load users:", error);
      setErrorMsg("Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    window.setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    user: AdminUserDto,
  ) => {
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
    if (!selectedUser || !editRole) return;

    setSaving(true);

    try {
      const updated = await updateUserRole(selectedUser.id, editRole);

      setUsers((prev) =>
        prev.map((user) =>
          user.id === updated.id ? { ...user, ...updated } : user,
        ),
      );

      setSelectedUser({
        ...selectedUser,
        ...updated,
      });

      refreshDashboard();
      setEditOpen(false);
      showSuccess("User role updated successfully");
    } catch (error) {
      console.error("Failed to update user role:", error);
      setErrorMsg("Failed to update user role.");
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

    const suspend = selectedUser.status !== "Suspended";
    setSaving(true);

    try {
      const updated = await updateUserStatus(selectedUser.id, suspend);

      setUsers((prev) =>
        prev.map((user) =>
          user.id === updated.id ? { ...user, ...updated } : user,
        ),
      );

      setSelectedUser({
        ...selectedUser,
        ...updated,
      });

      refreshDashboard();
      setBlockOpen(false);

      showSuccess(
        `User ${suspend ? "suspended" : "reactivated"} successfully`,
      );
    } catch (error) {
      console.error("Failed to update user status:", error);
      setErrorMsg("Failed to update user status.");
    } finally {
      setSaving(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case "User":
        return { bg: "#DBEAFE", color: "#1D4ED8" };
      case "Vendor":
        return { bg: "#E0E7FF", color: "#6366F1" };
      case "Admin":
        return { bg: "#FEE2E2", color: "#DC2626" };
      default:
        return { bg: "#E5E7EB", color: "#6B7280" };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "#10B981";
      case "Suspended":
        return "#DC2626";
      default:
        return "#6B7280";
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          p: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          p: 3,
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {errorMsg && (
          <Alert
            severity="error"
            onClose={() => setErrorMsg("")}
            sx={{ mb: 2 }}
          >
            {errorMsg}
          </Alert>
        )}

        {successMsg && (
          <Alert
            icon={<CheckCircle />}
            severity="success"
            sx={{ mb: 2 }}
          >
            {successMsg}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, mb: 0.5 }}
          >
            User Management
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Manage all platform users and their activities
          </Typography>
        </Box>

        <Paper sx={{ p: 2, mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: "#94A3B8" }} />
                  </InputAdornment>
                ),
              }}
              sx={{ maxWidth: 400 }}
            />

            <Button
              variant="outlined"
              startIcon={<FilterList />}
              sx={{
                textTransform: "none",
                borderColor: "#E2E8F0",
                color: "#64748B",
              }}
            >
              Filters
            </Button>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ ml: "auto" }}
            >
              {filteredUsers.length} of {users.length} users
            </Typography>
          </Box>
        </Paper>

        <Box sx={{ flex: 1 }}>
          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#F8FAFC" }}>
                    <TableCell sx={{ fontWeight: 600 }}>
                      User
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      Email
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      Role
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      Status
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      Bookings
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            py: 4,
                            textAlign: "center",
                          }}
                        >
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
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Avatar
                                sx={{
                                  width: 32,
                                  height: 32,
                                  bgcolor: "#0891B2",
                                  fontSize: "0.75rem",
                                }}
                              >
                                {user.fullName?.charAt(0) || "U"}
                              </Avatar>

                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 600 }}
                              >
                                {user.fullName}
                              </Typography>
                            </Box>
                          </TableCell>

                          <TableCell>
                            <Typography variant="body2">
                              {user.email}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Chip
                              label={user.role}
                              size="small"
                              sx={{
                                bgcolor: roleStyle.bg,
                                color: roleStyle.color,
                                fontWeight: 600,
                                fontSize: "0.75rem",
                              }}
                            />
                          </TableCell>

                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Box
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: "50%",
                                  bgcolor: getStatusColor(user.status),
                                }}
                              />

                              <Typography
                                variant="body2"
                                sx={{
                                  color: getStatusColor(user.status),
                                  fontWeight: 600,
                                }}
                              >
                                {user.status}
                              </Typography>
                            </Box>
                          </TableCell>

                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {user.totalBookings}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                gap: 0.5,
                              }}
                            >
                              <IconButton
                                size="small"
                                sx={{ color: "#64748B" }}
                                onClick={() => handleView(user)}
                                title="View Details"
                              >
                                <Visibility fontSize="small" />
                              </IconButton>

                              <IconButton
                                size="small"
                                sx={{
                                  color:
                                    user.status === "Suspended"
                                      ? "#10B981"
                                      : "#EF4444",
                                }}
                                onClick={() => handleBlock(user)}
                                title={
                                  user.status === "Suspended"
                                    ? "Reactivate"
                                    : "Suspend"
                                }
                              >
                                <Block fontSize="small" />
                              </IconButton>

                              <IconButton
                                size="small"
                                sx={{ color: "#64748B" }}
                                onClick={(e) =>
                                  handleMenuClick(e, user)
                                }
                                title="More"
                              >
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

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem
            onClick={() =>
              selectedUser && handleView(selectedUser)
            }
          >
            <Visibility fontSize="small" sx={{ mr: 1 }} />
            View Details
          </MenuItem>

          <MenuItem
            onClick={() =>
              selectedUser && handleEditOpen(selectedUser)
            }
          >
            <Edit fontSize="small" sx={{ mr: 1 }} />
            Change Role
          </MenuItem>

          <Divider />

          <MenuItem
            onClick={() =>
              selectedUser && handleBlock(selectedUser)
            }
            sx={{ color: "#EF4444" }}
          >
            <Block fontSize="small" sx={{ mr: 1 }} />
            {selectedUser?.status === "Active"
              ? "Suspend User"
              : "Reactivate User"}
          </MenuItem>
        </Menu>

        <Dialog
          open={viewOpen}
          onClose={() => setViewOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            User Details

            <IconButton onClick={() => setViewOpen(false)}>
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent>
            {selectedUser && (
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mb: 3,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 64,
                      height: 64,
                      bgcolor: "#0891B2",
                      fontSize: "1.5rem",
                    }}
                  >
                    {selectedUser.fullName?.charAt(0) || "U"}
                  </Avatar>

                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700 }}
                    >
                      {selectedUser.fullName}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {selectedUser.email}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ mb: 2 }} />

                {[
                  {
                    label: "Role",
                    value: selectedUser.role,
                  },
                  {
                    label: "Status",
                    value: selectedUser.status,
                  },
                  {
                    label: "Join Date",
                    value: new Date(
                      selectedUser.createdAt,
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }),
                  },
                  {
                    label: "Total Bookings",
                    value: String(selectedUser.totalBookings),
                  },
                  {
                    label: "Phone",
                    value:
                      selectedUser.phoneNumber || "N/A",
                  },
                ].map((item) => (
                  <Box
                    key={item.label}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      py: 1,
                      borderBottom:
                        "1px solid #F1F5F9",
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {item.label}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600 }}
                    >
                      {item.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </DialogContent>

          <DialogActions>
            <Button
              onClick={() => setViewOpen(false)}
              sx={{ textTransform: "none" }}
            >
              Close
            </Button>

            <Button
              variant="contained"
              onClick={() => {
                setViewOpen(false);

                if (selectedUser) {
                  handleEditOpen(selectedUser);
                }
              }}
              sx={{
                textTransform: "none",
                bgcolor: "#0891B2",
                "&:hover": {
                  bgcolor: "#0E7490",
                },
              }}
            >
              Change Role
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={editOpen}
          onClose={() => !saving && setEditOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            Change Role

            <IconButton
              onClick={() => setEditOpen(false)}
              disabled={saving}
            >
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                pt: 1,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
              >
                {selectedUser?.fullName} ({selectedUser?.email})
              </Typography>

              <FormControl fullWidth disabled={saving}>
                <InputLabel>Role</InputLabel>

                <Select
                  label="Role"
                  value={editRole}
                  onChange={(e) =>
                    setEditRole(e.target.value)
                  }
                >
                  <MenuItem value="User">User</MenuItem>
                  <MenuItem value="Vendor">Vendor</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={() => setEditOpen(false)}
              sx={{ textTransform: "none" }}
              disabled={saving}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              disabled={saving || !editRole}
              onClick={handleEditSave}
              sx={{
                textTransform: "none",
                bgcolor: "#0891B2",
                "&:hover": {
                  bgcolor: "#0E7490",
                },
              }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={blockOpen}
          onClose={() => !saving && setBlockOpen(false)}
        >
          <DialogTitle>
            {selectedUser?.status === "Suspended"
              ? "Reactivate User"
              : "Suspend User"}
          </DialogTitle>

          <DialogContent>
            <DialogContentText>
              {selectedUser?.status === "Suspended"
                ? `Are you sure you want to reactivate ${selectedUser?.fullName}? They will regain access to the platform.`
                : `Are you sure you want to suspend ${selectedUser?.fullName}? They will lose access to the platform.`}
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={() => setBlockOpen(false)}
              sx={{ textTransform: "none" }}
              disabled={saving}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              disabled={saving}
              onClick={handleBlockConfirm}
              sx={{
                textTransform: "none",
                bgcolor:
                  selectedUser?.status === "Suspended"
                    ? "#10B981"
                    : "#EF4444",
                "&:hover": {
                  bgcolor:
                    selectedUser?.status === "Suspended"
                      ? "#059669"
                      : "#DC2626",
                },
              }}
            >
              {saving
                ? "Working..."
                : selectedUser?.status === "Suspended"
                  ? "Reactivate"
                  : "Suspend"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};