import { Link } from "react-router-dom";
import { useState } from "react";
import AuthLayout from "../../../layouts/AuthLayout/AuthLayout";
import type { ChangeEvent, FormEvent } from "react";



function ForgotPassword(): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!email) {
      setError("Email is required");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setMessage("Password reset link sent to your email ✅");
      setEmail("");
    }, 1500);
  };

  return (
    <AuthLayout>
      <div className="auth-card">
        <div style={{ marginBottom: "20px" }}>
          <Link to="/login" className="back-link">
            &larr; Back to login
          </Link>
        </div>

        <h2 className="title center">Forgot password?</h2>
        <p className="subtitle center">
          No worries, we'll send you reset instructions.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              className={error ? "input-error" : ""}
            />
            {error && <p className="error-text">{error}</p>}
            {message && <p className="success-text">{message}</p>}
          </div>

          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
          >
            {loading ? "Sending..." : "Reset Password"}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}

export default ForgotPassword;
