import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Switch,
  FormControlLabel,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Save } from "@mui/icons-material";
import PageHeader from "../../components/common/PageHeader";
import { useNotification } from "../../hooks/useNotification";
import { useTheme } from "../../hooks/useTheme";
import styles from "./Settings.module.css";

const GeneralSettings = () => {
  const { showSuccess, showError } = useNotification();
  const { toggleTheme, mode } = useTheme();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    siteName: "GymBuddy Admin",
    siteDescription: "Admin dashboard for GymBuddy fitness platform",
    supportEmail: "support@gymbuddy.com",
    userRegistration: true,
    instructorRegistration: true,
    gymRegistration: true,
    requireVerification: true,
    notifyNewUsers: true,
    notifyNewInstructors: true,
    notifyNewGyms: true,
    maintenanceMode: false,
  });
  const [errors, setErrors] = useState({});

  // Fetch settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);

        // In a real app, you would call an API endpoint
        // const response = await api.settings.getGeneralSettings();
        // setSettings(response.data);

        // Simulate API delay
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } catch (error) {
        showError("Failed to fetch settings");
        console.error("Error fetching settings:", error);
        setLoading(false);
      }
    };

    fetchSettings();
  }, [showError]);

  // Handle input change
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSettings({
      ...settings,
      [name]: value,
    });

    // Clear error when field is modified
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  // Handle switch change
  const handleSwitchChange = (event) => {
    const { name, checked } = event.target;
    setSettings({
      ...settings,
      [name]: checked,
    });
  };

  // Validate settings
  const validateSettings = () => {
    const newErrors = {};

    if (!settings.siteName) {
      newErrors.siteName = "Site name is required";
    }

    if (!settings.supportEmail) {
      newErrors.supportEmail = "Support email is required";
    } else if (!/\S+@\S+\.\S+/.test(settings.supportEmail)) {
      newErrors.supportEmail = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save settings
  const handleSaveSettings = async () => {
    if (!validateSettings()) {
      return;
    }

    try {
      setSaving(true);

      // In a real app, you would call an API endpoint
      // await api.settings.updateGeneralSettings(settings);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      showSuccess("Settings saved successfully");
    } catch (error) {
      showError("Failed to save settings");
      console.error("Error saving settings:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress />
        <Typography variant='body1' sx={{ mt: 2 }}>
          Loading settings...
        </Typography>
      </Box>
    );
  }

  return (
    <Box className={styles.settingsContainer}>
      <PageHeader
        title='General Settings'
        breadcrumbs={[
          { label: "Settings", link: "/settings" },
          { label: "General", link: "/settings/general" },
        ]}
      />

      <Paper className={styles.settingsPaper}>
        <Typography variant='h6' gutterBottom>
          Platform Settings
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='Site Name'
              name='siteName'
              value={settings.siteName}
              onChange={handleInputChange}
              error={Boolean(errors.siteName)}
              helperText={errors.siteName}
              margin='normal'
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='Support Email'
              name='supportEmail'
              value={settings.supportEmail}
              onChange={handleInputChange}
              error={Boolean(errors.supportEmail)}
              helperText={errors.supportEmail}
              margin='normal'
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label='Site Description'
              name='siteDescription'
              value={settings.siteDescription}
              onChange={handleInputChange}
              error={Boolean(errors.siteDescription)}
              helperText={errors.siteDescription}
              margin='normal'
              multiline
              rows={2}
            />
          </Grid>
        </Grid>

        <Divider className={styles.divider} />

        <Typography variant='h6' gutterBottom>
          Registration Settings
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.userRegistration}
                  onChange={handleSwitchChange}
                  name='userRegistration'
                  color='primary'
                />
              }
              label='Allow User Registration'
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.instructorRegistration}
                  onChange={handleSwitchChange}
                  name='instructorRegistration'
                  color='primary'
                />
              }
              label='Allow Instructor Registration'
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.gymRegistration}
                  onChange={handleSwitchChange}
                  name='gymRegistration'
                  color='primary'
                />
              }
              label='Allow Gym Registration'
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.requireVerification}
                  onChange={handleSwitchChange}
                  name='requireVerification'
                  color='primary'
                />
              }
              label='Require Verification for Instructors and Gyms'
            />
          </Grid>
        </Grid>

        <Divider className={styles.divider} />

        <Typography variant='h6' gutterBottom>
          Notification Settings
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifyNewUsers}
                  onChange={handleSwitchChange}
                  name='notifyNewUsers'
                  color='primary'
                />
              }
              label='Notify on New Users'
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifyNewInstructors}
                  onChange={handleSwitchChange}
                  name='notifyNewInstructors'
                  color='primary'
                />
              }
              label='Notify on New Instructors'
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifyNewGyms}
                  onChange={handleSwitchChange}
                  name='notifyNewGyms'
                  color='primary'
                />
              }
              label='Notify on New Gyms'
            />
          </Grid>
        </Grid>

        <Divider className={styles.divider} />

        <Typography variant='h6' gutterBottom>
          System Settings
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.maintenanceMode}
                  onChange={handleSwitchChange}
                  name='maintenanceMode'
                  color='primary'
                />
              }
              label='Maintenance Mode'
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={mode === "dark"}
                  onChange={toggleTheme}
                  name='darkMode'
                  color='primary'
                />
              }
              label='Dark Mode'
            />
          </Grid>
        </Grid>

        <Box className={styles.buttonContainer}>
          <Button
            variant='contained'
            color='primary'
            startIcon={<Save />}
            onClick={handleSaveSettings}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default GeneralSettings;
