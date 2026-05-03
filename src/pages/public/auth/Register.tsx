import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../../layouts/AuthLayout/AuthLayout";
import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Snackbar, Alert } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { register as registerRequest } from "../../../services/authService";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

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
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [successSnackbar, setSuccessSnackbar] = useState<boolean>(false);
  const [errorSnackbar, setErrorSnackbar] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const validate = (): RegisterErrors => {
    const newErrors: RegisterErrors = {};
    const name = formData.name.trim();
    const email = formData.email.trim();
    const password = formData.password.trim();
    const confirmPassword = formData.confirmPassword.trim();

    if (!name) newErrors.name = "Full name is required";
    else if (name.length < 3) newErrors.name = "Name must be at least 3 characters";
    else if (name.split(/\s+/).filter(Boolean).length < 2)
      newErrors.name = "Please enter both first and last name";

    if (!email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
      newErrors.email = "Enter a valid email address";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 8) newErrors.password = "Password must be at least 8 characters";
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password))
      newErrors.password = "Password must contain uppercase, lowercase and a number";

    if (!confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    return newErrors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (loading) return;

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        setLoading(true);
        const { firstName, lastName } = splitFullName(formData.name);
        const response = await registerRequest({
          firstName,
          lastName,
          email: formData.email.trim(),
          password: formData.password,
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
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <AuthLayout>
      <div className="auth-card">
        <h2 className="title center">Create Account</h2>
        <p className="subtitle center">
          Please fill in the details to create your account.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          {/* Full Name */}
          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "input-error" : ""}
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>

          {/* Email */}
          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="input-group password-group">
            <label>Password</label>
            <div className="password-wrapper styled">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "input-error" : ""}
              />
              <span className="eye-icon" onClick={() => setShowPassword(prev => !prev)}>
                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </span>
            </div>
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="input-group password-group">
            <label>Confirm Password</label>
            <div className="password-wrapper styled">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
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
              <p className="error-text">{errors.confirmPassword}</p>
            )}
          </div>

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

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