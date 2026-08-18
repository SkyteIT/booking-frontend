import { zodResolver } from "@hookform/resolvers/zod";
import { GoogleLogin } from "@react-oauth/google";
import { isAxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/useAuth";
import AuthLayout from "../../../layouts/AuthLayout/AuthLayout";
import { login, loginWithGoogle } from "../../../services/authService";
import { loginSchema, type LoginFormData } from "../../../utils/validationSchemas";

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

function Login(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshUser } = useAuth();
  const [error, setError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError("");
      const response = (await login(data.email, data.password)) as {
        role?: string;
        user?: { role?: string };
        requiresTwoFactor?: boolean;
        requiresEnrollment?: boolean;
        challengeToken?: string;
      };

      if (response.requiresTwoFactor) {
        navigate(response.requiresEnrollment ? "/2fa-enroll" : "/2fa-verify", {
          state: { challengeToken: response.challengeToken },
        });
        return;
      }

      await refreshUser();

      const next = new URLSearchParams(location.search).get("next");
      if (next) {
        navigate(next, { replace: true });
        return;
      }

      const role = String(response.role ?? response.user?.role ?? "").toLowerCase();

      if (role === "admin") {
        navigate("/admin/dashboard", { replace: true });
        return;
      }

      if (role === "vendor") {
        navigate("/vendor/dashboard", { replace: true });
        return;
      }

      navigate("/", { replace: true });
    } catch (error) {
      setError(getApiErrorMessage(error) ?? "Invalid email or password.");
    }
  };

  const handleGoogleLogin = async (credential?: string) => {
    if (!credential) {
      setError("Google login failed. Please try again.");
      return;
    }

    try {
      setError("");
      const response = await loginWithGoogle(credential);

      if (response.requiresTwoFactor) {
        navigate(response.requiresEnrollment ? "/2fa-enroll" : "/2fa-verify", {
          state: { challengeToken: response.challengeToken },
        });
        return;
      }

      await refreshUser();

      const next = new URLSearchParams(location.search).get("next");
      if (next) {
        navigate(next, { replace: true });
        return;
      }

      const role = String(response.role ?? "").toLowerCase();
      if (role === "admin") {
        navigate("/admin/dashboard", { replace: true });
        return;
      }
      if (role === "vendor") {
        navigate("/vendor/dashboard", { replace: true });
        return;
      }
      navigate("/", { replace: true });
    } catch (error) {
      setError(getApiErrorMessage(error) ?? "Google login failed. Please try again.");
    }
  };

  return (
    <AuthLayout>
      <div className="auth-card">
        <h2 className="title center">Login</h2>
        <p className="subtitle center">Sign in to continue.</p>

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
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              {...register("password")}
              className={errors.password ? "input-error" : ""}
            />
            {errors.password && <p className="error-text">{errors.password.message}</p>}
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
            {isSubmitting ? "Signing in..." : "Login"}
          </button>
        </form>

        <div style={{ margin: "16px 0", textAlign: "center", color: "#888" }}>OR</div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <GoogleLogin
            onSuccess={(credentialResponse) => handleGoogleLogin(credentialResponse.credential)}
            onError={() => setError("Google login failed. Please try again.")}
          />
        </div>

        <div style={{ marginTop: "16px", textAlign: "center" }}>
          <Link to="/forgot-password" className="back-link">
            Forgot password?
          </Link>
          <p className="subtitle" style={{ marginTop: "12px" }}>
            Don&apos;t have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}

export default Login;
