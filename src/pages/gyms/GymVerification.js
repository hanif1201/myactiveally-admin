import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Divider,
  Chip,
  Avatar,
  TextField,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Card as MuiCard,
  CardContent,
  CardMedia,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  LocationOn,
  Phone,
  Language,
  Email,
  Schedule,
  CheckCircle,
  Cancel,
  Fitness,
  VerifiedUser,
  Visibility,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import api from "../../api";
import { useNotification } from "../../hooks/useNotification";
import styles from "./GymVerification.module.css";

const GymVerification = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  const [pendingGyms, setPendingGyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGym, setSelectedGym] = useState(null);
  const [verificationNote, setVerificationNote] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);

  // Fetch pending gyms
  useEffect(() => {
    const fetchPendingGyms = async () => {
      try {
        setLoading(true);
        const response = await api.gyms.getAllGyms({
          verified: "false",
        });
        setPendingGyms(response.data.gyms);
      } catch (error) {
        showError("Failed to fetch pending gyms");
        console.error("Error fetching pending gyms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingGyms();
  }, [showError]);

  // Handle select gym
  const handleSelectGym = (gym) => {
    setSelectedGym(gym);
    setVerificationNote("");
    setRejectionReason("");
  };

  // Handle verification note change
  const handleVerificationNoteChange = (event) => {
    setVerificationNote(event.target.value);
  };

  // Handle rejection reason change
  const handleRejectionReasonChange = (event) => {
    setRejectionReason(event.target.value);
  };

  // Handle verify gym
  const handleVerifyGym = async () => {
    try {
      await api.gyms.verifyGym(selectedGym._id);
      showSuccess("Gym verified successfully");

      // Remove gym from pending list
      setPendingGyms(pendingGyms.filter((gym) => gym._id !== selectedGym._id));

      // Clear selected gym
      setSelectedGym(null);
    } catch (error) {
      showError("Failed to verify gym");
      console.error("Error verifying gym:", error);
    }
  };

  // Handle open rejection dialog
  const handleOpenRejectionDialog = () => {
    setRejectionDialogOpen(true);
  };

  // Handle close rejection dialog
  const handleCloseRejectionDialog = () => {
    setRejectionDialogOpen(false);
  };

  // Handle reject gym
  const handleRejectGym = async () => {
    try {
      // In a real application, you would implement the rejection API
      // await api.gyms.rejectGym(selectedGym._id, rejectionReason);

      showSuccess("Gym rejected successfully");

      // Remove gym from pending list
      setPendingGyms(pendingGyms.filter((gym) => gym._id !== selectedGym._id));

      // Clear selected gym
      setSelectedGym(null);
      handleCloseRejectionDialog();
    } catch (error) {
      showError("Failed to reject gym");
      console.error("Error rejecting gym:", error);
      handleCloseRejectionDialog();
    }
  };

  // Handle view gym details
  const handleViewGymDetails = () => {
    navigate(`/gyms/${selectedGym._id}`);
  };

  // Format address
  const formatAddress = (gym) => {
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

  return (
    <Box className={styles.verificationContainer}>
      <PageHeader
        title='Gym Verification'
        breadcrumbs={[
          { label: "Gyms", link: "/gyms" },
          { label: "Verification", link: "/gyms/verification" },
        ]}
        action={
          <Button variant='outlined' onClick={() => navigate("/gyms")}>
            Back to Gyms
          </Button>
        }
      />

      <Grid container spacing={3}>
        {/* Pending Gyms List */}
        <Grid item xs={12} md={4}>
          <Paper className={styles.pendingListPaper}>
            <Typography variant='h6' className={styles.pendingListTitle}>
              Pending Verification
              <Chip
                label={pendingGyms.length}
                color='primary'
                size='small'
                className={styles.pendingCountChip}
              />
            </Typography>
            <Divider />

            {loading ? (
              <Box className={styles.loadingContainer}>
                <CircularProgress size={30} />
                <Typography variant='body2' sx={{ mt: 1 }}>
                  Loading gyms...
                </Typography>
              </Box>
            ) : pendingGyms.length === 0 ? (
              <Box className={styles.emptyListContainer}>
                <Typography variant='body2' color='textSecondary'>
                  No pending verification requests
                </Typography>
              </Box>
            ) : (
              <List className={styles.pendingList}>
                {pendingGyms.map((gym) => (
                  <ListItem
                    key={gym._id}
                    button
                    selected={selectedGym?._id === gym._id}
                    onClick={() => handleSelectGym(gym)}
                    className={styles.pendingListItem}
                  >
                    <ListItemText
                      primary={gym.name}
                      secondary={formatAddress(gym)}
                    />
                    <Chip label='Pending' color='warning' size='small' />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Gym Details */}
        <Grid item xs={12} md={8}>
          {!selectedGym ? (
            <Paper className={styles.noSelectionPaper}>
              <Typography variant='h6' align='center'>
                Select a gym to review their verification request
              </Typography>
              <Typography variant='body2' color='textSecondary' align='center'>
                View gym details, location, and amenities to verify their
                profile
              </Typography>
            </Paper>
          ) : (
            <Box>
              {/* Gym Profile */}
              <Paper className={styles.gymDetailsPaper}>
                <Box className={styles.gymHeader}>
                  <Box className={styles.gymInfo}>
                    <Typography variant='h5'>{selectedGym.name}</Typography>
                    <Typography variant='body2' color='textSecondary'>
                      {formatAddress(selectedGym)}
                    </Typography>
                  </Box>
                  <Button
                    variant='outlined'
                    startIcon={<Visibility />}
                    onClick={handleViewGymDetails}
                    className={styles.viewDetailsButton}
                  >
                    View Details
                  </Button>
                </Box>

                {selectedGym.photos && selectedGym.photos.length > 0 && (
                  <Box className={styles.gymPhotosContainer}>
                    {selectedGym.photos.slice(0, 3).map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`${selectedGym.name} - Photo ${index + 1}`}
                        className={styles.gymPhoto}
                      />
                    ))}
                  </Box>
                )}

                <Divider className={styles.divider} />

                {/* Basic Information */}
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant='h6' className={styles.sectionTitle}>
                      Contact Information
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <LocationOn />
                        </ListItemIcon>
                        <ListItemText
                          primary='Address'
                          secondary={formatAddress(selectedGym)}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <Phone />
                        </ListItemIcon>
                        <ListItemText
                          primary='Phone'
                          secondary={selectedGym.phone || "N/A"}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <Email />
                        </ListItemIcon>
                        <ListItemText
                          primary='Email'
                          secondary={selectedGym.email || "N/A"}
                        />
                      </ListItem>
                      {selectedGym.website && (
                        <ListItem>
                          <ListItemIcon>
                            <Language />
                          </ListItemIcon>
                          <ListItemText
                            primary='Website'
                            secondary={
                              <a
                                href={selectedGym.website}
                                target='_blank'
                                rel='noopener noreferrer'
                                className={styles.websiteLink}
                              >
                                {selectedGym.website}
                              </a>
                            }
                          />
                        </ListItem>
                      )}
                    </List>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant='h6' className={styles.sectionTitle}>
                      Amenities
                    </Typography>
                    <Box className={styles.amenitiesContainer}>
                      {selectedGym.amenities &&
                      selectedGym.amenities.length > 0 ? (
                        selectedGym.amenities.map((amenity, index) => (
                          <Chip
                            key={index}
                            label={amenity}
                            color='primary'
                            size='small'
                            className={styles.amenityChip}
                          />
                        ))
                      ) : (
                        <Typography variant='body2' color='textSecondary'>
                          No amenities listed
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                </Grid>

                <Divider className={styles.divider} />

                {/* Description */}
                <Typography variant='h6' className={styles.sectionTitle}>
                  Description
                </Typography>
                <Typography variant='body2' className={styles.description}>
                  {selectedGym.description || "No description provided"}
                </Typography>

                <Divider className={styles.divider} />

                {/* Hours */}
                <Typography variant='h6' className={styles.sectionTitle}>
                  Business Hours
                </Typography>

                {selectedGym.hours && selectedGym.hours.length > 0 ? (
                  <Grid container spacing={2}>
                    {[
                      "monday",
                      "tuesday",
                      "wednesday",
                      "thursday",
                      "friday",
                      "saturday",
                      "sunday",
                    ].map((day) => {
                      const dayHours = selectedGym.hours.find(
                        (h) => h.day === day
                      );
                      return (
                        <Grid item xs={12} sm={6} md={4} key={day}>
                          <Box className={styles.hoursItem}>
                            <Typography
                              variant='subtitle2'
                              className={styles.dayName}
                            >
                              {day.charAt(0).toUpperCase() + day.slice(1)}
                            </Typography>
                            {dayHours ? (
                              dayHours.isClosed ? (
                                <Typography
                                  variant='body2'
                                  color='textSecondary'
                                >
                                  Closed
                                </Typography>
                              ) : (
                                <Typography variant='body2'>
                                  {dayHours.open} - {dayHours.close}
                                </Typography>
                              )
                            ) : (
                              <Typography variant='body2' color='textSecondary'>
                                Not specified
                              </Typography>
                            )}
                          </Box>
                        </Grid>
                      );
                    })}
                  </Grid>
                ) : (
                  <Typography variant='body2' color='textSecondary'>
                    No business hours provided
                  </Typography>
                )}

                <Divider className={styles.divider} />

                {/* Verification Actions */}
                <Box className={styles.verificationActions}>
                  <TextField
                    label='Verification Notes'
                    placeholder='Add notes about this verification (optional)'
                    value={verificationNote}
                    onChange={handleVerificationNoteChange}
                    multiline
                    rows={3}
                    fullWidth
                    variant='outlined'
                    className={styles.verificationNotes}
                  />

                  <Box className={styles.actionsButtonGroup}>
                    <Button
                      variant='contained'
                      color='primary'
                      startIcon={<CheckCircle />}
                      onClick={handleVerifyGym}
                    >
                      Verify Gym
                    </Button>
                    <Button
                      variant='outlined'
                      color='error'
                      startIcon={<Cancel />}
                      onClick={handleOpenRejectionDialog}
                    >
                      Reject
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Box>
          )}
        </Grid>
      </Grid>

      {/* Rejection Dialog */}
      <Dialog
        open={rejectionDialogOpen}
        onClose={handleCloseRejectionDialog}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>Reject Gym Verification</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please provide a reason for rejecting this gym verification request.
            This message will be sent to the gym owner.
          </DialogContentText>
          <TextField
            autoFocus
            margin='dense'
            label='Rejection Reason'
            placeholder='e.g., Address information is incomplete, Unable to verify location, etc.'
            value={rejectionReason}
            onChange={handleRejectionReasonChange}
            fullWidth
            multiline
            rows={4}
            variant='outlined'
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRejectionDialog} color='inherit'>
            Cancel
          </Button>
          <Button
            onClick={handleRejectGym}
            color='error'
            variant='contained'
            disabled={!rejectionReason.trim()}
          >
            Reject Verification
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GymVerification;
