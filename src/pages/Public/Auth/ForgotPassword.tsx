import { Link } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthLayout from "../../../layouts/AuthLayout/AuthLayout";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "../../../utils/validationSchemas";

function ForgotPassword(): JSX.Element {
  const [message, setMessage] = useState<string>("");

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
      // TODO: Call your forgot password API endpoint when backend is ready
      // await api.post("/api/auth/forgot-password", { email: data.email });
      
      setMessage(`Password reset link sent to ${data.email} ✅`);
      reset();
    } catch {
      setMessage("Failed to send reset link. Please try again.");
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
            {message && <p className="success-text">{message}</p>}
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