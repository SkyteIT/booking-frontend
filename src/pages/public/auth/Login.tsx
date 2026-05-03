import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../../layouts/AuthLayout/AuthLayout";
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Snackbar, Alert } from "@mui/material";
import { loginUser } from "../../../services/authService";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
interface LoginFormData {
  email: string;
  password: string;
}

interface LoginErrors {
  email?: string;
  password?: string;
}

function Login(): JSX.Element {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  //for enter data
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

  // handle submit+validation
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (loading) return;

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
//to call backend via service
      try {
        const data = await loginUser(formData.email, formData.password);
        console.log("LOGIN RESPONSE:", data);
        //  Save JWT token
        localStorage.setItem("token", data.token);

        setSuccessSnackbar(true);

        // Redirect after success
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1500);

      } catch (error: unknown) {
        console.error(error);

        setErrors({
          email: "Invalid email or password",
          password: "Invalid email or password"
        });

      } finally {
        setLoading(false);
      }
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
                {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
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

        <GoogleLogin
  onSuccess={async (credentialResponse) => {
    try {
      const res = await axios.post("http://localhost:5037/api/auth/google", {
        token: credentialResponse.credential,
      });

      localStorage.setItem("token", res.data.token);

      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      alert("Google login failed");
    }
  }}
  onError={() => {
    console.log("Google Login Failed");
  }}
/>

        <p className="bottom-text">
          Don’t have an account?{" "}
          <Link to="/register" className="bold-link">
            Sign Up
          </Link>
        </p>

        {/*  Success Snackbar */}
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