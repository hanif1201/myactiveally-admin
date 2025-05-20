import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Save, ArrowBack, Upload } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import PageHeader from "../../components/common/PageHeader";
import api from "../../api";
import { useNotification } from "../../hooks/useNotification";
import styles from "./UserForm.module.css";

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const isEditMode = Boolean(id);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);

  // Fetch user data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchUserData = async () => {
        try {
          setLoading(true);
          const response = await api.users.getUserById(id);
          setUser(response.data);
        } catch (err) {
          console.error("Error fetching user:", err);
          setError("Failed to load user data");
          showError("Failed to load user data");
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    }
  }, [id, isEditMode, showError]);

  // Initial form values
  const initialValues = {
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    confirmPassword: "",
    phone: user?.phone || "",
    gender: user?.gender || "",
    age: user?.age || "",
    fitnessLevel: user?.fitnessLevel || "",
    fitnessGoals: user?.fitnessGoals || [],
    preferredWorkouts: user?.preferredWorkouts || [],
    accountStatus: user?.accountStatus || "active",
    userType: user?.userType || "user",
    isAdmin: user?.isAdmin || false,
  };

  // Form validation schema
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .when("isEditMode", {
        is: true,
        then: Yup.string(), // Optional in edit mode
        otherwise: Yup.string().required("Password is required"),
      }),
    confirmPassword: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "Passwords must match"
    ),
    phone: Yup.string(),
    gender: Yup.string(),
    age: Yup.number()
      .typeError("Age must be a number")
      .positive("Age must be positive")
      .integer("Age must be an integer"),
    fitnessLevel: Yup.string(),
    accountStatus: Yup.string().required("Status is required"),
    userType: Yup.string().required("User type is required"),
  });

  // Fitness goals options
  const fitnessGoalsOptions = [
    { value: "weight_loss", label: "Weight Loss" },
    { value: "muscle_gain", label: "Muscle Gain" },
    { value: "endurance", label: "Endurance" },
    { value: "flexibility", label: "Flexibility" },
    { value: "cardiovascular_health", label: "Cardiovascular Health" },
    { value: "strength_training", label: "Strength Training" },
    { value: "general_fitness", label: "General Fitness" },
  ];

  // Workout preferences options
  const workoutPreferencesOptions = [
    { value: "cardio", label: "Cardio" },
    { value: "weightlifting", label: "Weightlifting" },
    { value: "yoga", label: "Yoga" },
    { value: "pilates", label: "Pilates" },
    { value: "calisthenics", label: "Calisthenics" },
    { value: "hiit", label: "HIIT" },
    { value: "crossfit", label: "CrossFit" },
    { value: "swimming", label: "Swimming" },
    { value: "running", label: "Running" },
    { value: "cycling", label: "Cycling" },
  ];

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      setSubmitting(true);

      // Remove confirmPassword and empty fields
      const userData = Object.fromEntries(
        Object.entries({
          ...values,
          confirmPassword: undefined,
        }).filter(([_, value]) => value !== "")
      );

      let response;
      if (isEditMode) {
        // Update existing user
        response = await api.users.updateUser(id, userData);
        showSuccess("User updated successfully");
      } else {
        // Create new user
        response = await api.users.createUser(userData);
        showSuccess("User created successfully");
      }

      // Navigate back to users list or user details page
      if (isEditMode) {
        navigate(`/users/${id}`);
      } else {
        navigate("/users");
      }
    } catch (err) {
      console.error("Error saving user:", err);
      setStatus({
        error: err.response?.data?.message || "Failed to save user data",
      });
      showError("Failed to save user data");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress />
        <Typography variant='body1' sx={{ mt: 2 }}>
          Loading user data...
        </Typography>
      </Box>
    );
  }

  return (
    <Box className={styles.userFormContainer}>
      <PageHeader
        title={isEditMode ? "Edit User" : "Create User"}
        breadcrumbs={[
          { label: "Users", link: "/users" },
          {
            label: isEditMode ? "Edit User" : "Create User",
            link: isEditMode ? `/users/edit/${id}` : "/users/new",
          },
        ]}
        action={
          <Button
            variant='outlined'
            color='primary'
            startIcon={<ArrowBack />}
            onClick={() => navigate("/users")}
          >
            Back to Users
          </Button>
        }
      />

      <Paper className={styles.formPaper}>
        <Formik
          initialValues={{ ...initialValues, isEditMode }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            setFieldValue,
            status,
            isSubmitting,
          }) => (
            <Form>
              {status?.error && (
                <Alert severity='error' className={styles.alert}>
                  {status.error}
                </Alert>
              )}

              <Typography variant='h6' gutterBottom>
                Basic Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id='name'
                    name='name'
                    label='Full Name'
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                    variant='outlined'
                    margin='normal'
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id='email'
                    name='email'
                    label='Email Address'
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    variant='outlined'
                    margin='normal'
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id='password'
                    name='password'
                    label={
                      isEditMode
                        ? "New Password (leave blank to keep current)"
                        : "Password"
                    }
                    type='password'
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    variant='outlined'
                    margin='normal'
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id='confirmPassword'
                    name='confirmPassword'
                    label='Confirm Password'
                    type='password'
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.confirmPassword && Boolean(errors.confirmPassword)
                    }
                    helperText={
                      touched.confirmPassword && errors.confirmPassword
                    }
                    variant='outlined'
                    margin='normal'
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id='phone'
                    name='phone'
                    label='Phone Number'
                    value={values.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.phone && Boolean(errors.phone)}
                    helperText={touched.phone && errors.phone}
                    variant='outlined'
                    margin='normal'
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id='gender'
                    name='gender'
                    label='Gender'
                    select
                    value={values.gender}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.gender && Boolean(errors.gender)}
                    helperText={touched.gender && errors.gender}
                    variant='outlined'
                    margin='normal'
                  >
                    <MenuItem value=''>Select Gender</MenuItem>
                    <MenuItem value='male'>Male</MenuItem>
                    <MenuItem value='female'>Female</MenuItem>
                    <MenuItem value='other'>Other</MenuItem>
                    <MenuItem value='prefer_not_to_say'>
                      Prefer not to say
                    </MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id='age'
                    name='age'
                    label='Age'
                    type='number'
                    inputProps={{ min: 0 }}
                    value={values.age}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.age && Boolean(errors.age)}
                    helperText={touched.age && errors.age}
                    variant='outlined'
                    margin='normal'
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id='userType'
                    name='userType'
                    label='User Type'
                    select
                    value={values.userType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.userType && Boolean(errors.userType)}
                    helperText={touched.userType && errors.userType}
                    variant='outlined'
                    margin='normal'
                  >
                    <MenuItem value='user'>Regular User</MenuItem>
                    <MenuItem value='instructor'>Instructor</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id='accountStatus'
                    name='accountStatus'
                    label='Account Status'
                    select
                    value={values.accountStatus}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.accountStatus && Boolean(errors.accountStatus)
                    }
                    helperText={touched.accountStatus && errors.accountStatus}
                    variant='outlined'
                    margin='normal'
                  >
                    <MenuItem value='active'>Active</MenuItem>
                    <MenuItem value='inactive'>Inactive</MenuItem>
                    <MenuItem value='suspended'>Suspended</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={values.isAdmin}
                        onChange={(e) => {
                          setFieldValue("isAdmin", e.target.checked);
                        }}
                        name='isAdmin'
                      />
                    }
                    label='Admin User'
                  />
                </Grid>
              </Grid>

              <Divider className={styles.divider} />

              <Typography variant='h6' gutterBottom>
                Fitness Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id='fitnessLevel'
                    name='fitnessLevel'
                    label='Fitness Level'
                    select
                    value={values.fitnessLevel}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.fitnessLevel && Boolean(errors.fitnessLevel)}
                    helperText={touched.fitnessLevel && errors.fitnessLevel}
                    variant='outlined'
                    margin='normal'
                  >
                    <MenuItem value=''>Select Fitness Level</MenuItem>
                    <MenuItem value='beginner'>Beginner</MenuItem>
                    <MenuItem value='intermediate'>Intermediate</MenuItem>
                    <MenuItem value='advanced'>Advanced</MenuItem>
                    <MenuItem value='professional'>Professional</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <FormControl component='fieldset' margin='normal'>
                    <FormLabel component='legend'>Fitness Goals</FormLabel>
                    <FormGroup row>
                      {fitnessGoalsOptions.map((option) => (
                        <FormControlLabel
                          key={option.value}
                          control={
                            <Checkbox
                              checked={values.fitnessGoals.includes(
                                option.value
                              )}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                const value = option.value;
                                const fitnessGoals = [...values.fitnessGoals];
                                if (checked) {
                                  fitnessGoals.push(value);
                                } else {
                                  const index = fitnessGoals.indexOf(value);
                                  if (index > -1) {
                                    fitnessGoals.splice(index, 1);
                                  }
                                }
                                setFieldValue("fitnessGoals", fitnessGoals);
                              }}
                              name={`fitnessGoals_${option.value}`}
                            />
                          }
                          label={option.label}
                        />
                      ))}
                    </FormGroup>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl component='fieldset' margin='normal'>
                    <FormLabel component='legend'>Preferred Workouts</FormLabel>
                    <FormGroup row>
                      {workoutPreferencesOptions.map((option) => (
                        <FormControlLabel
                          key={option.value}
                          control={
                            <Checkbox
                              checked={values.preferredWorkouts.includes(
                                option.value
                              )}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                const value = option.value;
                                const preferredWorkouts = [
                                  ...values.preferredWorkouts,
                                ];
                                if (checked) {
                                  preferredWorkouts.push(value);
                                } else {
                                  const index =
                                    preferredWorkouts.indexOf(value);
                                  if (index > -1) {
                                    preferredWorkouts.splice(index, 1);
                                  }
                                }
                                setFieldValue(
                                  "preferredWorkouts",
                                  preferredWorkouts
                                );
                              }}
                              name={`preferredWorkouts_${option.value}`}
                            />
                          }
                          label={option.label}
                        />
                      ))}
                    </FormGroup>
                  </FormControl>
                </Grid>
              </Grid>

              <Box className={styles.formActions}>
                <Button
                  type='submit'
                  variant='contained'
                  color='primary'
                  size='large'
                  startIcon={<Save />}
                  disabled={isSubmitting}
                  className={styles.submitButton}
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} color='inherit' />
                  ) : isEditMode ? (
                    "Update User"
                  ) : (
                    "Create User"
                  )}
                </Button>
                <Button
                  variant='outlined'
                  color='secondary'
                  size='large'
                  onClick={() => navigate("/users")}
                  className={styles.cancelButton}
                >
                  Cancel
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
};

export default UserForm;
