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

const ConsultationReports = () => {
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
        // const response = await api.reports.getConsultationReports({
        //   timeRange,
        // });

        // Simulate API response with mock data
        const mockData = {
          consultationsByMonth: [
            { name: "Jan", consultations: 85 },
            { name: "Feb", consultations: 92 },
            { name: "Mar", consultations: 105 },
            { name: "Apr", consultations: 120 },
            { name: "May", consultations: 145 },
            { name: "Jun", consultations: 160 },
          ],
          consultationsByStatus: [
            { name: "Completed", value: 450 },
            { name: "Confirmed", value: 120 },
            { name: "Pending", value: 85 },
            { name: "Cancelled", value: 65 },
          ],
          consultationsByType: [
            { name: "In-Person", value: 410 },
            { name: "Online", value: 310 },
          ],
          revenueByMonth: [
            { name: "Jan", revenue: 4250 },
            { name: "Feb", revenue: 4600 },
            { name: "Mar", revenue: 5250 },
            { name: "Apr", revenue: 6000 },
            { name: "May", revenue: 7250 },
            { name: "Jun", revenue: 8000 },
          ],
          averageConsultationDuration: [
            { name: "Jan", duration: 52 },
            { name: "Feb", duration: 54 },
            { name: "Mar", duration: 50 },
            { name: "Apr", duration: 58 },
            { name: "May", duration: 55 },
            { name: "Jun", duration: 60 },
          ],
          topConsultationTypes: [
            { name: "Weight Loss", value: 180 },
            { name: "Strength Training", value: 150 },
            { name: "Yoga", value: 120 },
            { name: "HIIT", value: 110 },
            { name: "Nutrition", value: 95 },
            { name: "Running", value: 65 },
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

  // Format currency
  const formatCurrency = (value) => {
    return `$${value.toLocaleString()}`;
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
        title='Consultation Reports'
        breadcrumbs={[
          { label: "Reports", link: "/reports" },
          { label: "Consultation Reports", link: "/reports/consultations" },
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
          {/* Consultations by Month */}
          <Grid item xs={12} md={6}>
            <Card title='Consultations by Month'>
              <ResponsiveContainer width='100%' height={300}>
                <BarChart data={reportData.consultationsByMonth}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='name' />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey='consultations'
                    fill='#3f51b5'
                    name='Consultations'
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Grid>

          {/* Revenue by Month */}
          <Grid item xs={12} md={6}>
            <Card title='Revenue by Month'>
              <ResponsiveContainer width='100%' height={300}>
                <LineChart data={reportData.revenueByMonth}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='name' />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [formatCurrency(value), "Revenue"]}
                  />
                  <Legend />
                  <Line
                    type='monotone'
                    dataKey='revenue'
                    stroke='#4caf50'
                    name='Revenue'
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Grid>

          {/* Consultations by Status */}
          <Grid item xs={12} md={4}>
            <Card title='Consultations by Status'>
              <ResponsiveContainer width='100%' height={300}>
                <PieChart>
                  <Pie
                    data={reportData.consultationsByStatus}
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
                    {reportData.consultationsByStatus.map((entry, index) => (
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

          {/* Consultations by Type */}
          <Grid item xs={12} md={4}>
            <Card title='Consultations by Location Type'>
              <ResponsiveContainer width='100%' height={300}>
                <PieChart>
                  <Pie
                    data={reportData.consultationsByType}
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
                    {reportData.consultationsByType.map((entry, index) => (
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

          {/* Average Duration */}
          <Grid item xs={12} md={4}>
            <Card title='Average Consultation Duration (minutes)'>
              <ResponsiveContainer width='100%' height={300}>
                <LineChart data={reportData.averageConsultationDuration}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='name' />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value} min`, "Avg. Duration"]}
                  />
                  <Legend />
                  <Line
                    type='monotone'
                    dataKey='duration'
                    stroke='#f50057'
                    name='Duration'
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Grid>

          {/* Top Consultation Types */}
          <Grid item xs={12}>
            <Card title='Top Consultation Types'>
              <ResponsiveContainer width='100%' height={300}>
                <BarChart
                  data={reportData.topConsultationTypes}
                  layout='vertical'
                  margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis type='number' />
                  <YAxis dataKey='name' type='category' />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey='value' fill='#ff9800' name='Consultations' />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default ConsultationReports;
