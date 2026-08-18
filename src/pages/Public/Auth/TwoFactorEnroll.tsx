import { isAxiosError } from "axios";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/useAuth";
import AuthLayout from "../../../layouts/AuthLayout/AuthLayout";
import {
  startTwoFactorEnrollment,
  confirmTwoFactorEnrollment,
} from "../../../services/authService";

const getApiErrorMessage = (error: unknown): string | undefined => {
  if (!isAxiosError(error)) return undefined;

  const data = error.response?.data;
  if (!data) return error.message;

  if (typeof data === "string") return data;
  if (typeof data === "object") {
    return (
      (data as { message?: string; error?: string; detail?: string }).message ??
      (data as { message?: string; error?: string; detail?: string }).error ??
      (data as { message?: string; error?: string; detail?: string }).detail ??
      JSON.stringify(data)
    );
  }

  return error.message;
};

function TwoFactorEnroll(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshUser } = useAuth();
  const challengeToken = (location.state as { challengeToken?: string } | null)?.challengeToken;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [secret, setSecret] = useState("");
  const [otpAuthUri, setOtpAuthUri] = useState("");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null);
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    if (!challengeToken) return;

    startTwoFactorEnrollment(challengeToken)
      .then((result) => {
        setSecret(result.secret);
        setOtpAuthUri(result.otpAuthUri);
      })
      .catch((err) => setError(getApiErrorMessage(err) ?? "Failed to start enrollment."))
      .finally(() => setLoading(false));
  }, [challengeToken]);

  const handleConfirm = async () => {
    if (!challengeToken || code.length !== 6) return;

    setSubmitting(true);
    setError("");
    try {
      const result = await confirmTwoFactorEnrollment(challengeToken, code);
      setBackupCodes(result.backupCodes);
    } catch (err) {
      setError(getApiErrorMessage(err) ?? "Invalid code. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const finishAndRedirect = async () => {
    await refreshUser();
    // Finance doesn't have its own frontend route/RoleGate support yet
    // (separate, pre-existing roadmap gap) - admin dashboard is the only
    // real destination available today for either privileged role.
    navigate("/admin/dashboard", { replace: true });
  };

  if (!challengeToken) {
    return (
      <AuthLayout>
        <div className="auth-card">
          <h2 className="title center">Session expired</h2>
          <p className="subtitle center">Please log in again to set up two-factor authentication.</p>
          <div style={{ marginTop: "16px", textAlign: "center" }}>
            <Link to="/login" className="back-link">
              Back to login
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  if (backupCodes) {
    return (
      <AuthLayout>
        <div className="auth-card">
          <h2 className="title center">Save your backup codes</h2>
          <p className="subtitle center">
            Each code can be used once to sign in if you lose access to your authenticator app.
            Save these somewhere safe — they won't be shown again.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px",
              margin: "16px 0",
              padding: "16px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontFamily: "monospace",
              fontSize: "14px",
            }}
          >
            {backupCodes.map((c) => (
              <div key={c}>{c}</div>
            ))}
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
            />
            I've saved these backup codes
          </label>

          <button
            type="button"
            className="primary-btn"
            disabled={!acknowledged}
            onClick={finishAndRedirect}
            style={{
              opacity: acknowledged ? 1 : 0.7,
              cursor: acknowledged ? "pointer" : "not-allowed",
            }}
          >
            Continue
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="auth-card">
        <h2 className="title center">Set up two-factor authentication</h2>
        <p className="subtitle center">
          Admin and finance accounts require an authenticator app (like Google Authenticator or
          Authy) for extra security.
        </p>

        {loading ? (
          <p className="subtitle center">Loading...</p>
        ) : (
          <>
            {otpAuthUri && (
              <div style={{ display: "flex", justifyContent: "center", margin: "16px 0" }}>
                <QRCodeSVG value={otpAuthUri} size={180} />
              </div>
            )}

            <p className="subtitle center" style={{ fontSize: "13px" }}>
              Can't scan? Enter this code manually:
            </p>
            <p
              className="subtitle center"
              style={{ fontFamily: "monospace", fontSize: "14px", wordBreak: "break-all" }}
            >
              {secret}
            </p>

            <div className="input-group">
              <label>Enter the 6-digit code from your app</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              />
            </div>

            {error && <p className="error-text">{error}</p>}

            <button
              type="button"
              className="primary-btn"
              disabled={submitting || code.length !== 6}
              onClick={handleConfirm}
              style={{
                opacity: submitting || code.length !== 6 ? 0.7 : 1,
                cursor: submitting || code.length !== 6 ? "not-allowed" : "pointer",
              }}
            >
              {submitting ? "Verifying..." : "Verify and enable"}
            </button>
          </>
        )}
      </div>
    </AuthLayout>
  );
}

export default TwoFactorEnroll;
