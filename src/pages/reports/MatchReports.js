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
  LineChart,
  Line,
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

const MatchReports = () => {
  const { showError } = useNotification();

  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month");
  const [reportData, setReportData] = useState(null);

  // Fetch report data
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);

        // In a real app, you would call an API endpoint
        // const response = await api.reports.getMatchReports({
        //   timeRange,
        // });

        // Simulate API response with mock data
        const mockData = {
          matchesByMonth: [
            { name: "Jan", matches: 45 },
            { name: "Feb", matches: 52 },
            { name: "Mar", matches: 58 },
            { name: "Apr", matches: 68 },
            { name: "May", matches: 82 },
            { name: "Jun", matches: 95 },
          ],
          matchesByStatus: [
            { name: "Active", value: 250 },
            { name: "Pending", value: 120 },
            { name: "Completed", value: 180 },
            { name: "Cancelled", value: 50 },
          ],
          matchSuccessRate: [
            { name: "Jan", rate: 65 },
            { name: "Feb", rate: 68 },
            { name: "Mar", rate: 70 },
            { name: "Apr", rate: 72 },
            { name: "May", rate: 75 },
            { name: "Jun", rate: 78 },
          ],
          matchesByType: [
            { name: "Weight Loss", value: 120 },
            { name: "Strength Training", value: 95 },
            { name: "Running", value: 85 },
            { name: "HIIT", value: 75 },
            { name: "Yoga", value: 70 },
            { name: "General Fitness", value: 155 },
          ],
          averageMatchDuration: [
            { name: "Jan", days: 28 },
            { name: "Feb", days: 32 },
            { name: "Mar", days: 30 },
            { name: "Apr", days: 35 },
            { name: "May", days: 38 },
            { name: "Jun", days: 40 },
          ],
          matchesByFitnessLevel: [
            { name: "Beginner", value: 180 },
            { name: "Intermediate", value: 220 },
            { name: "Advanced", value: 130 },
            { name: "Professional", value: 70 },
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
  }, [timeRange, showError]);

  // Handle time range change
  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
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
        title='Match Reports'
        breadcrumbs={[
          { label: "Reports", link: "/reports" },
          { label: "Match Reports", link: "/reports/matches" },
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
          {/* Matches by Month */}
          <Grid item xs={12} md={6}>
            <Card title='Matches by Month'>
              <ResponsiveContainer width='100%' height={300}>
                <BarChart data={reportData.matchesByMonth}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='name' />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey='matches' fill='#3f51b5' name='Matches' />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Grid>

          {/* Match Success Rate */}
          <Grid item xs={12} md={6}>
            <Card title='Match Success Rate'>
              <ResponsiveContainer width='100%' height={300}>
                <LineChart data={reportData.matchSuccessRate}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='name' />
                  <YAxis unit='%' />
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Success Rate"]}
                  />
                  <Legend />
                  <Line
                    type='monotone'
                    dataKey='rate'
                    stroke='#4caf50'
                    name='Success Rate'
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Grid>

          {/* Matches by Status */}
          <Grid item xs={12} md={4}>
            <Card title='Matches by Status'>
              <ResponsiveContainer width='100%' height={300}>
                <PieChart>
                  <Pie
                    data={reportData.matchesByStatus}
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
                    {reportData.matchesByStatus.map((entry, index) => (
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

          {/* Matches by Fitness Level */}
          <Grid item xs={12} md={4}>
            <Card title='Matches by Fitness Level'>
              <ResponsiveContainer width='100%' height={300}>
                <PieChart>
                  <Pie
                    data={reportData.matchesByFitnessLevel}
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
                    {reportData.matchesByFitnessLevel.map((entry, index) => (
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

          {/* Average Match Duration */}
          <Grid item xs={12} md={4}>
            <Card title='Average Match Duration (days)'>
              <ResponsiveContainer width='100%' height={300}>
                <LineChart data={reportData.averageMatchDuration}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='name' />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value} days`, "Avg. Duration"]}
                  />
                  <Legend />
                  <Line
                    type='monotone'
                    dataKey='days'
                    stroke='#f50057'
                    name='Duration'
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Grid>

          {/* Top Match Types */}
          <Grid item xs={12}>
            <Card title='Matches by Workout Type'>
              <ResponsiveContainer width='100%' height={300}>
                <BarChart
                  data={reportData.matchesByType}
                  layout='vertical'
                  margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis type='number' />
                  <YAxis dataKey='name' type='category' />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey='value' fill='#ff9800' name='Matches' />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default MatchReports;
