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
  IconButton,
  InputAdornment,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import {
  Save,
  Visibility,
  VisibilityOff,
  ContentCopy,
  Refresh,
  Delete,
  Add,
  Key,
  CheckCircle,
  Block,
} from "@mui/icons-material";
import PageHeader from "../../components/common/PageHeader";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { useNotification } from "../../hooks/useNotification";
import styles from "./Settings.module.css";

const ApiSettings = () => {
  const { showSuccess, showError } = useNotification();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    googleMapsApiKey: "",
    stripePublicKey: "",
    stripeSecretKey: "",
    emailApiKey: "",
    smsApiKey: "",
    enableRateLimiting: true,
    maxRequestsPerMinute: "60",
    enableApiCache: true,
    cacheDuration: "300",
  });
  const [apiKeys, setApiKeys] = useState([
    {
      id: "1",
      name: "Web Client",
      key: "ak_1234567890abcdef",
      created: "2023-01-15",
      lastUsed: "2023-05-10",
      status: "active",
    },
    {
      id: "2",
      name: "Mobile App",
      key: "ak_0987654321fedcba",
      created: "2023-02-20",
      lastUsed: "2023-05-12",
      status: "active",
    },
    {
      id: "3",
      name: "Partner Integration",
      key: "ak_abcdef1234567890",
      created: "2023-03-05",
      lastUsed: "2023-04-22",
      status: "inactive",
    },
  ]);
  const [showKeys, setShowKeys] = useState({});
  const [errors, setErrors] = useState({});
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    content: "",
    action: null,
  });
  const [newKeyName, setNewKeyName] = useState("");
  const [showNewKeyForm, setShowNewKeyForm] = useState(false);

  // Fetch settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);

        // In a real app, you would call an API endpoint
        // const response = await api.settings.getApiSettings();
        // setSettings(response.data.settings);
        // setApiKeys(response.data.apiKeys);

        // Simulate API delay
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } catch (error) {
        showError("Failed to fetch API settings");
        console.error("Error fetching API settings:", error);
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

  // Toggle API key visibility
  const handleToggleKeyVisibility = (id) => {
    setShowKeys({
      ...showKeys,
      [id]: !showKeys[id],
    });
  };

  // Copy API key to clipboard
  const handleCopyKey = (key) => {
    navigator.clipboard.writeText(key);
    showSuccess("API key copied to clipboard");
  };

  // Handle regenerate API key
  const handleRegenerateKey = (id) => {
    setConfirmDialog({
      open: true,
      title: "Regenerate API Key",
      content:
        "Are you sure you want to regenerate this API key? This will invalidate the existing key and may disrupt services that are using it.",
      action: () => {
        // In a real app, you would call an API endpoint
        // await api.settings.regenerateApiKey(id);

        // Simulate API response
        const updatedKeys = apiKeys.map((key) => {
          if (key.id === id) {
            return {
              ...key,
              key: `ak_${Math.random().toString(36).substring(2, 15)}`,
              created: new Date().toISOString().split("T")[0],
            };
          }
          return key;
        });

        setApiKeys(updatedKeys);
        showSuccess("API key regenerated successfully");
      },
    });
  };

  // Handle delete API key
  const handleDeleteKey = (id) => {
    setConfirmDialog({
      open: true,
      title: "Delete API Key",
      content:
        "Are you sure you want to delete this API key? This action cannot be undone and will immediately revoke access for services using this key.",
      action: () => {
        // In a real app, you would call an API endpoint
        // await api.settings.deleteApiKey(id);

        // Simulate API response
        const updatedKeys = apiKeys.filter((key) => key.id !== id);
        setApiKeys(updatedKeys);
        showSuccess("API key deleted successfully");
      },
    });
  };

  // Handle toggle API key status
  const handleToggleKeyStatus = (id) => {
    const key = apiKeys.find((key) => key.id === id);
    const newStatus = key.status === "active" ? "inactive" : "active";

    setConfirmDialog({
      open: true,
      title: `${newStatus === "active" ? "Activate" : "Deactivate"} API Key`,
      content: `Are you sure you want to ${
        newStatus === "active" ? "activate" : "deactivate"
      } this API key?`,
      action: () => {
        // In a real app, you would call an API endpoint
        // await api.settings.updateApiKeyStatus(id, newStatus);

        // Simulate API response
        const updatedKeys = apiKeys.map((key) => {
          if (key.id === id) {
            return { ...key, status: newStatus };
          }
          return key;
        });

        setApiKeys(updatedKeys);
        showSuccess(
          `API key ${
            newStatus === "active" ? "activated" : "deactivated"
          } successfully`
        );
      },
    });
  };

  // Handle new key name change
  const handleNewKeyNameChange = (event) => {
    setNewKeyName(event.target.value);
  };

  // Handle create new API key
  const handleCreateNewKey = () => {
    if (!newKeyName.trim()) {
      return;
    }

    // In a real app, you would call an API endpoint
    // const response = await api.settings.createApiKey({ name: newKeyName });

    // Simulate API response
    const newKey = {
      id: `${apiKeys.length + 1}`,
      name: newKeyName,
      key: `ak_${Math.random().toString(36).substring(2, 15)}`,
      created: new Date().toISOString().split("T")[0],
      lastUsed: "-",
      status: "active",
    };

    setApiKeys([...apiKeys, newKey]);
    setNewKeyName("");
    setShowNewKeyForm(false);
    showSuccess("New API key created successfully");
  };

  // Validate settings
  const validateSettings = () => {
    const newErrors = {};

    if (settings.enableRateLimiting) {
      const maxRequests = parseInt(settings.maxRequestsPerMinute);
      if (isNaN(maxRequests) || maxRequests <= 0) {
        newErrors.maxRequestsPerMinute = "Must be a positive number";
      }
    }

    if (settings.enableApiCache) {
      const cacheDuration = parseInt(settings.cacheDuration);
      if (isNaN(cacheDuration) || cacheDuration <= 0) {
        newErrors.cacheDuration = "Must be a positive number";
      }
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
      // await api.settings.updateApiSettings(settings);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      showSuccess("API settings saved successfully");
    } catch (error) {
      showError("Failed to save API settings");
      console.error("Error saving API settings:", error);
    } finally {
      setSaving(false);
    }
  };

  // Close confirm dialog
  const handleCloseConfirmDialog = () => {
    setConfirmDialog({
      ...confirmDialog,
      open: false,
    });
  };

  // Execute confirm dialog action
  const handleConfirmDialogAction = () => {
    if (confirmDialog.action) {
      confirmDialog.action();
    }
    setConfirmDialog({
      ...confirmDialog,
      open: false,
    });
  };

  if (loading) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress />
        <Typography variant='body1' sx={{ mt: 2 }}>
          Loading API settings...
        </Typography>
      </Box>
    );
  }

  return (
    <Box className={styles.settingsContainer}>
      <PageHeader
        title='API Settings'
        breadcrumbs={[
          { label: "Settings", link: "/settings" },
          { label: "API Settings", link: "/settings/api" },
        ]}
      />

      <Paper className={styles.settingsPaper}>
        <Typography variant='h6' gutterBottom>
          External API Keys
        </Typography>
        <Typography variant='body2' color='textSecondary' paragraph>
          Configure API keys for third-party services used in the application.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='Google Maps API Key'
              name='googleMapsApiKey'
              value={settings.googleMapsApiKey}
              onChange={handleInputChange}
              error={Boolean(errors.googleMapsApiKey)}
              helperText={errors.googleMapsApiKey}
              margin='normal'
              type={showKeys.googleMaps ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={() => handleToggleKeyVisibility("googleMaps")}
                      edge='end'
                    >
                      {showKeys.googleMaps ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='Stripe Public Key'
              name='stripePublicKey'
              value={settings.stripePublicKey}
              onChange={handleInputChange}
              error={Boolean(errors.stripePublicKey)}
              helperText={errors.stripePublicKey}
              margin='normal'
              type={showKeys.stripePublic ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={() => handleToggleKeyVisibility("stripePublic")}
                      edge='end'
                    >
                      {showKeys.stripePublic ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='Stripe Secret Key'
              name='stripeSecretKey'
              value={settings.stripeSecretKey}
              onChange={handleInputChange}
              error={Boolean(errors.stripeSecretKey)}
              helperText={errors.stripeSecretKey}
              margin='normal'
              type={showKeys.stripeSecret ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={() => handleToggleKeyVisibility("stripeSecret")}
                      edge='end'
                    >
                      {showKeys.stripeSecret ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='Email Service API Key'
              name='emailApiKey'
              value={settings.emailApiKey}
              onChange={handleInputChange}
              error={Boolean(errors.emailApiKey)}
              helperText={errors.emailApiKey}
              margin='normal'
              type={showKeys.email ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={() => handleToggleKeyVisibility("email")}
                      edge='end'
                    >
                      {showKeys.email ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='SMS Service API Key'
              name='smsApiKey'
              value={settings.smsApiKey}
              onChange={handleInputChange}
              error={Boolean(errors.smsApiKey)}
              helperText={errors.smsApiKey}
              margin='normal'
              type={showKeys.sms ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={() => handleToggleKeyVisibility("sms")}
                      edge='end'
                    >
                      {showKeys.sms ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>

        <Divider className={styles.divider} />

        <Typography variant='h6' gutterBottom>
          API Performance Settings
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.enableRateLimiting}
                  onChange={handleSwitchChange}
                  name='enableRateLimiting'
                  color='primary'
                />
              }
              label='Enable Rate Limiting'
            />
            {settings.enableRateLimiting && (
              <TextField
                fullWidth
                label='Max Requests Per Minute'
                name='maxRequestsPerMinute'
                value={settings.maxRequestsPerMinute}
                onChange={handleInputChange}
                error={Boolean(errors.maxRequestsPerMinute)}
                helperText={errors.maxRequestsPerMinute}
                margin='normal'
                type='number'
                inputProps={{ min: 1 }}
              />
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.enableApiCache}
                  onChange={handleSwitchChange}
                  name='enableApiCache'
                  color='primary'
                />
              }
              label='Enable API Response Caching'
            />
            {settings.enableApiCache && (
              <TextField
                fullWidth
                label='Cache Duration (seconds)'
                name='cacheDuration'
                value={settings.cacheDuration}
                onChange={handleInputChange}
                error={Boolean(errors.cacheDuration)}
                helperText={errors.cacheDuration}
                margin='normal'
                type='number'
                inputProps={{ min: 1 }}
              />
            )}
          </Grid>
        </Grid>

        <Divider className={styles.divider} />

        <Box className={styles.apiKeysHeader}>
          <Typography variant='h6'>API Keys</Typography>
          <Button
            variant='outlined'
            color='primary'
            startIcon={<Add />}
            onClick={() => setShowNewKeyForm(!showNewKeyForm)}
          >
            Create New Key
          </Button>
        </Box>

        {showNewKeyForm && (
          <Box className={styles.newKeyForm}>
            <TextField
              label='API Key Name'
              variant='outlined'
              fullWidth
              value={newKeyName}
              onChange={handleNewKeyNameChange}
              placeholder='Enter a name for the new API key'
              size='small'
            />
            <Box className={styles.newKeyFormButtons}>
              <Button
                variant='contained'
                color='primary'
                onClick={handleCreateNewKey}
                disabled={!newKeyName.trim()}
              >
                Create Key
              </Button>
              <Button
                variant='outlined'
                onClick={() => {
                  setShowNewKeyForm(false);
                  setNewKeyName("");
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        )}

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>API Key</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Last Used</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align='right'>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {apiKeys.map((key) => (
                <TableRow key={key.id}>
                  <TableCell>{key.name}</TableCell>
                  <TableCell>
                    <Box className={styles.apiKeyCell}>
                      <Typography variant='body2'>
                        {showKeys[key.id]
                          ? key.key
                          : `${key.key.substring(0, 8)}...`}
                      </Typography>
                      <Box className={styles.apiKeyActions}>
                        <IconButton
                          size='small'
                          onClick={() => handleToggleKeyVisibility(key.id)}
                          title={showKeys[key.id] ? "Hide key" : "Show key"}
                        >
                          {showKeys[key.id] ? (
                            <VisibilityOff fontSize='small' />
                          ) : (
                            <Visibility fontSize='small' />
                          )}
                        </IconButton>
                        <IconButton
                          size='small'
                          onClick={() => handleCopyKey(key.key)}
                          title='Copy to clipboard'
                        >
                          <ContentCopy fontSize='small' />
                        </IconButton>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{key.created}</TableCell>
                  <TableCell>{key.lastUsed}</TableCell>
                  <TableCell>
                    <Chip
                      label={key.status === "active" ? "Active" : "Inactive"}
                      color={key.status === "active" ? "success" : "default"}
                      size='small'
                    />
                  </TableCell>
                  <TableCell align='right'>
                    <Box className={styles.tableActions}>
                      <IconButton
                        size='small'
                        onClick={() => handleToggleKeyStatus(key.id)}
                        title={
                          key.status === "active" ? "Deactivate" : "Activate"
                        }
                      >
                        {key.status === "active" ? (
                          <Block fontSize='small' />
                        ) : (
                          <CheckCircle fontSize='small' />
                        )}
                      </IconButton>
                      <IconButton
                        size='small'
                        onClick={() => handleRegenerateKey(key.id)}
                        title='Regenerate key'
                      >
                        <Refresh fontSize='small' />
                      </IconButton>
                      <IconButton
                        size='small'
                        onClick={() => handleDeleteKey(key.id)}
                        title='Delete key'
                      >
                        <Delete fontSize='small' />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

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

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        content={confirmDialog.content}
        onClose={handleCloseConfirmDialog}
        onConfirm={handleConfirmDialogAction}
        confirmText='Confirm'
        cancelText='Cancel'
      />
    </Box>
  );
};

export default ApiSettings;
