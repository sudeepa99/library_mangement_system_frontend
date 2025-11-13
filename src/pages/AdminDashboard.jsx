import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { useState } from "react";
import {
  Book as BookIcon,
  EventAvailable,
  People,
  Warning,
} from "@mui/icons-material";
import { Pie } from "react-chartjs-2";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      {loading ? (
        <Typography>Loading Dashboard</Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between">
                    <div>
                      <Typography color="textSecondary" gutterBottom>
                        Total Books
                      </Typography>
                      {/* <Typography variant="h4">total books</Typography> */}
                    </div>
                    <BookIcon color="primary" sx={{ fontSize: 40 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between">
                    <div>
                      <Typography color="textSecondary" gutterBottom>
                        Total Users
                      </Typography>
                      {/* <Typography variant="h4">total users</Typography> */}
                    </div>
                    <People color="primary" sx={{ fontSize: 40 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between">
                    <div>
                      <Typography color="textSecondary" gutterBottom>
                        Active Borrowings
                      </Typography>
                      {/* <Typography variant="h4">Active Borrowings</Typography> */}
                    </div>
                    <EventAvailable color="primary" sx={{ fontSize: 40 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between">
                    <div>
                      <Typography color="textSecondary" gutterBottom>
                        Overdue Books
                      </Typography>
                      {/* <Typography variant="h4">Overdue Books</Typography> */}
                    </div>
                    <Warning color="error" sx={{ fontSize: 40 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Books by Category
                </Typography>
                {/* {categoryData && (
                  <Box sx={{ height: "300px" }}>
                    <Pie data={categoryData} />
                  </Box>
                )} */}
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2, height: "100%" }}>
                <Typography variant="h6" gutterBottom>
                  Recent Activity
                </Typography>
                {/* <Typography color="textSecondary">
                  (Recent activity log would go here)
                </Typography> */}
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
};

export default AdminDashboard;
