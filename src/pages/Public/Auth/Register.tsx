import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { isAxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../../layouts/AuthLayout/AuthLayout";
import { useAuth } from "../../../context/useAuth";
import { register as registerUser } from "../../../services/authService";
import {
  registerSchema,
  type RegisterFormData,
} from "../../../utils/validationSchemas";

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
      setError(getApiErrorMessage(error) ?? "Unable to create your account. Please try again.");
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
            {isSubmitting ? "Creating account..." : "Register"}
          </button>
        </form>

        <div style={{ marginTop: "16px", textAlign: "center" }}>
          <p className="subtitle">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}

export default Register;
