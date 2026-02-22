import { Button } from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import verifyCodeIcon from "../assets/icons/VerifyCode.png";
import { authApi } from "../api/auth";

const VerifyCode = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    try {
      const response = await authApi.verifyCode({ email, code });
      toast.success(response?.data?.message);
      navigate("/reset-password");
    } catch (e) {
      toast.error(e.response?.data?.error);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 flex flex-col gap-4">
        <div className="flex justify-center">
          <img
            src={verifyCodeIcon}
            className="size-32"
            alt="Verify Code Page Icon"
          />
        </div>

        <h2 className="text-2xl font-semibold text-center">Verify Code</h2>

        <p className="text-sm text-gray-600 text-center">
          Enter your registered email address and reset code to update your
          password
        </p>

        <form onSubmit={handleVerifyCode} className="flex flex-col gap-3">
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

          <Button type="submit" variant="contained" fullWidth>
            Submit Code
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

export default VerifyCode;
