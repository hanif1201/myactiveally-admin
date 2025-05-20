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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Rating,
} from "@mui/material";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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

const InstructorReports = () => {
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
        // const response = await api.reports.getInstructorReports({
        //   timeRange,
        // });

        // Simulate API response with mock data
        const mockData = {
          instructorGrowth: [
            { name: "Jan", instructors: 15 },
            { name: "Feb", instructors: 18 },
            { name: "Mar", instructors: 22 },
            { name: "Apr", instructors: 28 },
            { name: "May", instructors: 35 },
            { name: "Jun", instructors: 42 },
          ],
          verificationRate: [
            { name: "Jan", verificationRate: 65 },
            { name: "Feb", verificationRate: 70 },
            { name: "Mar", verificationRate: 68 },
            { name: "Apr", verificationRate: 75 },
            { name: "May", verificationRate: 82 },
            { name: "Jun", verificationRate: 85 },
          ],
          topInstructors: [
            {
              id: "1",
              name: "John Smith",
              rating: 4.9,
              totalConsultations: 85,
              revenue: 4250,
              specializations: ["Weight Loss", "Strength Training"],
            },
            {
              id: "2",
              name: "Sarah Johnson",
              rating: 4.8,
              totalConsultations: 78,
              revenue: 3900,
              specializations: ["Yoga", "Flexibility"],
            },
            {
              id: "3",
              name: "Mike Thompson",
              rating: 4.7,
              totalConsultations: 72,
              revenue: 3600,
              specializations: ["HIIT", "Cardio"],
            },
            {
              id: "4",
              name: "Emily Davis",
              rating: 4.7,
              totalConsultations: 68,
              revenue: 3400,
              specializations: ["Nutrition", "Weight Management"],
            },
            {
              id: "5",
              name: "David Wilson",
              rating: 4.6,
              totalConsultations: 65,
              revenue: 3250,
              specializations: ["Muscle Building", "Sports Performance"],
            },
          ],
          consultationsBySpecialization: [
            { name: "Weight Loss", value: 120 },
            { name: "Strength Training", value: 95 },
            { name: "Yoga", value: 85 },
            { name: "Cardio", value: 75 },
            { name: "HIIT", value: 70 },
            { name: "Nutrition", value: 65 },
          ],
          hourlyRateDistribution: [
            { rate: "$20-30", count: 8 },
            { rate: "$31-40", count: 15 },
            { rate: "$41-50", count: 22 },
            { rate: "$51-60", count: 12 },
            { rate: "$61-70", count: 8 },
            { rate: "$71+", count: 5 },
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

  return (
    <Box className={styles.reportsContainer}>
      <PageHeader
        title='Instructor Reports'
        breadcrumbs={[
          { label: "Reports", link: "/reports" },
          { label: "Instructor Reports", link: "/reports/instructors" },
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
          {/* Instructor Growth Chart */}
          <Grid item xs={12} md={6}>
            <Card title='Instructor Growth'>
              <ResponsiveContainer width='100%' height={300}>
                <BarChart data={reportData.instructorGrowth}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='name' />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey='instructors'
                    fill='#3f51b5'
                    name='New Instructors'
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Grid>

          {/* Verification Rate */}
          <Grid item xs={12} md={6}>
            <Card title='Verification Rate'>
              <ResponsiveContainer width='100%' height={300}>
                <LineChart data={reportData.verificationRate}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='name' />
                  <YAxis unit='%' />
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Verification Rate"]}
                  />
                  <Legend />
                  <Line
                    type='monotone'
                    dataKey='verificationRate'
                    stroke='#3f51b5'
                    name='Verification Rate'
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Grid>

          {/* Top Instructors */}
          <Grid item xs={12}>
            <Card title='Top Instructors by Revenue'>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Instructor</TableCell>
                      <TableCell>Rating</TableCell>
                      <TableCell>Consultations</TableCell>
                      <TableCell>Revenue</TableCell>
                      <TableCell>Specializations</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reportData.topInstructors.map((instructor) => (
                      <TableRow key={instructor.id}>
                        <TableCell>{instructor.name}</TableCell>
                        <TableCell>
                          <Box display='flex' alignItems='center'>
                            <Rating
                              value={instructor.rating}
                              precision={0.1}
                              readOnly
                              size='small'
                            />
                            <Typography variant='body2' ml={1}>
                              ({instructor.rating})
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{instructor.totalConsultations}</TableCell>
                        <TableCell>
                          {formatCurrency(instructor.revenue)}
                        </TableCell>
                        <TableCell>
                          {instructor.specializations.join(", ")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>

          {/* Consultations by Specialization */}
          <Grid item xs={12} md={6}>
            <Card title='Consultations by Specialization'>
              <ResponsiveContainer width='100%' height={300}>
                <BarChart
                  data={reportData.consultationsBySpecialization}
                  layout='vertical'
                  margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis type='number' />
                  <YAxis dataKey='name' type='category' />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey='value' fill='#4caf50' name='Consultations' />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Grid>

          {/* Hourly Rate Distribution */}
          <Grid item xs={12} md={6}>
            <Card title='Hourly Rate Distribution'>
              <ResponsiveContainer width='100%' height={300}>
                <BarChart data={reportData.hourlyRateDistribution}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='rate' />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey='count' fill='#f50057' name='Instructors' />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default InstructorReports;
