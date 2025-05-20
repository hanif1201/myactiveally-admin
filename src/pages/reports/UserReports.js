import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import api from "../../api";
import { useNotification } from "../../hooks/useNotification";
import styles from "./Reports.module.css";

const UserReports = () => {
  const { showError } = useNotification();

  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month");
  const [startDate, setStartDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1))
  );
  const [endDate, setEndDate] = useState(new Date());
  const [reportData, setReportData] = useState(null);

  // Fetch report data
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);

        // In a real app, you would call an API endpoint
        // const response = await api.reports.getUserReports({
        //   timeRange,
        //   startDate,
        //   endDate,
        // });

        // Simulate API response with mock data
        const mockData = {
          userGrowth: [
            { name: "Jan", users: 120 },
            { name: "Feb", users: 140 },
            { name: "Mar", users: 155 },
            { name: "Apr", users: 180 },
            { name: "May", users: 210 },
            { name: "Jun", users: 240 },
          ],
          usersByFitnessLevel: [
            { name: "Beginner", value: 120 },
            { name: "Intermediate", value: 180 },
            { name: "Advanced", value: 80 },
            { name: "Professional", value: 40 },
          ],
          usersByAgeGroup: [
            { name: "18-24", value: 90 },
            { name: "25-34", value: 150 },
            { name: "35-44", value: 120 },
            { name: "45-54", value: 40 },
            { name: "55+", value: 20 },
          ],
          usersByGender: [
            { name: "Male", value: 250 },
            { name: "Female", value: 160 },
            { name: "Other", value: 10 },
          ],
          activeUsers: {
            total: 420,
            active: 320,
            inactive: 80,
            suspended: 20,
          },
          topFitnessGoals: [
            { name: "Weight Loss", value: 180 },
            { name: "Muscle Gain", value: 150 },
            { name: "Endurance", value: 130 },
            { name: "Flexibility", value: 80 },
            { name: "Cardiovascular Health", value: 100 },
          ],
        };

        setReportData(mockData);
      } catch (error) {
        showError("Failed to fetch report data");
        console.error("Error fetching report data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [timeRange, startDate, endDate, showError]);

  // Handle time range change
  const handleTimeRangeChange = (event) => {
    const newRange = event.target.value;
    setTimeRange(newRange);

    // Update date range based on time range
    const now = new Date();
    let start;

    switch (newRange) {
      case "week":
        start = new Date(now);
        start.setDate(now.getDate() - 7);
        break;
      case "month":
        start = new Date(now);
        start.setMonth(now.getMonth() - 1);
        break;
      case "quarter":
        start = new Date(now);
        start.setMonth(now.getMonth() - 3);
        break;
      case "year":
        start = new Date(now);
        start.setFullYear(now.getFullYear() - 1);
        break;
      default:
        start = new Date(now);
        start.setMonth(now.getMonth() - 1);
    }

    setStartDate(start);
    setEndDate(now);
  };

  // Colors for charts
  const colors = [
    "#3f51b5",
    "#f50057",
    "#4caf50",
    "#ff9800",
    "#2196f3",
    "#9c27b0",
  ];

  return (
    <Box className={styles.reportsContainer}>
      <PageHeader
        title='User Reports'
        breadcrumbs={[
          { label: "Reports", link: "/reports" },
          { label: "User Reports", link: "/reports/users" },
        ]}
      />

      {/* Filters */}
      <Paper className={styles.filtersContainer}>
        <Grid container spacing={2} alignItems='center'>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth variant='outlined' size='small'>
              <InputLabel id='time-range-label'>Time Range</InputLabel>
              <Select
                labelId='time-range-label'
                id='time-range'
                value={timeRange}
                onChange={handleTimeRangeChange}
                label='Time Range'
              >
                <MenuItem value='week'>Last Week</MenuItem>
                <MenuItem value='month'>Last Month</MenuItem>
                <MenuItem value='quarter'>Last Quarter</MenuItem>
                <MenuItem value='year'>Last Year</MenuItem>
                <MenuItem value='custom'>Custom Range</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={8}>
            <Button variant='contained' color='primary'>
              Generate Report
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <Box className={styles.loadingContainer}>
          <CircularProgress />
          <Typography variant='body1' sx={{ mt: 2 }}>
            Loading report data...
          </Typography>
        </Box>
      ) : !reportData ? (
        <Box className={styles.errorContainer}>
          <Typography variant='h6'>No data available</Typography>
        </Box>
      ) : (
        <Grid container spacing={3} className={styles.reportsGrid}>
          {/* User Growth Chart */}
          <Grid item xs={12} md={8}>
            <Card title='User Growth'>
              <ResponsiveContainer width='100%' height={300}>
                <BarChart data={reportData.userGrowth}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='name' />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey='users' fill='#3f51b5' name='New Users' />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Grid>

          {/* Active Users */}
          <Grid item xs={12} md={4}>
            <Card title='User Status'>
              <ResponsiveContainer width='100%' height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Active", value: reportData.activeUsers.active },
                      {
                        name: "Inactive",
                        value: reportData.activeUsers.inactive,
                      },
                      {
                        name: "Suspended",
                        value: reportData.activeUsers.suspended,
                      },
                    ]}
                    cx='50%'
                    cy='50%'
                    labelLine={false}
                    outerRadius={80}
                    fill='#8884d8'
                    dataKey='value'
                    nameKey='name'
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {[
                      { name: "Active", value: reportData.activeUsers.active },
                      {
                        name: "Inactive",
                        value: reportData.activeUsers.inactive,
                      },
                      {
                        name: "Suspended",
                        value: reportData.activeUsers.suspended,
                      },
                    ].map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Grid>

          {/* Users by Fitness Level */}
          <Grid item xs={12} md={4}>
            <Card title='Users by Fitness Level'>
              <ResponsiveContainer width='100%' height={300}>
                <PieChart>
                  <Pie
                    data={reportData.usersByFitnessLevel}
                    cx='50%'
                    cy='50%'
                    labelLine={false}
                    outerRadius={80}
                    fill='#8884d8'
                    dataKey='value'
                    nameKey='name'
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {reportData.usersByFitnessLevel.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Grid>

          {/* Users by Age Group */}
          <Grid item xs={12} md={4}>
            <Card title='Users by Age Group'>
              <ResponsiveContainer width='100%' height={300}>
                <PieChart>
                  <Pie
                    data={reportData.usersByAgeGroup}
                    cx='50%'
                    cy='50%'
                    labelLine={false}
                    outerRadius={80}
                    fill='#8884d8'
                    dataKey='value'
                    nameKey='name'
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {reportData.usersByAgeGroup.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Grid>

          {/* Users by Gender */}
          <Grid item xs={12} md={4}>
            <Card title='Users by Gender'>
              <ResponsiveContainer width='100%' height={300}>
                <PieChart>
                  <Pie
                    data={reportData.usersByGender}
                    cx='50%'
                    cy='50%'
                    labelLine={false}
                    outerRadius={80}
                    fill='#8884d8'
                    dataKey='value'
                    nameKey='name'
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {reportData.usersByGender.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Grid>

          {/* Top Fitness Goals */}
          <Grid item xs={12}>
            <Card title='Top Fitness Goals'>
              <ResponsiveContainer width='100%' height={300}>
                <BarChart
                  data={reportData.topFitnessGoals}
                  layout='vertical'
                  margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis type='number' />
                  <YAxis type='category' dataKey='name' />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey='value' fill='#3f51b5' name='Users' />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default UserReports;
