import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Link, useLocation } from "react-router-dom";
import AuthLayout from "../../../layouts/AuthLayout/AuthLayout";

type CheckEmailLocationState = {
  email?: string;
};

const inboxUrls: Record<string, string> = {
  "gmail.com": "https://mail.google.com/",
  "googlemail.com": "https://mail.google.com/",
  "outlook.com": "https://outlook.live.com/mail/",
  "hotmail.com": "https://outlook.live.com/mail/",
  "live.com": "https://outlook.live.com/mail/",
  "yahoo.com": "https://mail.yahoo.com/",
  "icloud.com": "https://www.icloud.com/mail/",
};

function CheckEmail(): JSX.Element {
  const location = useLocation();
  const state = location.state as CheckEmailLocationState | null;
  const email = state?.email ?? sessionStorage.getItem("pendingVerificationEmail") ?? "";
  const domain = email.split("@")[1]?.toLowerCase();
  const inboxUrl = (domain && inboxUrls[domain]) || "mailto:";

  return (
    <AuthLayout>
      <div className="auth-card email-status-card">
        <div className="email-status-icon" aria-hidden="true">
          <EmailOutlinedIcon />
        </div>
        <h2 className="title center">Verify your email</h2>
        <p className="subtitle center">
          We sent a verification link{email ? " to" : " to your email address"}.
        </p>
        {email && <p className="verification-email">{email}</p>}
        <p className="verification-help">
          Open the email and select <strong>Verify email</strong> to activate your account.
        </p>

        <a
          className="primary-btn email-action-button"
          href={inboxUrl}
          target="_blank"
          rel="noreferrer"
        >
          Go to my email <OpenInNewIcon fontSize="small" />
        </a>

        <p className="verification-note">
          Didn&apos;t see it? Check your spam or junk folder. The email may take a few minutes to
          arrive.
        </p>
        <Link to="/login" className="back-link email-back-link">
          Back to login
        </Link>
      </div>
    </AuthLayout>
  );
}

export default CheckEmail;
