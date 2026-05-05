import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../../../layouts/AuthLayout/AuthLayout";
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Snackbar, Alert } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { login as loginRequest } from "../../../services/authService";
import { useAuth } from "../../../context/AuthContext"; // ✅ IMPORTANT

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginErrors {
  email?: string;
  password?: string;
}

function getAuthErrorMessage(error: unknown, fallback: string) {
  const response = error as {
    response?: {
      data?: {
        message?: unknown;
        title?: unknown;
        errors?: Record<string, unknown>;
      };
    };
  };

  const message = response?.response?.data?.message;
  if (typeof message === "string" && message.trim()) return message;

  const title = response?.response?.data?.title;
  if (typeof title === "string" && title.trim()) return title;

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

function Login(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();

  const { refreshUser } = useAuth();

  const nextPath = new URLSearchParams(location.search).get("next") ?? "";

  const isSafeRedirect = (path: string) => path.startsWith("/");

  const getRoleRedirect = (role?: string) => {
    const normalizedRole = String(role ?? "").toLowerCase();

    if (normalizedRole === "admin") return "/admin/dashboard";
    if (normalizedRole === "vendor") return "/vendor/dashboard";
    return "/";
  };

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<LoginErrors>({});
  const [loading, setLoading] = useState(false);
  const [successSnackbar, setSuccessSnackbar] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = (): LoginErrors => {
    const newErrors: LoginErrors = {};

    const email = formData.email.trim();
    const password = formData.password.trim();

    if (!email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
      newErrors.email = "Enter a valid email";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 8)
      newErrors.password = "Min 8 characters required";

    return newErrors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      setLoading(true);

      const authResponse = await loginRequest(formData.email.trim(), formData.password);

      const currentUser = await refreshUser();

      setSuccessSnackbar(true);

      setTimeout(() => {
        const role =
          currentUser?.role ??
          authResponse.role ??
          (typeof authResponse.user === "object" && authResponse.user
            ? String((authResponse.user as { role?: string }).role ?? "")
            : "");

        const roleRedirect = getRoleRedirect(role);
        const redirectTarget =
          isSafeRedirect(nextPath) && nextPath !== "/"
            ? nextPath
            : roleRedirect;

        navigate(redirectTarget, { replace: true });
      }, 800);
    } catch (error) {
      setErrorSnackbar(
        getAuthErrorMessage(error, "Login failed. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-card">
        <h2 className="title center">Welcome Back</h2>
        <p className="subtitle center">
          Sign in to continue
        </p>

        <form onSubmit={handleSubmit} noValidate>
          {/* EMAIL */}
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          {/* PASSWORD */}
          <div className="input-group">
            <label>Password</label>

            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "input-error" : ""}
              />

              <span onClick={() => setShowPassword((p) => !p)}>
                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </span>
            </div>

            {errors.password && (
              <p className="error-text">{errors.password}</p>
            )}
          </div>

          <div className="forgot center">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <button className="google-btn">
          <GoogleIcon sx={{ fontSize: 20 }} />
          Continue with Google
        </button>

        <p className="bottom-text">
          Don’t have an account?{" "}
          <Link
            to={
              isSafeRedirect(nextPath)
                ? `/register?next=${encodeURIComponent(nextPath)}`
                : "/register"
            }
          >
            Sign Up
          </Link>
        </p>

        {/* SUCCESS */}
        <Snackbar
          open={successSnackbar}
          autoHideDuration={2000}
          onClose={() => setSuccessSnackbar(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="success">Login Successful!</Alert>
        </Snackbar>

        {/* ERROR */}
        <Snackbar
          open={Boolean(errorSnackbar)}
          autoHideDuration={2500}
          onClose={() => setErrorSnackbar("")}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="error">{errorSnackbar}</Alert>
        </Snackbar>
      </div>
    </AuthLayout>
  );
}

export default Login;