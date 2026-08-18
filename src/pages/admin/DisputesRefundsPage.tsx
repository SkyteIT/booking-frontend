import { Close, Add } from '@mui/icons-material';
import {
  Box, Typography, Button, Paper, Tabs, Tab,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText,
  TextField, Select, FormControl, InputLabel, MenuItem, Chip,
  IconButton, Alert, Pagination,
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import {
  getRefunds, approveRefund, rejectRefund,
  getDisputes, recordDispute, resolveDispute,
  type AdminRefundDto, type AdminDisputeDto,
} from '../../services/Admin/paymentsService';

const REFUND_TABS = ['All', 'Requested', 'Approved', 'Processed', 'Rejected'] as const;
const DISPUTE_TABS = ['All', 'Opened', 'Won', 'Lost', 'Withdrawn'] as const;
const PAGE_SIZE = 10;

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Processed':
    case 'Won':
      return { bg: '#D1FAE5', color: '#059669' };
    case 'Requested':
    case 'Opened':
      return { bg: '#FEF3C7', color: '#D97706' };
    case 'Approved':
      return { bg: '#DBEAFE', color: '#1D4ED8' };
    case 'Rejected':
    case 'Lost':
      return { bg: '#FEE2E2', color: '#DC2626' };
    case 'Withdrawn':
      return { bg: '#E5E7EB', color: '#6B7280' };
    default:
      return { bg: '#E5E7EB', color: '#6B7280' };
  }
};

const formatDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

