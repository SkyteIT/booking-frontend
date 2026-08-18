import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "../../../layouts/AuthLayout/AuthLayout";
import { resetPassword } from "../../../services/authService";
import { resetPasswordSchema, type ResetPasswordFormData } from "../../../utils/validationSchemas";

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

function ResetPassword(): JSX.Element {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return;

    try {
      setError("");
      await resetPassword(token, data.newPassword);
      setSuccess(true);
      setTimeout(() => navigate("/login", { replace: true }), 2000);
    } catch (err) {
      setError(getApiErrorMessage(err) ?? "Failed to reset password. The link may have expired.");
    }
  };

  if (!token) {
    return (
      <AuthLayout>
        <div className="auth-card">
          <h2 className="title center">Invalid reset link</h2>
          <p className="subtitle center">
            This password reset link is missing or invalid. Please request a new one.
          </p>
          <div style={{ marginTop: "16px", textAlign: "center" }}>
            <Link to="/forgot-password" className="back-link">
              Request a new reset link
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  if (success) {
    return (
      <AuthLayout>
        <div className="auth-card">
          <h2 className="title center">Password reset successful</h2>
          <p className="subtitle center">
            Redirecting you to login...
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="auth-card">
        <div style={{ marginBottom: "20px" }}>
          <Link to="/login" className="back-link">
            &larr; Back to login
          </Link>
        </div>

        <h2 className="title center">Reset your password</h2>
        <p className="subtitle center">Choose a new password for your account.</p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="input-group">
            <label>New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              {...register("newPassword")}
              className={errors.newPassword ? "input-error" : ""}
            />
            {errors.newPassword && <p className="error-text">{errors.newPassword.message}</p>}
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              {...register("confirmPassword")}
              className={errors.confirmPassword ? "input-error" : ""}
            />
            {errors.confirmPassword && <p className="error-text">{errors.confirmPassword.message}</p>}
          </div>

          {error && <p className="error-text">{error}</p>}

          <button
            type="submit"
            className="primary-btn"
            disabled={isSubmitting}
            style={{
              opacity: isSubmitting ? 0.7 : 1,
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}

export default ResetPassword;
