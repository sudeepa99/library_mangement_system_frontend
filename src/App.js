import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AuthProvider } from "./contexts/authContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./routes/privateRoute";
import AdminRoute from "./routes/adminRoute";
import AdminDashboard from "./pages/AdminDashboard";
import BookManagement from "./pages/BookManagement";
import Borrowing from "./pages/Borrowing";
import UserManagement from "./pages/UserManagement";
import Reports from "./pages/Reports";
import Homepage from "./pages/Homepage";
import MemberDashboard from "./pages/MemberDashboard";
import ForgetPassword from "./pages/ForgetPassword";
import VerifyCode from "./pages/VerifyCode";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgetPassword" element={<ForgetPassword />} />
            <Route path="/verify-code" element={<VerifyCode />} />

            <Route element={<PrivateRoute />}>
              <Route path="/member/dashboard" element={<MemberDashboard />} />
            </Route>

            <Route element={<PrivateRoute />}>
              <Route element={<AdminRoute />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/books" element={<BookManagement />} />
                <Route path="/admin/borrowings" element={<Borrowing />} />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/admin/reports" element={<Reports />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
      <ToastContainer position="top-right" autoClose={5000} />
    </ThemeProvider>
  );
}

export default App;
