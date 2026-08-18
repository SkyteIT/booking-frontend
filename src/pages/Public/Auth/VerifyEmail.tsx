import { isAxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AuthLayout from "../../../layouts/AuthLayout/AuthLayout";
import { verifyEmail } from "../../../services/authService";

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
      .then(() => setStatus("success"))
      .catch((err) => {
        setStatus("error");
        setError(getApiErrorMessage(err) ?? "Failed to verify email. The link may have expired.");
      });
  }, [token]);

  return (
    <AuthLayout>
      <div className="auth-card">
        {status === "verifying" && (
          <>
            <h2 className="title center">Verifying your email...</h2>
            <p className="subtitle center">Please wait a moment.</p>
          </>
        )}

        {status === "success" && (
          <>
            <h2 className="title center">Email verified</h2>
            <p className="subtitle center">Your email has been verified successfully.</p>
            <div style={{ marginTop: "16px", textAlign: "center" }}>
              <Link to="/login" className="back-link">
                Continue to login
              </Link>
            </div>
          </>
        )}

        {status === "error" && (
          <>
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
