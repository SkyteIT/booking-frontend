import { Link } from "react-router-dom";
import AuthLayout from "../../../layouts/AuthLayout/AuthLayout";
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginErrors {
  email?: string;
  password?: string;
}

function Login(): JSX.Element {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState<LoginErrors>({});
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validate = (): LoginErrors => {
    const newErrors: LoginErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    return newErrors;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);

      setTimeout(() => {
        setLoading(false);
        alert("Login Successful ✅");
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

        <form onSubmit={handleSubmit}>
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
            {errors.password && <p className="error-text">{errors.password}</p>}
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
  <FcGoogle size={20} /> {/* icon before text */}
  Continue with Google
</button>

<p className="bottom-text">
  Don’t have an account?{" "}
  <Link to="/register" className="bold-link">
    Sign Up
  </Link>
</p>

      </div>
    </AuthLayout>
  );
}

export default Login;