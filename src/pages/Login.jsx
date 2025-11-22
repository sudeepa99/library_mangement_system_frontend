import { useState } from "react";
import { useAuth } from "../contexts/authContext";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { authApi } from "../api/auth";
import { toast } from "react-toastify";
import { green } from "@mui/material/colors";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      console.log("Data", res);
      authLogin(res.token, res.user);
      toast.success("Logged in Successfully");

      if (res.user.role === "member") {
        navigate("/");
      } else if (res.user.role === "librarian") {
        navigate("/admin/dashboard");
      } else {
        toast.error("Role Not Found");
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Library Login
        </Typography>
        <Box component="form" sx={{ mt: 3 }} onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
          <Typography variant="body2" align="center">
            Don't have an account?{" "}
            <Button onClick={() => navigate("/register")} color="primary">
              Register
            </Button>
          </Typography>
        </Box>
        <Button
          type="submit"
          variant="text"
          fullWidth
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/")}
        >
          Back to Home
        </Button>
      </Paper>
    </Container>
  );
};

export default Login;
