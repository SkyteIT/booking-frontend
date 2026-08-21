import { zodResolver } from "@hookform/resolvers/zod";
import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/useAuth";
import ToastAlert from "../../../components/common/ToastAlert";
import AuthLayout from "../../../layouts/AuthLayout/AuthLayout";
import { register as registerUser, loginWithGoogle } from "../../../services/authService";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import {
  registerSchema,
  type RegisterFormData,
} from "../../../utils/validationSchemas";

function Register(): JSX.Element {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [error, setError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError("");
      const [firstName, ...rest] = data.name.trim().split(/\s+/);
      const lastName = rest.join(" ") || firstName;

      await registerUser({
        firstName,
        lastName,
        email: data.email,
        password: data.password,
      });

      await refreshUser();
      navigate("/", { replace: true });
    } catch (error) {
      setError(getApiErrorMessage(error, "Unable to create your account. Please try again."));
    }
  };

  const handleGoogleSignUp = async (credential?: string) => {
    if (!credential) {
      setError("Google sign-up failed. Please try again.");
      return;
    }

    try {
      setError("");
      await loginWithGoogle(credential);
      await refreshUser();
      navigate("/", { replace: true });
    } catch (error) {
      setError(getApiErrorMessage(error, "Google sign-up failed. Please try again."));
    }
  };

  return (
    <AuthLayout>
      <div className="auth-card">
        <h2 className="title center">Register</h2>
        <p className="subtitle center">Create your account to get started.</p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              {...register("name")}
              className={errors.name ? "input-error" : ""}
            />
            {errors.name && <p className="error-text">{errors.name.message}</p>}
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <p className="error-text">{errors.email.message}</p>}
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Create a password"
              {...register("password")}
              className={errors.password ? "input-error" : ""}
            />
            {errors.password && <p className="error-text">{errors.password.message}</p>}
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              {...register("confirmPassword")}
              className={errors.confirmPassword ? "input-error" : ""}
            />
            {errors.confirmPassword && (
              <p className="error-text">{errors.confirmPassword.message}</p>
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
            {isSubmitting ? "Creating account..." : "Register"}
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <GoogleLogin
            onSuccess={(credentialResponse) => handleGoogleSignUp(credentialResponse.credential)}
            onError={() => setError("Google sign-up failed. Please try again.")}
            width="320"
            shape="pill"
          />
        </div>

        <div style={{ marginTop: "16px", textAlign: "center" }}>
          <p className="subtitle">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>

      <ToastAlert
        open={!!error}
        onClose={() => setError("")}
        severity="error"
        message={error}
      />
    </AuthLayout>
  );
}

export default Register;
