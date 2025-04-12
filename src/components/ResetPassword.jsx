// src/components/ResetPassword.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "./Button";
import LmiLogo from "./assets/lmi-logo.jpg";
import BackgroundImage from "./assets/background.jpg";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setPasswordError("Invalid or missing reset token.");
    }
  }, [location]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (isLoading || !token) return;

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    }
    setPasswordError("");
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Password reset successful! Redirecting to sign-in...");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => navigate("/auth"), 2000);
      } else {
        setPasswordError(data.msg || "Failed to reset password. Please try again.");
      }
    } catch (error) {
      console.error("Error during password reset:", error);
      setPasswordError("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      <div className="backdrop-blur-lg p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        <img src={LmiLogo} alt="LMI Logo" className="w-24 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-red-600 mb-6">Reset Password</h2>
        <p className="text-gray-600 mb-6">Enter your new password below.</p>

        <form onSubmit={handleResetPassword}>
          <div className="mb-4 relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 border rounded-lg"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="mb-4 relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border rounded-lg"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer focus:outline-none"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
          </div>

          {message && <p className="text-green-500 text-sm mb-4">{message}</p>}

          <Button
            type="submit"
            className="w-full bg-red-600 text-white py-3 rounded-lg flex items-center justify-center"
            disabled={isLoading || !token}
          >
            {isLoading ? (
              <span className="flex items-center">
                <span className="loader mr-2"></span> Resetting...
              </span>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>

        <p className="mt-4">
          <button
            className="text-red-600 hover:underline"
            onClick={() => navigate("/auth")}
          >
            Back to Sign In
          </button>
        </p>
      </div>
    </div>
  );
}