import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AuthLayout from "../../../layouts/AuthLayout/AuthLayout";
import { verifyEmail } from "../../../services/authService";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";

type Status = "verifying" | "success" | "error";

function VerifyEmail(): JSX.Element {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<Status>(token ? "verifying" : "error");
  const [error, setError] = useState(token ? "" : "This verification link is missing or invalid.");
  const ranOnce = useRef(false);

  useEffect(() => {
    if (!token || ranOnce.current) return;
    ranOnce.current = true;

    verifyEmail(token)
      .then(() => {
        sessionStorage.removeItem("pendingVerificationEmail");
        setStatus("success");
      })
      .catch((err) => {
        setStatus("error");
        setError(getApiErrorMessage(err, "Failed to verify email. The link may have expired."));
      });
  }, [token]);

  return (
    <AuthLayout>
      <div className="auth-card email-status-card">
        {status === "verifying" && (
          <>
            <h2 className="title center">Verifying your email...</h2>
            <p className="subtitle center">Please wait a moment.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="email-status-icon success" aria-hidden="true">
              <CheckCircleOutlineIcon />
            </div>
            <h2 className="title center">Email verified</h2>
            <p className="subtitle center">Your account is ready. You can now sign in.</p>
            <div className="email-action-wrap">
              <Link to="/login" className="primary-btn email-action-button">
                Continue to login
              </Link>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <div className="email-status-icon error" aria-hidden="true">
              <ErrorOutlineIcon />
            </div>
            <h2 className="title center">Verification failed</h2>
            <p className="subtitle center">{error}</p>
            <div style={{ marginTop: "16px", textAlign: "center" }}>
              <Link to="/login" className="back-link">
                Back to login
              </Link>
            </div>
          </>
        )}
      </div>
    </AuthLayout>
  );
}

export default VerifyEmail;
