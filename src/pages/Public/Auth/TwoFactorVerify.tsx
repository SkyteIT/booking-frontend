import { isAxiosError } from "axios";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/useAuth";
import AuthLayout from "../../../layouts/AuthLayout/AuthLayout";
import { verifyTwoFactorCode } from "../../../services/authService";
import { getRoleHomePath } from "../../../utils/roleHomePath";

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

function TwoFactorVerify(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshUser } = useAuth();
  const challengeToken = (location.state as { challengeToken?: string } | null)?.challengeToken;

  const [useBackupCode, setUseBackupCode] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!challengeToken) {
    return (
      <AuthLayout>
        <div className="auth-card">
          <h2 className="title center">Session expired</h2>
          <p className="subtitle center">Please log in again.</p>
          <div style={{ marginTop: "16px", textAlign: "center" }}>
            <Link to="/login" className="back-link">
              Back to login
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setSubmitting(true);
    setError("");
    try {
      await verifyTwoFactorCode(challengeToken, code.trim());
      const refreshed = await refreshUser();
      navigate(getRoleHomePath(refreshed?.role ?? ""), { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err) ?? "Invalid code. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-card">
        <h2 className="title center">Two-factor verification</h2>
        <p className="subtitle center">
          {useBackupCode
            ? "Enter one of your backup codes."
            : "Enter the 6-digit code from your authenticator app."}
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="input-group">
            <label>{useBackupCode ? "Backup code" : "Verification code"}</label>
            <input
              type="text"
              inputMode={useBackupCode ? "text" : "numeric"}
              maxLength={useBackupCode ? 10 : 6}
              placeholder={useBackupCode ? "ABCDEF1234" : "123456"}
              value={code}
              onChange={(e) =>
                setCode(
                  useBackupCode
                    ? e.target.value.toUpperCase().slice(0, 10)
                    : e.target.value.replace(/\D/g, "").slice(0, 6)
                )
              }
              className={error ? "input-error" : ""}
            />
          </div>

          {error && <p className="error-text">{error}</p>}

          <button
            type="submit"
            className="primary-btn"
            disabled={submitting || !code.trim()}
            style={{
              opacity: submitting || !code.trim() ? 0.7 : 1,
              cursor: submitting || !code.trim() ? "not-allowed" : "pointer",
            }}
          >
            {submitting ? "Verifying..." : "Verify"}
          </button>
        </form>

        <div style={{ marginTop: "16px", textAlign: "center" }}>
          <button
            type="button"
            className="back-link"
            style={{ background: "none", border: "none", cursor: "pointer" }}
            onClick={() => {
              setUseBackupCode((v) => !v);
              setCode("");
              setError("");
            }}
          >
            {useBackupCode ? "Use authenticator code instead" : "Use a backup code instead"}
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}

export default TwoFactorVerify;
