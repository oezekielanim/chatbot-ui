// src/components/ForgotPassword.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./Button";
import LmiLogo from "./assets/lmi-logo.jpg";
import BackgroundImage from "./assets/background.jpg";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const allowedDomains = [
    "@lmi-ghana.com",
    "@lmi-shamrock.com",
    "@lmi-homes.com",
    "@lmi-utilities.com",
    "@gmail.com",
  ];

  const validateEmailDomain = (email) => {
    return allowedDomains.some((domain) => email.endsWith(domain));
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (!validateEmailDomain(email)) {
      setEmailError(
        "Please use a corporate email ending in @lmi-ghana.com, @lmi-shamrock.com, @lmi-homes.com, or @lmi-utilities.com"
      );
      return;
    }
    setEmailError("");
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("https://bot-backend-rpqo.onrender.com/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("A password reset link has been sent to your email.");
        setEmail("");
      } else {
        setEmailError(data.msg || "Failed to send reset link. Please try again.");
      }
    } catch (error) {
      console.error("Error during password reset request:", error);
      setEmailError("An error occurred. Please try again later.");
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
        <h2 className="text-2xl font-semibold text-red-600 mb-6">Forgot Password</h2>
        <p className="text-gray-600 mb-6">
          Enter your email address to receive a password reset link.
        </p>

        <form onSubmit={handleForgotPassword}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Enter your corporate email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg"
              required
            />
            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
          </div>

          {message && <p className="text-green-500 text-sm mb-4">{message}</p>}

          <Button
            type="submit"
            className="w-full bg-red-600 text-white py-3 rounded-lg flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <span className="loader mr-2"></span> Sending...
              </span>
            ) : (
              "Send Reset Link"
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