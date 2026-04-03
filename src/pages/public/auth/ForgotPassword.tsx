import { Link } from "react-router-dom";
import { useState } from "react";
import AuthLayout from "../../../layouts/AuthLayout/AuthLayout";
import type { ChangeEvent, FormEvent } from "react";

function ForgotPassword(): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const validateEmail = (value: string): string => {
    const trimmedEmail = value.trim();

    if (!trimmedEmail) {
      return "Email is required";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmedEmail)) {
      return "Enter a valid email address";
    }

    return "";
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setEmail(value);

    // Clear error while typing
    if (error) {
      setError("");
    }

    if (message) {
      setMessage("");
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (loading) return;

    setError("");
    setMessage("");

    const validationError = validateEmail(email);

    if (validationError) {
      setError(validationError);
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

        <form onSubmit={handleSubmit} noValidate>
          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleChange}
              className={error ? "input-error" : ""}
            />

            {error && <p className="error-text">{error}</p>}
            {message && <p className="success-text">{message}</p>}
          </div>

          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
            style={{
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Sending..." : "Reset Password"}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}

export default ForgotPassword;