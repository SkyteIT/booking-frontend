import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../../layouts/AuthLayout/AuthLayout";
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
// ✅ FIX: Replaced react-icons/ai with @mui/icons-material (already installed)
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
// ✅ FIX: react-icons/fc (FcGoogle) replaced with inline SVG — no extra package needed
import { Snackbar, Alert } from "@mui/material";

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginErrors {
  email?: string;
  password?: string;
}

/** Inline Google "G" logo SVG — replaces FcGoogle from react-icons/fc */
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
);

function Login(): JSX.Element {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [successSnackbar, setSuccessSnackbar] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const validate = (): LoginErrors => {
    const newErrors: LoginErrors = {};
    const email = formData.email.trim();
    const password = formData.password.trim();

    if (!email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
      newErrors.email = "Enter a valid email address";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password))
      newErrors.password =
        "Password must contain uppercase, lowercase and a number";

    return newErrors;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (loading) return;

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);

      setTimeout(() => {
        setLoading(false);
        setSuccessSnackbar(true);

        // Redirect to landing page after 1.5s
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1500);
      }, 1500);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-card">
        <h2 className="title center">Welcome Back</h2>
        <p className="subtitle center">
          Please enter your details to sign in to your account.
        </p>

        <form onSubmit={handleSubmit} noValidate>
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
              <span
                className="eye-icon"
                onClick={() => setShowPassword(prev => !prev)}
              >
                {showPassword
                  ? <VisibilityIcon sx={{ fontSize: 20 }} />
                  : <VisibilityOffIcon sx={{ fontSize: 20 }} />
                }
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
            style={{
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <button className="google-btn">
          <GoogleIcon />
          Continue with Google
        </button>

        <p className="bottom-text">
          Don't have an account?{" "}
          <Link to="/register" className="bold-link">
            Sign Up
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
            Login Successful!
          </Alert>
        </Snackbar>
      </div>
    </AuthLayout>
  );
}

export default Login;
