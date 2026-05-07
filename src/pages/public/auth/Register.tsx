import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../../layouts/AuthLayout/AuthLayout";
import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Snackbar, Alert } from "@mui/material";
import { registerUser } from "../../../services/authService";
import { GoogleLogin } from "@react-oauth/google"; 
import axios from "axios";
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
//enter data 
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState<RegisterErrors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [successSnackbar, setSuccessSnackbar] = useState<boolean>(false);
 
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

    if (!email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
      newErrors.email = "Enter a valid email address";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 8) newErrors.password = "Password must be at least 8 characters";
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password))
      newErrors.password = "Password must contain uppercase, lowercase and a number";

    if (!confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    return newErrors;
  };
//
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (loading) return;

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        setLoading(true);
// calls service layer-after generating the token in controller,return to this component,save it in local storage
        const data = await registerUser(
          formData.name,
          formData.email,
          formData.password
        );
 
        // Save JWT
        localStorage.setItem("token", data.token);

        setSuccessSnackbar(true);

        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 1500);

      }catch (error: unknown) {
        console.error(error);
      
        let message = "Registration failed";
      
        if (error instanceof Error) {
          message = error.message;
        }
      
        setErrors({
          email: message
        });
      
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
              <span
                className="eye-icon"
                onClick={() => setShowPassword(prev => !prev)}
              >
                {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
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
                {showConfirmPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
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
          Already have an account?{" "}
          <Link to="/login" className="bold-link">
            Sign in
          </Link>
        </p>
    

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
      </div>
    </AuthLayout>
  );
}

export default Register;