import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Grid,
  Typography,
  Chip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tab,
  Tabs,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Rating,
} from "@mui/material";
import {
  LocationOn,
  Phone,
  Language,
  Email,
  Schedule,
  ArrowBack,
  MoreVert,
  CheckCircle,
  Block,
  FitnessCenter,
  People,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Card from "../../components/common/Card";
import api from "../../api";
import { useNotification } from "../../hooks/useNotification";
import styles from "./GymDetails.module.css";

const GymDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  const [gym, setGym] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    content: "",
    action: null,
  });

  // Fetch gym details
  useEffect(() => {
    const fetchGymDetails = async () => {
      try {
        setLoading(true);
        const response = await api.gyms.getGymById(id);
        setGym(response.data);
      } catch (error) {
        showError("Failed to fetch gym details");
        console.error("Error fetching gym details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGymDetails();
  }, [id, showError]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle menu open
  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  // Handle verify gym
  const handleVerifyGym = () => {
    setConfirmDialog({
      open: true,
      title: "Verify Gym",
      content:
        "Are you sure you want to verify this gym? It will be displayed to users on the platform.",
      action: async () => {
        try {
          await api.gyms.verifyGym(id);
          showSuccess("Gym verified successfully");

          // Update gym verification status
          setGym({
            ...gym,
            isVerified: true,
          });
        } catch (error) {
          showError("Failed to verify gym");
          console.error("Error verifying gym:", error);
        }
      },
    });
    handleMenuClose();
  };

  // Handle unverify gym
  const handleUnverifyGym = () => {
    setConfirmDialog({
      open: true,
      title: "Unverify Gym",
      content:
        "Are you sure you want to unverify this gym? It will no longer be displayed to users.",
      action: async () => {
        try {
          // API call to unverify gym
          // await api.gyms.unverifyGym(id);
          showSuccess("Gym unverified successfully");

          // Update gym verification status
          setGym({
            ...gym,
            isVerified: false,
          });
        } catch (error) {
          showError("Failed to unverify gym");
          console.error("Error unverifying gym:", error);
        }
      },
    });
    handleMenuClose();
  };

  // Close confirm dialog
  const handleCloseConfirmDialog = () => {
    setConfirmDialog({
      ...confirmDialog,
      open: false,
    });
  };

  // Execute confirm dialog action
  const handleConfirmDialogAction = async () => {
    if (confirmDialog.action) {
      await confirmDialog.action();
    }
    handleCloseConfirmDialog();
  };

  // Format address
  const formatAddress = () => {
    if (gym.address?.formattedAddress) {
      return gym.address.formattedAddress;
    }

    const addressParts = [];
    if (gym.address) addressParts.push(gym.address);
    if (gym.city) addressParts.push(gym.city);
    if (gym.state) addressParts.push(gym.state);
    if (gym.zipCode) addressParts.push(gym.zipCode);

    return addressParts.join(", ") || "No address provided";
  };

  if (loading) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress />
        <Typography variant='body1' sx={{ mt: 2 }}>
          Loading gym details...
        </Typography>
      </Box>
    );
  }

  if (!gym) {
    return (
      <Box className={styles.errorContainer}>
        <Typography variant='h6'>Gym not found</Typography>
        <Button
          variant='contained'
          color='primary'
          startIcon={<ArrowBack />}
          onClick={() => navigate("/gyms")}
          sx={{ mt: 2 }}
        >
          Back to Gyms
        </Button>
      </Box>
    );
  }

  return (
    <Box className={styles.gymDetailsContainer}>
      <PageHeader
        title='Gym Details'
        breadcrumbs={[
          { label: "Gyms", link: "/gyms" },
          { label: gym.name, link: `/gyms/${id}` },
        ]}
        action={
          <Box>
            <Button
              variant='outlined'
              color='primary'
              startIcon={<ArrowBack />}
              onClick={() => navigate("/gyms")}
              className={styles.backButton}
            >
              Back
            </Button>
            <IconButton
              color='primary'
              onClick={handleMenuOpen}
              className={styles.moreButton}
            >
              <MoreVert />
            </IconButton>
          </Box>
        }
      />

      {/* Gym Profile Header */}
      <Paper className={styles.profileHeader}>
        <Box className={styles.profileHeaderContent}>
          <Box className={styles.profileInfo}>
            <Box className={styles.profileNameRow}>
              <Typography variant='h4'>{gym.name}</Typography>
              {gym.isVerified ? (
                <Chip
                  icon={<CheckCircle />}
                  label='Verified'
                  color='success'
                  className={styles.verificationChip}
                />
              ) : (
                <Chip
                  label='Pending Verification'
                  color='warning'
                  className={styles.verificationChip}
                />
              )}
            </Box>
            <Typography variant='body1' color='textSecondary'>
              {formatAddress()}
            </Typography>
            <Box className={styles.ratingContainer}>
              <Rating
                value={gym.averageRating || 0}
                precision={0.5}
                readOnly
                size='small'
              />
              <Typography variant='body2' color='textSecondary'>
                ({gym.totalReviews || 0} reviews)
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Gym Tabs */}
      <Paper className={styles.tabsContainer}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor='primary'
          textColor='primary'
          className={styles.tabs}
        >
          <Tab label='Details' />
          <Tab label='Instructors' />
          <Tab label='Reviews' />
        </Tabs>

        <Divider />

        <Box className={styles.tabContent}>
          {/* Details Tab */}
          {tabValue === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card title='Contact Information'>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <LocationOn />
                      </ListItemIcon>
                      <ListItemText
                        primary='Address'
                        secondary={formatAddress()}
                      />
                    </ListItem>
                    {gym.phone && (
                      <ListItem>
                        <ListItemIcon>
                          <Phone />
                        </ListItemIcon>
                        <ListItemText primary='Phone' secondary={gym.phone} />
                      </ListItem>
                    )}
                    {gym.email && (
                      <ListItem>
                        <ListItemIcon>
                          <Email />
                        </ListItemIcon>
                        <ListItemText primary='Email' secondary={gym.email} />
                      </ListItem>
                    )}
                    {gym.website && (
                      <ListItem>
                        <ListItemIcon>
                          <Language />
                        </ListItemIcon>
                        <ListItemText
                          primary='Website'
                          secondary={
                            <a
                              href={gym.website}
                              target='_blank'
                              rel='noopener noreferrer'
                              className={styles.websiteLink}
                            >
                              {gym.website}
                            </a>
                          }
                        />
                      </ListItem>
                    )}
                  </List>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card title='Business Hours'>
                  <List>
                    {gym.hours && gym.hours.length > 0 ? (
                      gym.hours.map((hour) => (
                        <ListItem key={hour.day}>
                          <ListItemIcon>
                            <Schedule />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              hour.day.charAt(0).toUpperCase() +
                              hour.day.slice(1)
                            }
                            secondary={
                              hour.isClosed
                                ? "Closed"
                                : `${hour.open} - ${hour.close}`
                            }
                          />
                        </ListItem>
                      ))
                    ) : (
                      <ListItem>
                        <ListItemText primary='No business hours provided' />
                      </ListItem>
                    )}
                  </List>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card title='About'>
                  <Typography variant='body1' className={styles.description}>
                    {gym.description || "No description provided."}
                  </Typography>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card title='Amenities'>
                  <Box className={styles.amenitiesContainer}>
                    {gym.amenities && gym.amenities.length > 0 ? (
                      gym.amenities.map((amenity) => (
                        <Chip
                          key={amenity}
                          label={amenity}
                          icon={<FitnessCenter />}
                          className={styles.amenityChip}
                        />
                      ))
                    ) : (
                      <Typography variant='body2' color='textSecondary'>
                        No amenities listed
                      </Typography>
                    )}
                  </Box>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* Instructors Tab */}
          {tabValue === 1 && (
            <Card title='Instructors'>
              <Typography variant='body2' color='textSecondary'>
                Gym instructors data will be displayed here
              </Typography>
            </Card>
          )}

          {/* Reviews Tab */}
          {tabValue === 2 && (
            <Card title='Reviews'>
              <Typography variant='body2' color='textSecondary'>
                Gym reviews data will be displayed here
              </Typography>
            </Card>
          )}
        </Box>
      </Paper>

      {/* Gym Actions Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        {!gym.isVerified && (
          <MenuItem onClick={handleVerifyGym}>
            <CheckCircle fontSize='small' className={styles.menuIcon} />
            Verify Gym
          </MenuItem>
        )}
        {gym.isVerified && (
          <MenuItem onClick={handleUnverifyGym}>
            <Block fontSize='small' className={styles.menuIcon} />
            Unverify Gym
          </MenuItem>
        )}
      </Menu>

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

export default GymDetails;
