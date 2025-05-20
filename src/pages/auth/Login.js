import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Lock as LockIcon,
} from "@mui/icons-material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { useAuth } from "../../hooks/useAuth";
import styles from "./Login.module.css";

const Login = () => {
  const navigate = useNavigate();
  const { login, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  // Login schema with Yup
  const loginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  // Toggle password visibility
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle login form submission
  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    const { email, password } = values;

    try {
      const result = await login({ email, password });

      if (result.success) {
        navigate("/dashboard");
      } else {
        setStatus({ error: result.error || "Login failed. Please try again." });
      }
    } catch (err) {
      setStatus({
        error: "An unexpected error occurred. Please try again later.",
      });
      console.error("Login error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box className={styles.loginContainer}>
      <Box className={styles.loginBox}>
        <Paper elevation={3} className={styles.loginPaper}>
          <Box className={styles.logoContainer}>
            <LockIcon className={styles.logoIcon} />
            <Typography variant='h4' component='h1' className={styles.logoText}>
              GymBuddy Admin
            </Typography>
          </Box>

          <Typography variant='h5' component='h2' align='center' gutterBottom>
            Sign In
          </Typography>
          <Typography
            variant='body2'
            color='textSecondary'
            align='center'
            paragraph
          >
            Enter your credentials to access the admin dashboard
          </Typography>

          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
          >
            {({
              errors,
              touched,
              status,
              isSubmitting,
              handleChange,
              handleBlur,
              values,
            }) => (
              <Form className={styles.form}>
                {(status?.error || error) && (
                  <Alert severity='error' className={styles.alert}>
                    {status?.error || error}
                  </Alert>
                )}

                <TextField
                  fullWidth
                  id='email'
                  name='email'
                  label='Email Address'
                  variant='outlined'
                  margin='normal'
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  autoComplete='email'
                  autoFocus
                />

                <TextField
                  fullWidth
                  id='password'
                  name='password'
                  label='Password'
                  type={showPassword ? "text" : "password"}
                  variant='outlined'
                  margin='normal'
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  autoComplete='current-password'
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          aria-label='toggle password visibility'
                          onClick={handleTogglePasswordVisibility}
                          edge='end'
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type='submit'
                  fullWidth
                  variant='contained'
                  color='primary'
                  size='large'
                  className={styles.submitButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} color='inherit' />
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <Grid container justifyContent='flex-end'>
                  <Grid item>
                    <Link
                      component={RouterLink}
                      to='/forgot-password'
                      variant='body2'
                      className={styles.forgotPasswordLink}
                    >
                      Forgot password?
                    </Link>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Paper>

        <Typography
          variant='body2'
          color='textSecondary'
          align='center'
          className={styles.copyright}
        >
          {"© "}
          {new Date().getFullYear()}
          {" GymBuddy. All rights reserved."}
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
