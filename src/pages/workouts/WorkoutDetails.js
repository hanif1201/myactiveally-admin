import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Grid,
  Typography,
  Chip,
  Button,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
} from "@mui/material";
import {
  AccessTime,
  FitnessCenter,
  Person,
  LocalFireDepartment,
  CalendarToday,
  ArrowBack,
  Analytics,
  DirectionsRun,
  LocationOn,
  Speed,
  Straighten,
  BarChart,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import api from "../../api";
import { useNotification } from "../../hooks/useNotification";
import styles from "./WorkoutDetails.module.css";

const WorkoutDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  // Fetch workout details
  useEffect(() => {
    const fetchWorkoutDetails = async () => {
      try {
        setLoading(true);
        const response = await api.workouts.getWorkoutById(id);
        setWorkout(response.data);
      } catch (error) {
        showError("Failed to fetch workout details");
        console.error("Error fetching workout details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutDetails();
  }, [id, showError]);

  // Handle AI analysis
  const handleAnalyzeWorkout = async () => {
    try {
      setAnalyzing(true);
      const response = await api.workouts.analyzeWorkout(id);
      setAnalysis(response.data);
      showSuccess("Workout analysis completed");
    } catch (error) {
      showError("Failed to analyze workout");
      console.error("Error analyzing workout:", error);
    } finally {
      setAnalyzing(false);
    }
  };

  // Format date
  const formatDate = (date) => {
    return format(new Date(date), "MMMM d, yyyy");
  };

  // Format time
  const formatTime = (time) => {
    if (!time) return "N/A";
    return format(new Date(time), "h:mm a");
  };

  // Format duration
  const formatDuration = (duration) => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;

    let result = "";
    if (hours > 0) {
      result += `${hours} hour${hours > 1 ? "s" : ""} `;
    }
    if (minutes > 0 || hours === 0) {
      result += `${minutes} minute${minutes > 1 ? "s" : ""}`;
    }

    return result;
  };

  // Calculate intensity level
  const getIntensityLevel = () => {
    if (!workout) return "N/A";

    // This is a simple example - in a real app, you would have a more sophisticated calculation
    if (workout.heartRate && workout.heartRate.avg) {
      if (workout.heartRate.avg > 160) return "High";
      if (workout.heartRate.avg > 130) return "Medium";
      return "Low";
    }

    if (workout.calories) {
      if (workout.calories > 500) return "High";
      if (workout.calories > 250) return "Medium";
      return "Low";
    }

    return "N/A";
  };

  if (loading) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress />
        <Typography variant='body1' sx={{ mt: 2 }}>
          Loading workout details...
        </Typography>
      </Box>
    );
  }

  if (!workout) {
    return (
      <Box className={styles.errorContainer}>
        <Typography variant='h6'>Workout not found</Typography>
        <Button
          variant='contained'
          color='primary'
          startIcon={<ArrowBack />}
          onClick={() => navigate("/workouts")}
          sx={{ mt: 2 }}
        >
          Back to Workouts
        </Button>
      </Box>
    );
  }

  return (
    <Box className={styles.workoutDetailsContainer}>
      <PageHeader
        title='Workout Details'
        breadcrumbs={[
          { label: "Workouts", link: "/workouts" },
          { label: workout.name, link: `/workouts/${id}` },
        ]}
        action={
          <Box>
            <Button
              variant='outlined'
              color='primary'
              startIcon={<ArrowBack />}
              onClick={() => navigate("/workouts")}
              className={styles.backButton}
            >
              Back
            </Button>
            <Button
              variant='contained'
              color='primary'
              startIcon={<Analytics />}
              onClick={handleAnalyzeWorkout}
              disabled={analyzing}
              className={styles.analyzeButton}
            >
              {analyzing ? "Analyzing..." : "AI Analysis"}
            </Button>
          </Box>
        }
      />

      {/* Workout Summary Card */}
      <Paper className={styles.summaryCard}>
        <Box className={styles.summaryCardContent}>
          <Box className={styles.workoutTitleSection}>
            <Typography variant='h4' className={styles.workoutTitle}>
              {workout.name}
            </Typography>
            <Chip
              icon={<FitnessCenter fontSize='small' />}
              label={workout.type || "Custom Workout"}
              color='primary'
              className={styles.workoutTypeChip}
            />
          </Box>

          <Box className={styles.summaryStats}>
            <Box className={styles.statItem}>
              <CalendarToday className={styles.statIcon} />
              <Box>
                <Typography variant='caption' color='textSecondary'>
                  Date
                </Typography>
                <Typography variant='body1'>
                  {formatDate(workout.date)}
                </Typography>
              </Box>
            </Box>

            <Box className={styles.statItem}>
              <AccessTime className={styles.statIcon} />
              <Box>
                <Typography variant='caption' color='textSecondary'>
                  Duration
                </Typography>
                <Typography variant='body1'>
                  {formatDuration(workout.duration)}
                </Typography>
              </Box>
            </Box>

            {workout.calories && (
              <Box className={styles.statItem}>
                <LocalFireDepartment className={styles.statIcon} />
                <Box>
                  <Typography variant='caption' color='textSecondary'>
                    Calories
                  </Typography>
                  <Typography variant='body1'>{workout.calories}</Typography>
                </Box>
              </Box>
            )}

            <Box className={styles.statItem}>
              <Speed className={styles.statIcon} />
              <Box>
                <Typography variant='caption' color='textSecondary'>
                  Intensity
                </Typography>
                <Typography variant='body1'>{getIntensityLevel()}</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3} className={styles.contentGrid}>
        {/* User Info */}
        <Grid item xs={12} md={4}>
          <Card title='User Information'>
            <Box className={styles.userProfile}>
              <Avatar
                src={workout.user?.profileImage}
                alt={workout.user?.name}
                className={styles.userAvatar}
              />
              <Box className={styles.userInfo}>
                <Typography variant='h6'>{workout.user?.name}</Typography>
                <Typography variant='body2' color='textSecondary'>
                  {workout.user?.email}
                </Typography>
              </Box>
            </Box>
            <Divider className={styles.divider} />
            <List dense>
              {workout.user?.fitnessLevel && (
                <ListItem>
                  <ListItemIcon>
                    <FitnessCenter />
                  </ListItemIcon>
                  <ListItemText
                    primary='Fitness Level'
                    secondary={workout.user.fitnessLevel}
                  />
                </ListItem>
              )}
            </List>
            <Button
              variant='outlined'
              fullWidth
              onClick={() => navigate(`/users/${workout.user?._id}`)}
              className={styles.viewProfileButton}
            >
              View User Profile
            </Button>
          </Card>
        </Grid>

        {/* Workout Details */}
        <Grid item xs={12} md={8}>
          <Card title='Workout Details'>
            <Grid container spacing={3}>
              {workout.location && (
                <Grid item xs={12}>
                  <Box className={styles.locationSection}>
                    <LocationOn color='primary' />
                    <Typography variant='body1'>{workout.location}</Typography>
                  </Box>
                </Grid>
              )}

              {workout.notes && (
                <Grid item xs={12}>
                  <Typography variant='subtitle1' gutterBottom>
                    Notes
                  </Typography>
                  <Typography variant='body2' className={styles.workoutNotes}>
                    {workout.notes}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Card>
        </Grid>

        {/* Exercises */}
        {workout.exercises && workout.exercises.length > 0 && (
          <Grid item xs={12}>
            <Card title='Exercises'>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Exercise</TableCell>
                      <TableCell>Sets</TableCell>
                      <TableCell>Reps</TableCell>
                      <TableCell>Weight</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>Rest</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {workout.exercises.map((exercise, index) => (
                      <TableRow key={index}>
                        <TableCell>{exercise.name}</TableCell>
                        <TableCell>{exercise.sets || "-"}</TableCell>
                        <TableCell>{exercise.reps || "-"}</TableCell>
                        <TableCell>
                          {exercise.weight
                            ? `${exercise.weight} ${
                                exercise.weightUnit || "kg"
                              }`
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {exercise.duration ? `${exercise.duration} min` : "-"}
                        </TableCell>
                        <TableCell>
                          {exercise.rest ? `${exercise.rest} sec` : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>
        )}

        {/* Cardio Stats */}
        {workout.type === "cardio" && workout.cardio && (
          <Grid item xs={12} md={6}>
            <Card title='Cardio Stats'>
              <List>
                {workout.cardio.distance && (
                  <ListItem>
                    <ListItemIcon>
                      <Straighten />
                    </ListItemIcon>
                    <ListItemText
                      primary='Distance'
                      secondary={`${workout.cardio.distance} ${
                        workout.cardio.distanceUnit || "km"
                      }`}
                    />
                  </ListItem>
                )}
                {workout.cardio.pace && (
                  <ListItem>
                    <ListItemIcon>
                      <DirectionsRun />
                    </ListItemIcon>
                    <ListItemText
                      primary='Pace'
                      secondary={workout.cardio.pace}
                    />
                  </ListItem>
                )}
                {workout.cardio.elevationGain && (
                  <ListItem>
                    <ListItemIcon>
                      <BarChart />
                    </ListItemIcon>
                    <ListItemText
                      primary='Elevation Gain'
                      secondary={`${workout.cardio.elevationGain} m`}
                    />
                  </ListItem>
                )}
              </List>
            </Card>
          </Grid>
        )}

        {/* Heart Rate */}
        {workout.heartRate && (
          <Grid item xs={12} md={6}>
            <Card title='Heart Rate'>
              <List>
                {workout.heartRate.avg && (
                  <ListItem>
                    <ListItemText
                      primary='Average Heart Rate'
                      secondary={`${workout.heartRate.avg} bpm`}
                    />
                  </ListItem>
                )}
                {workout.heartRate.max && (
                  <ListItem>
                    <ListItemText
                      primary='Max Heart Rate'
                      secondary={`${workout.heartRate.max} bpm`}
                    />
                  </ListItem>
                )}
                {workout.heartRate.min && (
                  <ListItem>
                    <ListItemText
                      primary='Min Heart Rate'
                      secondary={`${workout.heartRate.min} bpm`}
                    />
                  </ListItem>
                )}
              </List>
            </Card>
          </Grid>
        )}

        {/* AI Analysis */}
        {analysis && (
          <Grid item xs={12}>
            <Card title='AI Analysis' icon={<Analytics />}>
              <Typography variant='body1' paragraph>
                {analysis.summary}
              </Typography>

              {analysis.recommendations && (
                <>
                  <Typography variant='h6' gutterBottom>
                    Recommendations
                  </Typography>
                  <List>
                    {analysis.recommendations.map((recommendation, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <FitnessCenter />
                        </ListItemIcon>
                        <ListItemText primary={recommendation} />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}

              {analysis.progress && (
                <>
                  <Typography variant='h6' gutterBottom>
                    Progress Tracking
                  </Typography>
                  <Grid container spacing={2}>
                    {Object.entries(analysis.progress).map(([key, value]) => (
                      <Grid item xs={12} sm={6} md={4} key={key}>
                        <Box className={styles.progressItem}>
                          <Typography variant='body2'>
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </Typography>
                          <Box className={styles.progressBarContainer}>
                            <LinearProgress
                              variant='determinate'
                              value={value}
                              color='primary'
                              className={styles.progressBar}
                            />
                            <Typography variant='caption'>{value}%</Typography>
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default WorkoutDetails;
