import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import PageHeader from "../../components/common/PageHeader";
import StatsSummary from "../../components/dashboard/StatsSummary";
import DashboardChart from "../../components/dashboard/DashboardChart";
import UserActivityList from "../../components/dashboard/UserActivityList";
import RevenueOverview from "../../components/dashboard/RevenueOverview";
import UserDistributionChart from "../../components/dashboard/UserDistributionChart";
import api from "../../api";
import { useNotification } from "../../hooks/useNotification";
import { useTheme } from "@mui/material/styles";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const theme = useTheme();
  const { showError } = useNotification();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month");

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const response = await api.instance.get("/admin/dashboard");
        setStats(response.data);
      } catch (error) {
        showError("Failed to load dashboard statistics");
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [showError]);

  // Handle time range change
  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  // Colors for charts
  const colors = {
    primary: theme.palette.primary.main,
    secondary: theme.palette.secondary.main,
    success: theme.palette.success.main,
    error: theme.palette.error.main,
    warning: theme.palette.warning.main,
    info: theme.palette.info.main,
  };

  // Mock data for charts (replace with actual data from API)
  const userGrowthData = stats?.userGrowth || {
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    counts: [10, 25, 40, 52, 78, 95],
  };

  const userGrowthChartData = userGrowthData.months.map((month, index) => ({
    name: month,
    users: userGrowthData.counts[index],
  }));

  const consultationData = [
    { name: "Confirmed", value: stats?.consultations?.active || 32 },
    { name: "Completed", value: stats?.consultations?.completed || 87 },
    { name: "Cancelled", value: stats?.consultations?.cancelled || 15 },
  ];

  const matchData = [
    { name: "Accepted", value: stats?.matches?.active || 45 },
    { name: "Pending", value: stats?.matches?.pending || 20 },
    { name: "Rejected", value: stats?.matches?.rejected || 15 },
  ];

  const userDistributionData = [
    { name: "Beginner", value: stats?.users?.distribution?.beginner || 42 },
    {
      name: "Intermediate",
      value: stats?.users?.distribution?.intermediate || 65,
    },
    { name: "Advanced", value: stats?.users?.distribution?.advanced || 27 },
    {
      name: "Professional",
      value: stats?.users?.distribution?.professional || 12,
    },
  ];

  const revenueData = {
    total: 24850.75,
    growth: 18.5,
    platform: 2485.07,
    instructors: 22365.68,
    thisMonth: 4235.5,
    lastMonth: 3875.25,
    consultationsCount: 142,
  };

  const recentActivity = stats?.recentActivity || [
    {
      type: "user_registered",
      user: { name: "John Doe" },
      timestamp: new Date().toISOString(),
    },
    {
      type: "instructor_verified",
      user: { name: "Jane Smith" },
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
      type: "consultation_booked",
      user: { name: "Alex Johnson" },
      instructor: { name: "Sarah Williams" },
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      type: "match_created",
      users: [{ name: "Michael Brown" }, { name: "Chris Davis" }],
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    },
    {
      type: "gym_verified",
      gym: { name: "Fitness Center" },
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    },
  ];

  return (
    <Box className={styles.dashboardContainer}>
      <PageHeader
        title='Dashboard'
        action={
          <FormControl variant='outlined' size='small'>
            <InputLabel id='time-range-label'>Time Range</InputLabel>
            <Select
              labelId='time-range-label'
              id='time-range'
              value={timeRange}
              onChange={handleTimeRangeChange}
              label='Time Range'
              className={styles.timeRangeSelect}
            >
              <MenuItem value='day'>Today</MenuItem>
              <MenuItem value='week'>This Week</MenuItem>
              <MenuItem value='month'>This Month</MenuItem>
              <MenuItem value='year'>This Year</MenuItem>
            </Select>
          </FormControl>
        }
      />

      {loading ? (
        <Box className={styles.loadingContainer}>
          <CircularProgress />
          <Typography variant='body1' sx={{ mt: 2 }}>
            Loading dashboard data...
          </Typography>
        </Box>
      ) : (
        <Box>
          {/* Stats Summary */}
          <StatsSummary stats={stats} />

          <Grid container spacing={3} className={styles.chartsGrid}>
            {/* User Growth Chart */}
            <Grid item xs={12} md={8}>
              <DashboardChart
                title='User Growth'
                subtitle='New user registrations over time'
                type='area'
                data={userGrowthChartData}
                dataKeys={[{ key: "users", name: "Users" }]}
                colors={[colors.primary]}
              />
            </Grid>

            {/* Revenue Overview */}
            <Grid item xs={12} md={4}>
              <RevenueOverview revenue={revenueData} />
            </Grid>

            {/* Consultations Chart */}
            <Grid item xs={12} sm={6} md={4}>
              <DashboardChart
                title='Consultations'
                subtitle='Distribution by status'
                type='pie'
                data={consultationData}
                dataKeys={[{ key: "value", nameKey: "name" }]}
                colors={[colors.primary, colors.success, colors.error]}
              />
            </Grid>

            {/* Matches Chart */}
            <Grid item xs={12} sm={6} md={4}>
              <DashboardChart
                title='Matches'
                subtitle='Distribution by status'
                type='pie'
                data={matchData}
                dataKeys={[{ key: "value", nameKey: "name" }]}
                colors={[colors.success, colors.primary, colors.error]}
              />
            </Grid>

            {/* User Distribution */}
            <Grid item xs={12} md={4}>
              <UserDistributionChart
                data={userDistributionData}
                title='User Fitness Levels'
                subtitle='Users by fitness experience'
              />
            </Grid>

            {/* Recent Activity */}
            <Grid item xs={12} md={8}>
              <UserActivityList activities={recentActivity} />
            </Grid>

            {/* Monthly Revenue Chart */}
            <Grid item xs={12} md={4}>
              <DashboardChart
                title='Monthly Revenue'
                subtitle='Platform fees over time'
                type='bar'
                data={[
                  { name: "Jan", revenue: 1850, fees: 185 },
                  { name: "Feb", revenue: 2120, fees: 212 },
                  { name: "Mar", revenue: 2340, fees: 234 },
                  { name: "Apr", revenue: 2675, fees: 267.5 },
                  { name: "May", revenue: 3250, fees: 325 },
                  { name: "Jun", revenue: 3875, fees: 387.5 },
                ]}
                dataKeys={[
                  { key: "revenue", name: "Total Revenue" },
                  { key: "fees", name: "Platform Fees" },
                ]}
                colors={[colors.primary, colors.secondary]}
              />
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;