export const DisputesRefundsPage: React.FC = () => {
  const [mainTab, setMainTab] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // --- Refunds ---
  const [refundTab, setRefundTab] = useState(0);
  const [refundPage, setRefundPage] = useState(1);
  const [refunds, setRefunds] = useState<AdminRefundDto[]>([]);
  const [refundTotalPages, setRefundTotalPages] = useState(1);
  const [refundsLoading, setRefundsLoading] = useState(true);
  const [rejectTarget, setRejectTarget] = useState<AdminRefundDto | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [savingRefund, setSavingRefund] = useState(false);

  const loadRefunds = useCallback(async () => {
    setRefundsLoading(true);
    try {
      const status = REFUND_TABS[refundTab];
      const data = await getRefunds({
        status: status === 'All' ? undefined : status,
        pageNumber: refundPage,
        pageSize: PAGE_SIZE,
      });
      setRefunds(data.items);
      setRefundTotalPages(data.totalPages || 1);
    } catch {
      setErrorMsg('Failed to load refunds.');
    } finally {
      setRefundsLoading(false);
    }
  }, [refundTab, refundPage]);

  useEffect(() => {
    if (mainTab === 0) loadRefunds();
  }, [mainTab, loadRefunds]);

  const handleApprove = async (refund: AdminRefundDto) => {
    setSavingRefund(true);
    try {
      await approveRefund(refund.id);
      showSuccess('Refund approved');
      await loadRefunds();
    } catch {
      setErrorMsg('Failed to approve refund.');
    } finally {
      setSavingRefund(false);
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectTarget || !rejectReason.trim()) return;
    setSavingRefund(true);
    try {
      await rejectRefund(rejectTarget.id, rejectReason.trim());
      showSuccess('Refund rejected');
      setRejectTarget(null);
      setRejectReason('');
      await loadRefunds();
    } catch {
      setErrorMsg('Failed to reject refund.');
    } finally {
      setSavingRefund(false);
    }
  };

  // --- Disputes ---
  const [disputeTab, setDisputeTab] = useState(0);
  const [disputePage, setDisputePage] = useState(1);
  const [disputes, setDisputes] = useState<AdminDisputeDto[]>([]);
  const [disputeTotalPages, setDisputeTotalPages] = useState(1);
  const [disputesLoading, setDisputesLoading] = useState(true);
  const [resolveTarget, setResolveTarget] = useState<AdminDisputeDto | null>(null);
  const [resolveOutcome, setResolveOutcome] = useState<'Won' | 'Lost' | 'Withdrawn'>('Won');
  const [savingDispute, setSavingDispute] = useState(false);

  const [recordOpen, setRecordOpen] = useState(false);
  const [recordPaymentId, setRecordPaymentId] = useState('');
  const [recordAmount, setRecordAmount] = useState('');
  const [recordReason, setRecordReason] = useState('');
  const [recordFee, setRecordFee] = useState('');
  const [recordReference, setRecordReference] = useState('');

  const loadDisputes = useCallback(async () => {
    setDisputesLoading(true);
    try {
      const status = DISPUTE_TABS[disputeTab];
      const data = await getDisputes({
        status: status === 'All' ? undefined : status,
        pageNumber: disputePage,
        pageSize: PAGE_SIZE,
      });
      setDisputes(data.items);
      setDisputeTotalPages(data.totalPages || 1);
    } catch {
      setErrorMsg('Failed to load disputes.');
    } finally {
      setDisputesLoading(false);
    }
  }, [disputeTab, disputePage]);

  useEffect(() => {
    if (mainTab === 1) loadDisputes();
  }, [mainTab, loadDisputes]);

  const handleResolveConfirm = async () => {
    if (!resolveTarget) return;
    setSavingDispute(true);
    try {
      await resolveDispute(resolveTarget.id, resolveOutcome);
      showSuccess(`Dispute marked ${resolveOutcome}`);
      setResolveTarget(null);
      await loadDisputes();
    } catch {
      setErrorMsg('Failed to resolve dispute.');
    } finally {
      setSavingDispute(false);
    }
  };

  const handleRecordSubmit = async () => {
    if (!recordPaymentId.trim() || !recordAmount || !recordReason.trim()) return;
    setSavingDispute(true);
    try {
      await recordDispute({
        paymentId: recordPaymentId.trim(),
        amount: Number(recordAmount),
        reason: recordReason.trim(),
        disputeFeeAmount: recordFee ? Number(recordFee) : undefined,
        externalDisputeReference: recordReference.trim() || undefined,
      });
      showSuccess('Dispute recorded');
      setRecordOpen(false);
      setRecordPaymentId('');
      setRecordAmount('');
      setRecordReason('');
      setRecordFee('');
      setRecordReference('');
      await loadDisputes();
    } catch {
      setErrorMsg('Failed to record dispute.');
    } finally {
      setSavingDispute(false);
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
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>Disputes & Refunds</Typography>
        <Typography variant="body2" color="text.secondary">Review refund requests and manage payment disputes</Typography>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={mainTab} onChange={(_, val) => setMainTab(val)} sx={{ px: 2, pt: 1 }}>
          <Tab label="Refunds" sx={{ textTransform: 'none', fontWeight: 500 }} />
          <Tab label="Disputes" sx={{ textTransform: 'none', fontWeight: 500 }} />
        </Tabs>
      </Paper>

      {mainTab === 0 && (
        <>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Tabs value={refundTab} onChange={(_, val) => { setRefundTab(val); setRefundPage(1); }}>
              {REFUND_TABS.map((label) => (
                <Tab key={label} label={label} sx={{ textTransform: 'none', fontWeight: 500 }} />
              ))}
            </Tabs>
          </Paper>

          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                    {['Booking', 'Customer', 'Vendor', 'Listing', 'Amount', 'Reason', 'Status', 'Actions'].map((col) => (
                      <TableCell key={col} sx={{ fontWeight: 600 }}>{col}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {refundsLoading ? (
                    <TableRow>
                      <TableCell colSpan={8}>
                        <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                          Loading refunds...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : refunds.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8}>
                        <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                          No refunds found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    refunds.map((refund) => {
                      const statusStyle = getStatusColor(refund.status);
                      return (
                        <TableRow key={refund.id} hover>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{refund.bookingNumber}</Typography>
                            <Typography variant="caption" color="text.secondary">{formatDate(refund.createdAt)}</Typography>
                          </TableCell>
                          <TableCell><Typography variant="body2">{refund.customerName}</Typography></TableCell>
                          <TableCell><Typography variant="body2">{refund.vendorName}</Typography></TableCell>
                          <TableCell><Typography variant="body2">{refund.listingTitle}</Typography></TableCell>
                          <TableCell>
                            <Typography variant="body1" sx={{ fontWeight: 700, color: '#0891B2' }}>{refund.amount.toFixed(2)}</Typography>
                            <Typography variant="caption" color="text.secondary">{refund.policyTierApplied}% tier</Typography>
                          </TableCell>
                          <TableCell><Typography variant="body2" sx={{ maxWidth: 200 }}>{refund.reason}</Typography></TableCell>
                          <TableCell>
                            <Chip label={refund.status} sx={{ bgcolor: statusStyle.bg, color: statusStyle.color, fontWeight: 600, fontSize: '0.75rem' }} />
                          </TableCell>
                          <TableCell>
                            {refund.status === 'Requested' && (
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button size="small" variant="contained" disabled={savingRefund}
                                  onClick={() => handleApprove(refund)}
                                  sx={{ textTransform: 'none', bgcolor: '#0891B2', '&:hover': { bgcolor: '#0E7490' } }}>
                                  Approve
                                </Button>
                                <Button size="small" variant="outlined" color="error" disabled={savingRefund}
                                  onClick={() => setRejectTarget(refund)}
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
            {!refundsLoading && refunds.length > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <Pagination count={refundTotalPages} page={refundPage} onChange={(_, v) => setRefundPage(v)} />
              </Box>
            )}
          </Paper>
        </>
      )}

      {mainTab === 1 && (
        <>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Tabs value={disputeTab} onChange={(_, val) => { setDisputeTab(val); setDisputePage(1); }}>
                {DISPUTE_TABS.map((label) => (
                  <Tab key={label} label={label} sx={{ textTransform: 'none', fontWeight: 500 }} />
                ))}
              </Tabs>
              <Button variant="contained" startIcon={<Add />} onClick={() => setRecordOpen(true)}
                sx={{ textTransform: 'none', bgcolor: '#0891B2', '&:hover': { bgcolor: '#0E7490' } }}>
                Record Dispute
              </Button>
            </Box>
          </Paper>

          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                    {['Booking', 'Customer', 'Vendor', 'Amount', 'Reason', 'Status', 'Opened', 'Actions'].map((col) => (
                      <TableCell key={col} sx={{ fontWeight: 600 }}>{col}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {disputesLoading ? (
                    <TableRow>
                      <TableCell colSpan={8}>
                        <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                          Loading disputes...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : disputes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8}>
                        <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                          No disputes found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    disputes.map((dispute) => {
                      const statusStyle = getStatusColor(dispute.status);
                      return (
                        <TableRow key={dispute.id} hover>
                          <TableCell><Typography variant="body2" sx={{ fontWeight: 600 }}>{dispute.bookingNumber}</Typography></TableCell>
                          <TableCell><Typography variant="body2">{dispute.customerName}</Typography></TableCell>
                          <TableCell><Typography variant="body2">{dispute.vendorName}</Typography></TableCell>
                          <TableCell>
                            <Typography variant="body1" sx={{ fontWeight: 700, color: '#0891B2' }}>{dispute.amount.toFixed(2)}</Typography>
                            {dispute.disputeFeeAmount != null && (
                              <Typography variant="caption" color="text.secondary">+{dispute.disputeFeeAmount.toFixed(2)} fee</Typography>
                            )}
                          </TableCell>
                          <TableCell><Typography variant="body2" sx={{ maxWidth: 200 }}>{dispute.reason}</Typography></TableCell>
                          <TableCell>
                            <Chip label={dispute.status} sx={{ bgcolor: statusStyle.bg, color: statusStyle.color, fontWeight: 600, fontSize: '0.75rem' }} />
                          </TableCell>
                          <TableCell><Typography variant="caption">{formatDate(dispute.openedAt)}</Typography></TableCell>
                          <TableCell>
                            {dispute.status === 'Opened' && (
                              <Button size="small" variant="contained" disabled={savingDispute}
                                onClick={() => { setResolveTarget(dispute); setResolveOutcome('Won'); }}
                                sx={{ textTransform: 'none', bgcolor: '#0891B2', '&:hover': { bgcolor: '#0E7490' } }}>
                                Resolve
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
            {!disputesLoading && disputes.length > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <Pagination count={disputeTotalPages} page={disputePage} onChange={(_, v) => setDisputePage(v)} />
              </Box>
            )}
          </Paper>
        </>
      )}

      {/* Reject Refund Dialog */}
      <Dialog open={!!rejectTarget} onClose={() => setRejectTarget(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Reject Refund
          <IconButton onClick={() => setRejectTarget(null)}><Close /></IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Rejecting the refund request for booking <strong>{rejectTarget?.bookingNumber}</strong> ({rejectTarget?.customerName}).
          </DialogContentText>
          <TextField
            fullWidth
            multiline
            minRows={2}
            label="Reason"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectTarget(null)} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button variant="contained" color="error" disabled={savingRefund || !rejectReason.trim()} onClick={handleRejectConfirm}
            sx={{ textTransform: 'none' }}>
            {savingRefund ? 'Rejecting...' : 'Reject Refund'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Resolve Dispute Dialog */}
      <Dialog open={!!resolveTarget} onClose={() => setResolveTarget(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Resolve Dispute
          <IconButton onClick={() => setResolveTarget(null)}><Close /></IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Resolving the dispute for booking <strong>{resolveTarget?.bookingNumber}</strong> ({resolveTarget?.customerName}).
          </DialogContentText>
          <FormControl fullWidth>
            <InputLabel>Outcome</InputLabel>
            <Select label="Outcome" value={resolveOutcome} onChange={(e) => setResolveOutcome(e.target.value as 'Won' | 'Lost' | 'Withdrawn')}>
              <MenuItem value="Won">Won — platform keeps the funds</MenuItem>
              <MenuItem value="Lost">Lost — funds stay charged back</MenuItem>
              <MenuItem value="Withdrawn">Withdrawn — customer withdrew the dispute</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResolveTarget(null)} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button variant="contained" disabled={savingDispute} onClick={handleResolveConfirm}
            sx={{ textTransform: 'none', bgcolor: '#0891B2', '&:hover': { bgcolor: '#0E7490' } }}>
            {savingDispute ? 'Saving...' : 'Confirm Outcome'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Record Dispute Dialog */}
      <Dialog open={recordOpen} onClose={() => setRecordOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Record a Dispute
          <IconButton onClick={() => setRecordOpen(false)}><Close /></IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Enter the details from the chargeback notification (there's no automatic detection yet — this is entered
            manually once the platform is notified externally).
          </DialogContentText>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField fullWidth label="Payment ID" value={recordPaymentId} onChange={(e) => setRecordPaymentId(e.target.value)} />
            <TextField fullWidth type="number" label="Amount" value={recordAmount} onChange={(e) => setRecordAmount(e.target.value)} />
            <TextField fullWidth multiline minRows={2} label="Reason" value={recordReason} onChange={(e) => setRecordReason(e.target.value)} />
            <TextField fullWidth type="number" label="Dispute fee (optional)" value={recordFee} onChange={(e) => setRecordFee(e.target.value)} />
            <TextField fullWidth label="External reference (optional)" value={recordReference} onChange={(e) => setRecordReference(e.target.value)} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRecordOpen(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button variant="contained" disabled={savingDispute || !recordPaymentId.trim() || !recordAmount || !recordReason.trim()}
            onClick={handleRecordSubmit}
            sx={{ textTransform: 'none', bgcolor: '#0891B2', '&:hover': { bgcolor: '#0E7490' } }}>
            {savingDispute ? 'Recording...' : 'Record Dispute'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DisputesRefundsPage;
