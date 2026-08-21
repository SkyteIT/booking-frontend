import { zodResolver } from "@hookform/resolvers/zod";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

      sessionStorage.setItem("pendingVerificationEmail", data.email);
      navigate("/check-email", {
        replace: true,
        state: { email: data.email },
      });
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
            <div className="password-wrapper styled">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                {...register("password")}
                className={errors.password ? "input-error" : ""}
              />
              <span className="eye-icon" onClick={() => setShowPassword((p) => !p)}>
                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </span>
            </div>
            {errors.password && <p className="error-text">{errors.password.message}</p>}
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <div className="password-wrapper styled">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                {...register("confirmPassword")}
                className={errors.confirmPassword ? "input-error" : ""}
              />
              <span className="eye-icon" onClick={() => setShowConfirmPassword((p) => !p)}>
                {showConfirmPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </span>
            </div>
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
          <span>OR CONTINUE WITH</span>
        </div>

        <div className="google-login-container">
          <GoogleLogin
            onSuccess={(credentialResponse) => handleGoogleSignUp(credentialResponse.credential)}
            onError={() => setError("Google sign-up failed. Please try again.")}
            text="signup_with"
            width="400"
          />
        </div>

        <p className="bottom-text">
          Already have an account?{" "}
          <Link to="/login" className="bold-link">
            Sign in
          </Link>
        </p>
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
