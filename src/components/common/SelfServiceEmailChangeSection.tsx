import { Alert, Button, Stack, TextField } from "@mui/material";
import { isAxiosError } from "axios";
import { useState } from "react";
import { requestEmailChange } from "../../services/authService";

const getApiErrorMessage = (error: unknown): string => {
  if (!isAxiosError(error)) return "Something went wrong.";
  const data = error.response?.data;
  if (typeof data === "string") return data;
  if (data && typeof data === "object") {
    return (data as { message?: string }).message ?? "Something went wrong.";
  }
  return "Something went wrong.";
};

// Self-service - unlike the staff EmailChangeRequest queue (which needs
// SuperAdmin approval), a non-privileged account's change only needs proof
// it owns the new inbox, so this just fires the request and waits for
// that click - no pending-request state to poll for. Shared by Customer
// and Vendor settings, the two roles this applies to.
export default function SelfServiceEmailChangeSection({ currentEmail }: { currentEmail: string }) {
  const [open, setOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState("");

  const handleSend = async () => {
    if (!newEmail.trim()) return;
    setSending(true);
    setError("");
    try {
      await requestEmailChange(newEmail.trim());
      setSent(newEmail.trim());
      setOpen(false);
      setNewEmail("");
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSending(false);
    }
  };

  return (
    <Stack spacing={1}>
      <TextField label="Email" size="small" value={currentEmail} disabled />
      {sent ? (
        <Alert severity="success" onClose={() => setSent("")}>
          Check <strong>{sent}</strong> for a link to confirm the change.
        </Alert>
      ) : open ? (
        <Stack spacing={1.5} sx={{ p: 1.5, borderRadius: 1.5, border: "1px solid", borderColor: "divider" }}>
          <TextField
            label="New email"
            size="small"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          {error && <Alert severity="error">{error}</Alert>}
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="contained"
              disabled={sending || !newEmail.trim()}
              onClick={handleSend}
              sx={{ textTransform: "none" }}
            >
              {sending ? "Sending..." : "Send confirmation link"}
            </Button>
            <Button size="small" onClick={() => { setOpen(false); setError(""); }} sx={{ textTransform: "none" }}>
              Cancel
            </Button>
          </Stack>
        </Stack>
      ) : (
        <Button
          size="small"
          variant="text"
          onClick={() => setOpen(true)}
          sx={{ textTransform: "none", fontWeight: 500, alignSelf: "flex-start" }}
        >
          Change email
        </Button>
      )}
    </Stack>
  );
}
