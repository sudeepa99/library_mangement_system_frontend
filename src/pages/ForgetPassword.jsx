import { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import { authApi } from "../api/auth";
import forgetPasswordIcon from "../assets/icons/ForgotPasswordIcn.png";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSendCode = async (e) => {
    e.preventDefault();
    try {
      const response = await authApi.sendOTPCode({ email });
      toast.success(response.message);
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to send code");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 flex flex-col gap-4">
        {/* Icon */}
        <div className="flex justify-center">
          <img
            src={forgetPasswordIcon}
            className="size-32"
            alt="Forget Password Icon"
          />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-center">Forgot Password</h2>

        {/* Description */}
        <p className="text-sm text-gray-600 text-center">
          Enter your registered email address and we will send you a password
          reset code.
        </p>

        {/* Form */}
        <form onSubmit={handleSendCode} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <Button type="submit" variant="contained" fullWidth>
            Send Code
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

export default ForgetPassword;
