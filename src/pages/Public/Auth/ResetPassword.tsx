import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../../layouts/AuthLayout/AuthLayout";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "../../../utils/validationSchemas";
import { resetPassword } from "../../../services/authService";

function ResetPassword(): JSX.Element {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      await resetPassword(email, token, data.newPassword);

      alert("Password reset successfully. You can now log in.");
      navigate("/login");
    } catch {
      alert("Unable to reset password. The link may be invalid or expired.");
    }
  };

  return (
    <AuthLayout>
      <div className="auth-card">
        <div style={{ marginBottom: "20px" }}>
          <Link to="/login" className="back-link">
            &larr; Back to login
          </Link>
        </div>

        <h2 className="title center">Reset password</h2>

        <p className="subtitle center">
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="input-group">
            <label>New Password</label>

            <input
              type="password"
              placeholder="Enter your new password"
              {...register("newPassword")}
              className={errors.newPassword ? "input-error" : ""}
            />

            {errors.newPassword && (
              <p className="error-text">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="input-group">
            <label>Confirm Password</label>

            <input
              type="password"
              placeholder="Confirm your new password"
              {...register("confirmPassword")}
              className={errors.confirmPassword ? "input-error" : ""}
            />

            {errors.confirmPassword && (
              <p className="error-text">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

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