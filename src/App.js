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
import Dashboard from "./pages/Dashboard";

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
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/" element={<PrivateRoute />}>
              <Route index element={<Dashboard />} />
              {/* <Route path="books" element={<Books />} /> */}
              {/* <Route path="books/:id" element={<BookDetails />} /> */}
              {/* <Route path="my-borrowings" element={<MyBorrowings />} /> */}

              <Route path="admin" element={<AdminRoute />}>
                <Route path="/admindashboard" element={<AdminDashboard />} />
                {/* <Route path="books/add" element={<AddBook />} /> */}
                {/* <Route path="books/edit/:id" element={<EditBook />} /> */}
                {/* <Route path="users" element={<Users />} /> */}
                {/* <Route path="users/:id" element={<UserDetails />} /> */}
                {/* <Route path="borrowings" element={<Borrowings />} /> */}
                {/* <Route path="overdue-books" element={<OverdueBooks />} /> */}
              </Route>
            </Route>
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </BrowserRouter>
      </AuthProvider>
      <ToastContainer position="top-right" autoClose={5000} />
    </ThemeProvider>
  );
}

export default App;
