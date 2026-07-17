import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../../../layouts/AuthLayout/AuthLayout";
import { login } from "../../../services/authService";
import { loginSchema, type LoginFormData } from "../../../utils/validationSchemas";

function Login(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
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
      await login(data.email, data.password);

      const next = new URLSearchParams(location.search).get("next");
      navigate(next || "/", { replace: true });
    } catch {
      setError("Invalid email or password.");
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
