import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  Alert,
  CircularProgress,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { useAuth } from "../../hooks/useAuth";
import styles from "./ForgotPassword.module.css";

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const [resetRequested, setResetRequested] = useState(false);
  const [emailSent, setEmailSent] = useState("");

  // Forgot password schema with Yup
  const forgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      const result = await forgotPassword(values.email);

      if (result.success) {
        setResetRequested(true);
        setEmailSent(values.email);
      } else {
        setStatus({ error: result.error || "Failed to process request" });
      }
    } catch (err) {
      setStatus({
        error: "An unexpected error occurred. Please try again later.",
      });
      console.error("Forgot password error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.formBox}>
        <Paper elevation={3} className={styles.paper}>
          {resetRequested ? (
            <Box className={styles.successContainer}>
              <Typography
                variant='h5'
                component='h2'
                align='center'
                gutterBottom
              >
                Check Your Email
              </Typography>
              <Typography variant='body1' align='center' paragraph>
                We've sent a password reset link to:
              </Typography>
              <Typography
                variant='body1'
                align='center'
                fontWeight='bold'
                paragraph
              >
                {emailSent}
              </Typography>
              <Typography
                variant='body2'
                color='textSecondary'
                align='center'
                paragraph
              >
                Please check your email and follow the instructions to reset
                your password. If you don't see it, check your spam folder.
              </Typography>
              <Box mt={3}>
                <Button
                  component={RouterLink}
                  to='/login'
                  fullWidth
                  variant='contained'
                  color='primary'
                >
                  Return to Login
                </Button>
              </Box>
            </Box>
          ) : (
            <>
              <Typography
                variant='h5'
                component='h2'
                align='center'
                gutterBottom
              >
                Forgot Password
              </Typography>
              <Typography
                variant='body2'
                color='textSecondary'
                align='center'
                paragraph
              >
                Enter your email address and we'll send you a link to reset your
                password
              </Typography>

              <Formik
                initialValues={{
                  email: "",
                }}
                validationSchema={forgotPasswordSchema}
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
                    {status?.error && (
                      <Alert severity='error' className={styles.alert}>
                        {status.error}
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
                        "Reset Password"
                      )}
                    </Button>

                    <Grid container justifyContent='center' mt={2}>
                      <Grid item>
                        <Link
                          component={RouterLink}
                          to='/login'
                          variant='body2'
                          className={styles.backLink}
                          display='flex'
                          alignItems='center'
                        >
                          <ArrowBackIcon
                            fontSize='small'
                            style={{ marginRight: 4 }}
                          />
                          Back to Login
                        </Link>
                      </Grid>
                    </Grid>
                  </Form>
                )}
              </Formik>
            </>
          )}
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

export default ForgotPassword;
