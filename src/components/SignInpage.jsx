import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./Button";
import { Input } from "./Input";
import LmiLogo from "./assets/lmi-logo.jpg";
import BackgroundImage from "./assets/bg.jpg";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state for buttons
  const navigate = useNavigate();

  const allowedDomains = [
    "@lmi-ghana.com",
    "@lmi-shamrock.com",
    "@lmi-homes.com",
    "@lmi-utilities.com",
    "@lmi-digital.net",
    "@gmail.com",
  ];

  const validateEmailDomain = (email) => {
    return allowedDomains.some((domain) => email.endsWith(domain));
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLoading) return; // Prevent double-click

    if (!validateEmailDomain(email)) {
      setEmailError(
        "Please use a corporate email ending in @lmi-ghana.com, @lmi-shamrock.com, @lmi-homes.com, or @lmi-utilities.com"
      );
      return;
    }
    setEmailError("");
    setIsLoading(true);

    // try {
    //   const response = await fetch("http://localhost:3000/api/auth/login", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ email, password }),
    //   });

    try {
      const response = await fetch("https://bot-backend-rpqo.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        sessionStorage.setItem("authenticated", "true");
        sessionStorage.setItem("token", data.token);
        sessionStorage.removeItem("email");
        navigate("/chat", { replace: true });
        setShowOtpPopup(false);
        setOtp("");
      } else {
        alert(data.msg || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Sign Up
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (isLoading) return; // Prevent double-click

    if (!validateEmailDomain(email)) {
      setEmailError(
        "Please use a corporate email ending in @lmi-ghana.com, @lmi-shamrock.com, @lmi-homes.com, or @lmi-utilities.com"
      );
      return;
    }
    setEmailError("");

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    setPasswordError("");
    setIsLoading(true);

    // try {
    //   const response = await fetch("http://localhost:3000/api/auth/register", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ email, password }),
    //   });

    try {
      const response = await fetch("https://bot-backend-rpqo.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem("email", email);
        setShowOtpPopup(true);
      } else {
        alert(data.msg || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during sign-up:", error);
      alert("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP Verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (isLoading) return; // Prevent double-click

    const email = sessionStorage.getItem("email");
    setIsLoading(true);

    // try {
    //   const endpoint =
    //     activeTab === "login"
    //       ? "http://localhost:3000/api/auth/verify-login-otp"
    //       : "http://localhost:3000/api/auth/verify-account-otp";
    //   const response = await fetch(endpoint, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ email, otp }),
    //   });

    try {
      const response = await fetch("https://bot-backend-rpqo.onrender.com/api/auth/verify-account-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
          sessionStorage.setItem("authenticated", "true");
          sessionStorage.setItem("token", data.token);
          sessionStorage.removeItem("email");
          navigate("/chat", { replace: true });
          setShowOtpPopup(false);
          setOtp("");
      } else {
        setOtpError(data.msg || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setOtpError("An error occurred. Please try again later.");
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
        <h2 className="text-2xl font-semibold text-red-600 mb-6">
          {activeTab === "login" ? "LMI Chatbot Sign-In" : "LMI Chatbot Sign-Up"}
        </h2>

        {/* Tabs */}
        <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-2 w-1/2 ${
              activeTab === "login" ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700"
            } rounded-l-lg`}
            onClick={() => setActiveTab("login")}
          >
            Sign In
          </button>
          <button
            className={`px-4 py-2 w-1/2 ${
              activeTab === "signup" ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700"
            } rounded-r-lg`}
            onClick={() => setActiveTab("signup")}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={activeTab === "login" ? handleLogin : handleSignUp}>
          <div className="mb-4">
            <Input
              type="email"
              placeholder="Enter your corporate email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg"
              required
            />
            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
          </div>

          <div className="mb-4 relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg"
              required
            />
            <button
              type="button" // Prevent form submission
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer focus:outline-none"
              onClick={() => setShowPassword((prev) => !prev)} // Explicit toggle
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {activeTab === "login" && (
            <div className="mb-4 text-right">
              <button
                type="button"
                className="text-red-600 hover:underline text-sm"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </button>
            </div>
          )}

          {activeTab === "signup" && (
            <div className="mb-4 relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border rounded-lg"
                required
              />
              <button
                type="button" // Prevent form submission
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer focus:outline-none"
                onClick={() => setShowConfirmPassword((prev) => !prev)} // Explicit toggle
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-red-600 text-white py-3 rounded-lg flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <span className="loader mr-2"></span> Loading...
              </span>
            ) : (
              activeTab === "login" ? "Sign In" : "Sign Up"
            )}
          </Button>
        </form>
      </div>

      {/* OTP Popup */}
      {showOtpPopup && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${BackgroundImage})` }}>
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm text-center">
            <h3 className="text-xl font-semibold text-red-600 mb-4">Verify OTP</h3>
            <p className="text-gray-600 mb-4">An OTP has been sent to {sessionStorage.getItem("email")}</p>
            <form onSubmit={handleVerifyOtp}>
              <div className="mb-4">
                <Input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  maxLength="6"
                  required
                />
                {otpError && <p className="text-red-500 text-sm mt-1">{otpError}</p>}
              </div>
              <Button
                type="submit"
                className="w-full bg-red-600 text-white py-3 rounded-lg flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="loader mr-2"></span> Verifying...
                  </span>
                ) : (
                  "Verify OTP"
                )}
              </Button>
              <Button
                type="button"
                className="w-full bg-gray-300 text-gray-700 py-3 rounded-lg mt-2"
                onClick={() => setShowOtpPopup(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}