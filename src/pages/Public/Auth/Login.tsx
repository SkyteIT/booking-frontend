import { zodResolver } from "@hookform/resolvers/zod";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/useAuth"; // ✅ IMPORTANT
import ToastAlert from "../../../components/common/ToastAlert";
import AuthLayout from "../../../layouts/AuthLayout/AuthLayout";
import { login as loginRequest, loginWithGoogle } from "../../../services/authService";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { loginSchema, type LoginFormData } from "../../../utils/validationSchemas";

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
  const [successSnackbar, setSuccessSnackbar] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const redirectAfterLogin = (role?: string) => {
    const roleRedirect = getRoleRedirect(role);
    const redirectTarget =
      isSafeRedirect(nextPath) && nextPath !== "/" ? nextPath : roleRedirect;

    navigate(redirectTarget, { replace: true });
  };

  const onSubmit = async (data: LoginFormData) => {
    setError("");
    try {
      const authResponse = await loginRequest(data.email, data.password);

      // Admin/Finance accounts get a 2FA challenge instead of real tokens -
      // route to enrollment (first time) or verification, not the normal
      // post-login redirect.
      if (authResponse.requiresTwoFactor) {
        navigate(authResponse.requiresEnrollment ? "/2fa-enroll" : "/2fa-verify", {
          state: { challengeToken: authResponse.challengeToken },
        });
        return;
      }

      const currentUser = await refreshUser();

      if (!currentUser) {
        setError("Unable to load your account. Please try signing in again.");
        return;
      }

      setSuccessSnackbar(true);

      setTimeout(() => {
        const role =
          currentUser?.role ??
          authResponse.role ??
          (typeof authResponse.user === "object" && authResponse.user
            ? String((authResponse.user as { role?: string }).role ?? "")
            : "");

        redirectAfterLogin(role);
      }, 800);
    } catch (error) {
      setError(getApiErrorMessage(error, "Login failed. Please try again."));
    }
  };

  const handleGoogleLogin = async (credential?: string) => {
    setError("");
    if (!credential) {
      setError("Google login failed. Please try again.");
      return;
    }

    try {
      const authResponse = await loginWithGoogle(credential);

      if (authResponse.requiresTwoFactor) {
        navigate(authResponse.requiresEnrollment ? "/2fa-enroll" : "/2fa-verify", {
          state: { challengeToken: authResponse.challengeToken },
        });
        return;
      }

      const currentUser = await refreshUser();

      if (!currentUser) {
        setError("Unable to load your account. Please try signing in again.");
        return;
      }

      setSuccessSnackbar(true);

      setTimeout(() => {
        redirectAfterLogin(currentUser?.role ?? authResponse.role);
      }, 800);
    } catch (error) {
      setError(getApiErrorMessage(error, "Google login failed. Please try again."));
    }
  };

  return (
    <AuthLayout>
      <div className="auth-card">
        <h2 className="title center">Welcome Back</h2>
        <p className="subtitle center">
          Sign in to continue
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* EMAIL */}
          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter email"
              autoComplete="email"
              {...register("email")}
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <p className="error-text">{errors.email.message}</p>}
          </div>

          {/* PASSWORD */}
          <div className="input-group">
            <label>Password</label>

            <div className="password-wrapper styled">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                autoComplete="current-password"
                {...register("password")}
                className={errors.password ? "input-error" : ""}
              />

              <span className="eye-icon" onClick={() => setShowPassword((p) => !p)}>
                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </span>
            </div>

            {errors.password && (
              <p className="error-text">{errors.password.message}</p>
            )}
          </div>

          <div className="forgot center">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button
            type="submit"
            className="primary-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="divider">
          <span>OR CONTINUE WITH</span>
        </div>

        <div className="google-login-container">
          <GoogleLogin
            onSuccess={(credentialResponse: { credential?: string }) =>
              handleGoogleLogin(credentialResponse.credential)
            }
            onError={() => setError("Google login failed. Please try again.")}
            width="320"
            shape="pill"
          />
        </div>

        <p className="bottom-text">
          Don’t have an account?{" "}
          <Link
            to={
              isSafeRedirect(nextPath)
                ? `/register?next=${encodeURIComponent(nextPath)}`
                : "/register"
            }
            className="bold-link"
          >
            Sign Up
          </Link>
        </p>

        <ToastAlert
          open={successSnackbar}
          onClose={() => setSuccessSnackbar(false)}
          severity="success"
          duration={20000}
          message="Login successful!"
        />

        <ToastAlert
          open={!!error}
          onClose={() => setError("")}
          severity="error"
          message={error}
        />
      </div>
    </AuthLayout>
  );
}

export default Login;
