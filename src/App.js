import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AuthProvider } from "./contexts/authContext";
import { Route, Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
const theme = createTheme({
  pallete: {
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
        <Router>
          <Routes>
            {/* <Route path="/login" element={<Login/>}/> */}
            {/* <Route path="/register" element={<Register />} /> */}

            {/* <Route path="/" element={<PrivateRoute />}>
            <Route index element={<Home />} />
              <Route path="books" element={<Books />} />
              <Route path="books/:id" element={<BookDetails />} />
              <Route path="my-borrowings" element={<MyBorrowings />} />
              
              <Route path="admin" element={<AdminRoute />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="books/add" element={<AddBook />} />
                <Route path="books/edit/:id" element={<EditBook />} />
                <Route path="users" element={<Users />} />
                <Route path="users/:id" element={<UserDetails />} />
                <Route path="borrowings" element={<Borrowings />} />
                <Route path="overdue-books" element={<OverdueBooks />} />
              </Route>

            </Route> */}
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </Router>
      </AuthProvider>
      <ToastContainer position="top-right" autoClose={5000} />
    </ThemeProvider>
  );
}

export default App;
