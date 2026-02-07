import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { toast } from "react-toastify";
import { authApi } from "../api/auth";
import { validateRegister } from "../validations/validateRegister";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("librarian");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateRegister({
      name,
      email,
      password,
      role,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const res = await authApi.register({ name, email, password, role });

      // authLogin(res.token, res.user);

      toast.success("Account Created Successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registartion Failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Create Your Library Account
        </Typography>
        <Box component="form" sx={{ mt: 3 }} onSubmit={handleSubmit} noValidate>
          <TextField
            label="Name"
            type="name"
            fullWidth
            margin="normal"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            required
          />

          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            error={!!errors.email}
            helperText={errors.email}
          />
          <FormControl fullWidth margin="normal" required error={!!errors.role}>
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              value={role}
              label="Role"
              onChange={(e) => setRole(e.target.value)}
            >
              <MenuItem value="member">Member</MenuItem>
              <MenuItem value="librarian">Librarian</MenuItem>
            </Select>
            {errors.role && (
              <Typography variant="caption" color="error">
                {errors.role}
              </Typography>
            )}
          </FormControl>
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            error={!!errors.password}
            helperText={errors.password}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? "Processing ..." : "Register"}
          </Button>
          <Typography variant="body2" align="center">
            Already have an account?{" "}
            <Button onClick={() => navigate("/login")} color="primary">
              Login
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};
export default Register;
