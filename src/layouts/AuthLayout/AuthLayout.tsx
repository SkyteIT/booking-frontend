import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import "./auth.css";

type AuthLayoutProps = {
  children?: ReactNode;
};

function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="auth-container">
      <div
        className="auth-left"
        style={{ backgroundImage: "url('/images/auth-bg.jpg')" }}
      >
        <div className="overlay">
          <h3 className="logo">Welcome to UBE</h3>
          <h1>Your next adventure starts here.</h1>
          <p>
            Discover the world with our seamless booking experience
            for hotels, restaurents, events, activities, eqiupments and car rentals.
          </p>
        </div>
      </div>

      <div className="auth-right">
        {/* When used as a route wrapper (no children), render nested routes */}
        {children ?? <Outlet />}
      </div>
    </div>
  );
}

export default AuthLayout;
