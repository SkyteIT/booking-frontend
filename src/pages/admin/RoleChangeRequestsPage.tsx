import { Close } from '@mui/icons-material';
import {
  Box, Typography, Button, Paper, Tabs, Tab,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText,
  TextField, Chip, IconButton, Alert, Pagination,
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import {
  getRoleChangeRequests, approveRoleChangeRequest, rejectRoleChangeRequest,
  type RoleChangeRequestDto,
} from '../../services/Admin/roleChangeRequestService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getApiErrorMessage } from '../../utils/getApiErrorMessage';

const STATUS_TABS = ['Pending', 'Approved', 'Rejected', 'All'] as const;
const PAGE_SIZE = 10;

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Approved':
      return { bg: '#D1FAE5', color: '#059669' };
    case 'Pending':
      return { bg: '#FEF3C7', color: '#D97706' };
    case 'Rejected':
      return { bg: '#FEE2E2', color: '#DC2626' };
    default:
      return { bg: '#E5E7EB', color: '#6B7280' };
  }
};

const formatDate = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

export const RoleChangeRequestsPage: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(1);
  const [requests, setRequests] = useState<RoleChangeRequestDto[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const [rejectTarget, setRejectTarget] = useState<RoleChangeRequestDto | null>(null);
  const [rejectNotes, setRejectNotes] = useState('');

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const status = STATUS_TABS[tab];
      const data = await getRoleChangeRequests({
        status: status === 'All' ? undefined : status,
        pageNumber: page,
        pageSize: PAGE_SIZE,
      });
      setRequests(data.items);
      setTotalPages(data.totalPages || 1);
    } catch {
      setErrorMsg('Failed to load role change requests.');
    } finally {
      setLoading(false);
    }
  }, [tab, page]);

  useEffect(() => {
    load();
  }, [load]);

  const handleApprove = async (request: RoleChangeRequestDto) => {
    setSaving(true);
    try {
      await approveRoleChangeRequest(request.id);
      showSuccess(`Approved - ${request.targetUserName} is now ${request.requestedRole}`);
      await load();
    } catch (err) {
      setErrorMsg(getApiErrorMessage(err, 'Failed to approve request.'));
    } finally {
      setSaving(false);
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectTarget) return;
    setSaving(true);
    try {
      await rejectRoleChangeRequest(rejectTarget.id, rejectNotes.trim() || undefined);
      showSuccess('Request rejected');
      setRejectTarget(null);
      setRejectNotes('');
      await load();
    } catch {
      setErrorMsg('Failed to reject request.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      {successMsg && (
        <Box sx={{ mb: 2, p: 2, bgcolor: '#D1FAE5', color: '#059669', borderRadius: 1 }}>
          {successMsg}
        </Box>
      )}
      {errorMsg && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMsg('')}>{errorMsg}</Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>Role Change Requests</Typography>
        <Typography variant="body2" color="text.secondary">
          Nothing changes here until you approve it — a plain Admin's role change requests land in
          this queue instead of taking effect immediately.
        </Typography>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tab} onChange={(_, val) => { setTab(val); setPage(1); }} sx={{ px: 2, pt: 1 }}>
          {STATUS_TABS.map((label) => (
            <Tab key={label} label={label} sx={{ textTransform: 'none', fontWeight: 500 }} />
          ))}
        </Tabs>
      </Paper>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                {['Target user', 'Requested by', 'Change', 'Reason', 'Status', 'Requested', 'Actions'].map((col) => (
                  <TableCell key={col} sx={{ fontWeight: 600 }}>{col}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7}>
                    <LoadingSpinner fullScreen={false} size={24} py={3} />
                  </TableCell>
                </TableRow>
              ) : requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                      No requests found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((request) => {
                  const statusStyle = getStatusColor(request.status);
                  return (
                    <TableRow key={request.id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{request.targetUserName}</Typography>
                        <Typography variant="caption" color="text.secondary">{request.targetUserEmail}</Typography>
                      </TableCell>
                      <TableCell><Typography variant="body2">{request.requestedByUserName}</Typography></TableCell>
                      <TableCell>
                        <Typography variant="body2">{request.currentRole} → <strong>{request.requestedRole}</strong></Typography>
                      </TableCell>
                      <TableCell><Typography variant="body2" sx={{ maxWidth: 200 }}>{request.reason || '—'}</Typography></TableCell>
                      <TableCell>
                        <Chip label={request.status} sx={{ bgcolor: statusStyle.bg, color: statusStyle.color, fontWeight: 600, fontSize: '0.75rem' }} />
                      </TableCell>
                      <TableCell><Typography variant="caption">{formatDate(request.createdAt)}</Typography></TableCell>
                      <TableCell>
                        {request.status === 'Pending' && (
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button size="small" variant="contained" disabled={saving}
                              onClick={() => handleApprove(request)}
                              sx={{ textTransform: 'none', bgcolor: '#0891B2', '&:hover': { bgcolor: '#0E7490' } }}>
                              Approve
                            </Button>
                            <Button size="small" variant="outlined" color="error" disabled={saving}
                              onClick={() => setRejectTarget(request)}
                              sx={{ textTransform: 'none' }}>
                              Reject
                            </Button>
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {!loading && requests.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} />
          </Box>
        )}
      </Paper>

      <Dialog open={!!rejectTarget} onClose={() => setRejectTarget(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Reject Request
          <IconButton onClick={() => setRejectTarget(null)}><Close /></IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Rejecting the request to change <strong>{rejectTarget?.targetUserName}</strong>'s role to{' '}
            <strong>{rejectTarget?.requestedRole}</strong>, requested by {rejectTarget?.requestedByUserName}.
          </DialogContentText>
          <TextField
            fullWidth
            multiline
            minRows={2}
            label="Notes (optional)"
            value={rejectNotes}
            onChange={(e) => setRejectNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectTarget(null)} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button variant="contained" color="error" disabled={saving} onClick={handleRejectConfirm}
            sx={{ textTransform: 'none' }}>
            {saving ? 'Rejecting...' : 'Reject Request'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoleChangeRequestsPage;
