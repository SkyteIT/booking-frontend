import { zodResolver } from "@hookform/resolvers/zod";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Snackbar, Alert } from "@mui/material";
import { GoogleLogin } from "@react-oauth/google";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/useAuth";
import AuthLayout from "../../../layouts/AuthLayout/AuthLayout";
import { register as registerRequest, loginWithGoogle } from "../../../services/authService";
import { registerSchema, type RegisterFormData } from "../../../utils/validationSchemas";

function getAuthErrorMessage(error: unknown, fallback: string) {
  const response = error as { response?: { data?: { message?: unknown; title?: unknown; errors?: Record<string, unknown> } } };
  const message = response?.response?.data?.message;

  if (typeof message === "string" && message.trim()) {
    return message;
  }

  const title = response?.response?.data?.title;
  if (typeof title === "string" && title.trim()) {
    return title;
  }

  const errors = response?.response?.data?.errors;
  if (errors && typeof errors === "object") {
    return Object.values(errors)
      .flat()
      .map(String)
      .filter(Boolean)
      .join(" ") || fallback;
  }

  return error instanceof Error ? error.message || fallback : fallback;
}

function splitFullName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return { firstName: "", lastName: "" };
  }

  if (parts.length === 1) {
    return { firstName: parts[0], lastName: "" };
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

function Register(): JSX.Element {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  useEffect(() => {
    window.history.replaceState(null, "", "/register");

    const handlePopState = () => {
      navigate("/", { replace: true });
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [navigate]);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [successSnackbar, setSuccessSnackbar] = useState<boolean>(false);
  const [errorSnackbar, setErrorSnackbar] = useState<string>("");

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
      const { firstName, lastName } = splitFullName(data.name);
      const response = await registerRequest({
        firstName,
        lastName,
        email: data.email,
        password: data.password,
      });

      setSuccessSnackbar(true);

      setTimeout(() => {
        navigate(
          String(response?.role ?? "").toLowerCase() === "vendor"
            ? "/vendor/dashboard"
            : "/customer/dashboard",
          { replace: true }
        );
      }, 900);
    } catch (error) {
      setErrorSnackbar(getAuthErrorMessage(error, "Registration failed. Please try again."));
    }
  };

  const handleGoogleSignUp = async (credential?: string) => {
    if (!credential) {
      setErrorSnackbar("Google sign-up failed. Please try again.");
      return;
    }

    try {
      const authResponse = await loginWithGoogle(credential);
      const currentUser = await refreshUser();

      setSuccessSnackbar(true);

      setTimeout(() => {
        const role = currentUser?.role ?? authResponse.role;
        navigate(
          String(role ?? "").toLowerCase() === "vendor"
            ? "/vendor/dashboard"
            : "/customer/dashboard",
          { replace: true }
        );
      }, 900);
    } catch (error) {
      setErrorSnackbar(
        getAuthErrorMessage(error, "Google sign-up failed. Please try again.")
      );
    }
  };

  return (
    <AuthLayout>
      <div className="auth-card">
        <h2 className="title center">Create Account</h2>
        <p className="subtitle center">
          Please fill in the details to create your account.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Full Name */}
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

          {/* Email */}
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

          {/* Password */}
          <div className="input-group password-group">
            <label>Password</label>
            <div className="password-wrapper styled">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password")}
                className={errors.password ? "input-error" : ""}
              />
              <span className="eye-icon" onClick={() => setShowPassword(prev => !prev)}>
                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </span>
            </div>
            {errors.password && <p className="error-text">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div className="input-group password-group">
            <label>Confirm Password</label>
            <div className="password-wrapper styled">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                {...register("confirmPassword")}
                className={errors.confirmPassword ? "input-error" : ""}
              />
              <span
                className="eye-icon"
                onClick={() => setShowConfirmPassword(prev => !prev)}
              >
                {showConfirmPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </span>
            </div>
            {errors.confirmPassword && (
              <p className="error-text">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button type="submit" className="primary-btn" disabled={isSubmitting}>
            {isSubmitting ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="divider">
          <span>OR CONTINUE WITH</span>
        </div>

        <div className="google-login-container">
          <GoogleLogin
            onSuccess={(credentialResponse) =>
              handleGoogleSignUp(credentialResponse.credential)
            }
            onError={() => setErrorSnackbar("Google sign-up failed. Please try again.")}
            width="400"
          />
        </div>

        <p className="bottom-text">
          Already have an account?{" "}
          <Link to="/login" className="bold-link">
            Sign in
          </Link>
        </p>

        {/* ✅ Success Snackbar */}
        <Snackbar
          open={successSnackbar}
          autoHideDuration={2000}
          onClose={() => setSuccessSnackbar(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="success" sx={{ width: "100%" }}>
            Registration Successful!
          </Alert>
        </Snackbar>

        <Snackbar
          open={Boolean(errorSnackbar)}
          autoHideDuration={2500}
          onClose={() => setErrorSnackbar("")}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="error" sx={{ width: "100%" }} onClose={() => setErrorSnackbar("")}>
            {errorSnackbar}
          </Alert>
        </Snackbar>
      </div>
    </AuthLayout>
  );
}


export default Register;