import { Alert, Box, Button, Chip, CircularProgress, Stack, TextField, Typography } from "@mui/material";
import { isAxiosError } from "axios";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import {
  confirmSelfServiceTwoFactorEnrollment,
  disableTwoFactor,
  getCurrentUser,
  startSelfServiceTwoFactorEnrollment,
} from "../../services/authService";

const inputSx = {
  "& .MuiInputLabel-root": {
    color: "text.secondary",
    "&.Mui-focused": { color: "text.primary" },
  },
};

const getApiErrorMessage = (error: unknown): string => {
  if (!isAxiosError(error)) return "Something went wrong.";
  const data = error.response?.data;
  if (typeof data === "string") return data;
  if (data && typeof data === "object") {
    return (data as { message?: string }).message ?? "Something went wrong.";
  }
  return "Something went wrong.";
};

type TwoFactorState =
  | { step: "loading" }
  | { step: "disabled" }
  | { step: "enrolling"; secret: string; otpAuthUri: string }
  | { step: "backupCodes"; codes: string[] }
  | { step: "enabled" }
  | { step: "disabling" };

// Self-service 2FA enroll/confirm/disable - shared between vendor and
// customer Settings since the backend endpoints are role-agnostic
// (driven by the authenticated session, not the account's role).
export default function TwoFactorSettings() {
  const [state, setState] = useState<TwoFactorState>({ step: "loading" });
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const loadStatus = async () => {
    try {
      const user = await getCurrentUser();
      setState({ step: user.twoFactorEnabled ? "enabled" : "disabled" });
    } catch {
      setState({ step: "disabled" });
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const handleStartEnroll = async () => {
    setBusy(true);
    setError("");
    try {
      const result = await startSelfServiceTwoFactorEnrollment();
      setState({ step: "enrolling", secret: result.secret, otpAuthUri: result.otpAuthUri });
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const handleConfirmEnroll = async () => {
    if (code.length !== 6) return;
    setBusy(true);
    setError("");
    try {
      const codes = await confirmSelfServiceTwoFactorEnrollment(code);
      setState({ step: "backupCodes", codes });
      setCode("");
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const handleDisable = async () => {
    if (!password) return;
    setBusy(true);
    setError("");
    try {
      await disableTwoFactor(password);
      setPassword("");
      setState({ step: "disabled" });
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  if (state.step === "loading") {
    return (
      <Box display="flex" justifyContent="center" py={2}>
        <CircularProgress size={20} />
      </Box>
    );
  }

  if (state.step === "backupCodes") {
    return (
      <Stack spacing={2}>
        <Alert severity="success">Two-factor authentication is now enabled.</Alert>
        <Typography variant="body2" color="text.secondary">
          Save these backup codes somewhere safe — each can be used once to sign in if you lose
          access to your authenticator app. They won't be shown again.
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 1,
            p: 2,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            fontFamily: "monospace",
            fontSize: 14,
          }}
        >
          {state.codes.map((c) => (
            <Box key={c}>{c}</Box>
          ))}
        </Box>
        <Button variant="contained" onClick={() => setState({ step: "enabled" })} sx={{ alignSelf: "flex-start" }}>
          Done
        </Button>
      </Stack>
    );
  }

  if (state.step === "enrolling") {
    return (
      <Stack spacing={2}>
        <Box display="flex" justifyContent="center">
          <QRCodeSVG value={state.otpAuthUri} size={160} />
        </Box>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Scan with your authenticator app, or enter this code manually:
        </Typography>
        <Typography variant="body2" textAlign="center" sx={{ fontFamily: "monospace", wordBreak: "break-all" }}>
          {state.secret}
        </Typography>
        <TextField
          label="6-digit code"
          size="small"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          sx={inputSx}
        />
        {error && <Alert severity="error">{error}</Alert>}
        <Stack direction="row" spacing={1}>
          <Button variant="contained" disabled={busy || code.length !== 6} onClick={handleConfirmEnroll}>
            Verify and enable
          </Button>
          <Button
            variant="text"
            disabled={busy}
            onClick={() => {
              setState({ step: "disabled" });
              setCode("");
              setError("");
            }}
          >
            Cancel
          </Button>
        </Stack>
      </Stack>
    );
  }

  if (state.step === "disabling") {
    return (
      <Stack spacing={2}>
        <Typography variant="body2" color="text.secondary">
          Enter your password to confirm disabling two-factor authentication.
        </Typography>
        <TextField
          label="Current password"
          type="password"
          size="small"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={inputSx}
        />
        {error && <Alert severity="error">{error}</Alert>}
        <Stack direction="row" spacing={1}>
          <Button variant="contained" color="error" disabled={busy || !password} onClick={handleDisable}>
            Disable 2FA
          </Button>
          <Button
            variant="text"
            disabled={busy}
            onClick={() => {
              setState({ step: "enabled" });
              setPassword("");
              setError("");
            }}
          >
            Cancel
          </Button>
        </Stack>
      </Stack>
    );
  }

  // enabled / disabled
  return (
    <Stack spacing={1.5}>
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Chip
          size="small"
          label={state.step === "enabled" ? "Enabled" : "Disabled"}
          color={state.step === "enabled" ? "success" : "default"}
        />
        <Typography variant="body2" color="text.secondary">
          {state.step === "enabled"
            ? "Your account requires a verification code at login."
            : "Add an extra step to protect your account when signing in."}
        </Typography>
      </Stack>
      {error && <Alert severity="error">{error}</Alert>}
      {state.step === "enabled" ? (
        <Button
          variant="outlined"
          color="error"
          size="small"
          sx={{ alignSelf: "flex-start" }}
          onClick={() => setState({ step: "disabling" })}
        >
          Disable
        </Button>
      ) : (
        <Button
          variant="contained"
          size="small"
          disabled={busy}
          sx={{ alignSelf: "flex-start" }}
          onClick={handleStartEnroll}
        >
          Enable two-factor authentication
        </Button>
      )}
    </Stack>
  );
}
