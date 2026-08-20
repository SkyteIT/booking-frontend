import { Close } from '@mui/icons-material';
import {
  Box, Typography, Button, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText,
  TextField, Chip, IconButton, Alert, Pagination,
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import SegmentedTabs from '../../components/common/SegmentedTabs';
import SnackbarAlert from '../../components/common/SnackbarAlert';
import {
  getFraudFlags, reviewFraudFlag,
  type AdminFraudFlagDto,
} from '../../services/Admin/fraudService';

const STATUS_TABS = ['All', 'Open', 'Cleared', 'ConfirmedFraud'] as const;
const PAGE_SIZE = 10;

const RULE_LABELS: Record<string, string> = {
  BookingVelocity: 'Booking velocity',
  NewAccountHighValue: 'New account, high value',
  RepeatedCancellations: 'Repeated cancellations',
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Cleared':
      return { bg: '#D1FAE5', color: '#059669' };
    case 'Open':
      return { bg: '#FEF3C7', color: '#D97706' };
    case 'ConfirmedFraud':
      return { bg: '#FEE2E2', color: '#DC2626' };
    default:
      return { bg: '#E5E7EB', color: '#6B7280' };
  }
};

const getSeverityColor = (severity: string) =>
  severity === 'Hold' ? { bg: '#FEE2E2', color: '#DC2626' } : { bg: '#E5E7EB', color: '#6B7280' };

const formatDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

export const FraudReviewPage: React.FC = () => {
  const [statusTab, setStatusTab] = useState(0);
  const [page, setPage] = useState(1);
  const [flags, setFlags] = useState<AdminFraudFlagDto[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const [reviewTarget, setReviewTarget] = useState<AdminFraudFlagDto | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const status = STATUS_TABS[statusTab];
      const data = await getFraudFlags({
        status: status === 'All' ? undefined : status,
        pageNumber: page,
        pageSize: PAGE_SIZE,
      });
      setFlags(data.items);
      setTotalPages(data.totalPages || 1);
    } catch {
      setErrorMsg('Failed to load fraud flags.');
    } finally {
      setLoading(false);
    }
  }, [statusTab, page]);

  useEffect(() => {
    load();
  }, [load]);

  const handleReview = async (decision: 'Clear' | 'ConfirmFraud') => {
    if (!reviewTarget) return;
    setSaving(true);
    try {
      await reviewFraudFlag(reviewTarget.id, decision, reviewNotes.trim() || undefined);
      showSuccess(decision === 'Clear' ? 'Flag cleared' : 'Marked as confirmed fraud');
      setReviewTarget(null);
      setReviewNotes('');
      await load();
    } catch {
      setErrorMsg('Failed to review fraud flag.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <SnackbarAlert
        open={!!successMsg}
        onClose={() => setSuccessMsg('')}
        severity="success"
        message={successMsg}
      />
      {errorMsg && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMsg('')}>{errorMsg}</Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, letterSpacing: "-0.01em" }}
        >
          Fraud Review
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Bookings flagged by automated fraud rules. "Hold" bookings are stuck at Pending with payment on hold
          until you clear or reject them here — everything else is pattern tracking only and already went through.
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
        <SegmentedTabs
          options={STATUS_TABS}
          value={STATUS_TABS[statusTab]}
          labels={{ ConfirmedFraud: 'Confirmed Fraud' }}
          onChange={(v) => { setStatusTab(STATUS_TABS.indexOf(v)); setPage(1); }}
        />
      </Paper>

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
                {['Booking', 'Customer', 'Rule', 'Severity', 'Details', 'Status', 'Flagged', 'Actions'].map((col) => (
                  <TableCell key={col} sx={{ fontWeight: 600 }}>{col}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8}>
                    <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                      Loading fraud flags...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : flags.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8}>
                    <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                      No fraud flags found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                flags.map((flag) => {
                  const statusStyle = getStatusColor(flag.status);
                  const severityStyle = getSeverityColor(flag.severity);
                  return (
                    <TableRow key={flag.id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{flag.bookingNumber}</Typography>
                        <Typography variant="caption" color="text.secondary">{flag.listingTitle}</Typography>
                      </TableCell>
                      <TableCell><Typography variant="body2">{flag.customerName}</Typography></TableCell>
                      <TableCell><Typography variant="body2">{RULE_LABELS[flag.ruleTriggered] ?? flag.ruleTriggered}</Typography></TableCell>
                      <TableCell>
                        <Chip label={flag.severity === 'Hold' ? 'Hold' : 'Flag only'} size="small"
                          sx={{ bgcolor: severityStyle.bg, color: severityStyle.color, fontWeight: 600, fontSize: '0.75rem' }} />
                      </TableCell>
                      <TableCell><Typography variant="body2" sx={{ maxWidth: 260 }}>{flag.details}</Typography></TableCell>
                      <TableCell>
                        <Chip label={flag.status === 'ConfirmedFraud' ? 'Confirmed Fraud' : flag.status}
                          sx={{ bgcolor: statusStyle.bg, color: statusStyle.color, fontWeight: 600, fontSize: '0.75rem' }} />
                      </TableCell>
                      <TableCell><Typography variant="caption">{formatDate(flag.createdAt)}</Typography></TableCell>
                      <TableCell>
                        {flag.status === 'Open' && (
                          <Button size="small" variant="contained" disabled={saving}
                            onClick={() => { setReviewTarget(flag); setReviewNotes(''); }}
                            sx={{ textTransform: 'none', background: 'linear-gradient(160deg, #005a8d, #0077b6)', borderRadius: '999px', '&:hover': { background: 'linear-gradient(160deg, #004a75, #005a8d)' } }}>
                            Review
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {!loading && flags.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} />
          </Box>
        )}
      </Paper>

      {/* Review Dialog */}
      <Dialog open={!!reviewTarget} onClose={() => setReviewTarget(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Review Fraud Flag
          <IconButton onClick={() => setReviewTarget(null)}><Close /></IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 1 }}>
            Booking <strong>{reviewTarget?.bookingNumber}</strong> ({reviewTarget?.customerName}) — {reviewTarget?.details}
          </DialogContentText>
          {reviewTarget?.severity === 'Hold' && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              This booking is currently held at Pending with no payment captured. Clearing it confirms the booking
              and charges the customer; confirming fraud rejects the booking and no payment is ever taken.
            </Alert>
          )}
          <TextField
            fullWidth
            multiline
            minRows={2}
            label="Notes (optional)"
            value={reviewNotes}
            onChange={(e) => setReviewNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewTarget(null)} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button variant="outlined" color="error" disabled={saving} onClick={() => handleReview('ConfirmFraud')}
            sx={{ textTransform: 'none' }}>
            {saving ? 'Saving...' : 'Confirm Fraud'}
          </Button>
          <Button variant="contained" disabled={saving} onClick={() => handleReview('Clear')}
            sx={{ textTransform: 'none', background: 'linear-gradient(160deg, #005a8d, #0077b6)', borderRadius: '999px', '&:hover': { background: 'linear-gradient(160deg, #004a75, #005a8d)' } }}>
            {saving ? 'Saving...' : 'Clear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FraudReviewPage;
