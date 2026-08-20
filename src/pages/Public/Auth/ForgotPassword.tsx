import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import AuthLayout from "../../../layouts/AuthLayout/AuthLayout";
import { requestPasswordReset } from "../../../services/authService";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "../../../utils/validationSchemas";

function ForgotPassword(): JSX.Element {
  const [message, setMessage] = useState<string>("");
  const [isError, setIsError] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsError(false);
      // Backend always returns the same generic response whether or not the
      // email is registered — never used to tell the user which is true.
      await requestPasswordReset(data.email);
      setMessage("If that email is registered, a password reset link has been sent.");
      reset();
    } catch (error) {
      setIsError(true);
      setMessage(getApiErrorMessage(error, "Failed to send reset link. Please try again."));
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

        <h2 className="title center">Forgot password?</h2>
        <p className="subtitle center">
          No worries, we'll send you reset instructions.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className={errors.email ? "input-error" : ""}
            />

            {errors.email && <p className="error-text">{errors.email.message}</p>}
            {message && <p className={isError ? "error-text" : "success-text"}>{message}</p>}
          </div>

          <button
            type="submit"
            className="primary-btn"
            disabled={isSubmitting}
            style={{
              opacity: isSubmitting ? 0.7 : 1,
              cursor: isSubmitting ? "not-allowed" : "pointer"
            }}
          >
            {isSubmitting ? "Sending..." : "Reset Password"}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}

export default ForgotPassword;