import { ArrowBack } from "@mui/icons-material";
import { Button } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ResetPasswordIcon from "../assets/icons/resetpasswordicon.png";
import { authApi } from "../api/auth";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setPasswordError("");
    try {
      const response = await authApi.resetPassword({ email, code, password });
      toast.success(response?.data?.message);
      navigate("/login");
    } catch (e) {
      toast.error(e?.response?.message);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 flex flex-col gap-4">
        <div className="flex justify-center">
          <img
            src={ResetPasswordIcon}
            className="size-32"
            alt="Verify Code Page Icon"
          />
        </div>

        <h2 className="text-2xl font-semibold text-center">Verify Code</h2>

        <p className="text-sm text-gray-600 text-center">
          Enter your registered email address and reset code to update your
          password
        </p>

        <form onSubmit={handleResetPassword} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Enter the received reset code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter the update password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </button>
          </div>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={`w-full border rounded-md px-3 py-2 focus:ring-2 ${
                passwordError
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
            </button>
          </div>
          {passwordError && (
            <p className="text-sm text-red-500">{passwordError}</p>
          )}

          <Button type="submit" variant="contained" fullWidth>
            Update Password
          </Button>

          <Button
            type="button"
            startIcon={<ArrowBack />}
            fullWidth
            onClick={() => navigate("/login")}
          >
            Back to Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
