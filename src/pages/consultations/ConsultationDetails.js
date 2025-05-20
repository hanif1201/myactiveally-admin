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
  TextField,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  Person,
  Event,
  AccessTime,
  AttachMoney,
  LocationOn,
  Cancel,
  CheckCircle,
  ArrowBack,
  Notes,
  VideoCall,
  LocationCity,
  FitnessCenter,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import PageHeader from "../../components/common/PageHeader";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Card from "../../components/common/Card";
import api from "../../api";
import { useNotification } from "../../hooks/useNotification";
import styles from "./ConsultationDetails.module.css";

const ConsultationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  const [consultation, setConsultation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    content: "",
    action: null,
  });

  // Fetch consultation details
  useEffect(() => {
    const fetchConsultationDetails = async () => {
      try {
        setLoading(true);
        const response = await api.consultations.getConsultationById(id);
        setConsultation(response.data);

        // Set notes if available
        if (response.data.notes) {
          setNotes(response.data.notes);
        }
      } catch (error) {
        showError("Failed to fetch consultation details");
        console.error("Error fetching consultation details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultationDetails();
  }, [id, showError]);

  // Handle cancel consultation dialog
  const handleOpenCancelDialog = () => {
    setCancelDialogOpen(true);
  };

  const handleCloseCancelDialog = () => {
    setCancelDialogOpen(false);
  };

  // Handle complete consultation dialog
  const handleOpenCompleteDialog = () => {
    setCompleteDialogOpen(true);
  };

  const handleCloseCompleteDialog = () => {
    setCompleteDialogOpen(false);
  };

  // Handle notes change
  const handleNotesChange = (event) => {
    setNotes(event.target.value);
  };

  // Handle update consultation status
  const updateConsultationStatus = async (status) => {
    try {
      await api.consultations.updateConsultationStatus(id, status);
      showSuccess(`Consultation ${status} successfully`);

      // Update consultation status
      setConsultation({
        ...consultation,
        status,
      });

      // Close dialogs
      handleCloseCancelDialog();
      handleCloseCompleteDialog();
    } catch (error) {
      showError(`Failed to ${status} consultation`);
      console.error(`Error ${status} consultation:`, error);
    }
  };

  // Render status chip
  const renderStatusChip = (status) => {
    switch (status) {
      case "pending":
        return (
          <Chip label='Pending' color='warning' className={styles.statusChip} />
        );
      case "confirmed":
        return (
          <Chip
            label='Confirmed'
            color='primary'
            className={styles.statusChip}
          />
        );
      case "completed":
        return (
          <Chip
            label='Completed'
            color='success'
            className={styles.statusChip}
          />
        );
      case "cancelled":
        return (
          <Chip label='Cancelled' color='error' className={styles.statusChip} />
        );
      case "refunded":
        return (
          <Chip
            label='Refunded'
            color='default'
            className={styles.statusChip}
          />
        );
      default:
        return (
          <Chip label={status} color='default' className={styles.statusChip} />
        );
    }
  };

  // Format price
  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  // Format date and time
  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return format(date, "MMMM d, yyyy 'at' h:mm a");
  };

  // Calculate duration in hours and minutes
  const formatDuration = (duration) => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;

    let result = "";
    if (hours > 0) {
      result += `${hours} hr${hours > 1 ? "s" : ""} `;
    }
    if (minutes > 0 || hours === 0) {
      result += `${minutes} min${minutes > 1 ? "s" : ""}`;
    }

    return result;
  };

  if (loading) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress />
        <Typography variant='body1' sx={{ mt: 2 }}>
          Loading consultation details...
        </Typography>
      </Box>
    );
  }

  if (!consultation) {
    return (
      <Box className={styles.errorContainer}>
        <Typography variant='h6'>Consultation not found</Typography>
        <Button
          variant='contained'
          color='primary'
          startIcon={<ArrowBack />}
          onClick={() => navigate("/consultations")}
          sx={{ mt: 2 }}
        >
          Back to Consultations
        </Button>
      </Box>
    );
  }

  return (
    <Box className={styles.consultationDetailsContainer}>
      <PageHeader
        title='Consultation Details'
        breadcrumbs={[
          { label: "Consultations", link: "/consultations" },
          {
            label: `Consultation #${id.substring(0, 8)}`,
            link: `/consultations/${id}`,
          },
        ]}
        action={
          <Button
            variant='outlined'
            color='primary'
            startIcon={<ArrowBack />}
            onClick={() => navigate("/consultations")}
          >
            Back
          </Button>
        }
      />

      {/* Consultation Status Card */}
      <Paper className={styles.statusCard}>
        <Box className={styles.statusCardContent}>
          <Box>
            <Typography variant='overline' className={styles.statusLabel}>
              Status
            </Typography>
            {renderStatusChip(consultation.status)}
          </Box>

          <Box className={styles.statusActions}>
            {consultation.status === "pending" && (
              <>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={() => updateConsultationStatus("confirmed")}
                  startIcon={<CheckCircle />}
                  className={styles.statusButton}
                >
                  Confirm
                </Button>
                <Button
                  variant='outlined'
                  color='error'
                  onClick={handleOpenCancelDialog}
                  startIcon={<Cancel />}
                  className={styles.statusButton}
                >
                  Cancel
                </Button>
              </>
            )}

            {consultation.status === "confirmed" && (
              <>
                <Button
                  variant='contained'
                  color='success'
                  onClick={handleOpenCompleteDialog}
                  startIcon={<CheckCircle />}
                  className={styles.statusButton}
                >
                  Mark as Completed
                </Button>
                <Button
                  variant='outlined'
                  color='error'
                  onClick={handleOpenCancelDialog}
                  startIcon={<Cancel />}
                  className={styles.statusButton}
                >
                  Cancel
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3} className={styles.contentGrid}>
        {/* Consultation Details */}
        <Grid item xs={12} md={8}>
          <Card title='Consultation Information'>
            <Grid container spacing={3}>
              {/* Basic Details */}
              <Grid item xs={12} sm={6}>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Event />
                    </ListItemIcon>
                    <ListItemText
                      primary='Date & Time'
                      secondary={formatDateTime(consultation.startTime)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <AccessTime />
                    </ListItemIcon>
                    <ListItemText
                      primary='Duration'
                      secondary={formatDuration(consultation.duration)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <AttachMoney />
                    </ListItemIcon>
                    <ListItemText
                      primary='Price'
                      secondary={formatPrice(consultation.price)}
                    />
                  </ListItem>
                </List>
              </Grid>

              {/* Type & Location */}
              <Grid item xs={12} sm={6}>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <FitnessCenter />
                    </ListItemIcon>
                    <ListItemText
                      primary='Consultation Type'
                      secondary={consultation.consultationType}
                    />
                  </ListItem>

                  {consultation.locationType === "online" ? (
                    <ListItem>
                      <ListItemIcon>
                        <VideoCall />
                      </ListItemIcon>
                      <ListItemText
                        primary='Session Type'
                        secondary='Online Session'
                      />
                    </ListItem>
                  ) : (
                    <>
                      <ListItem>
                        <ListItemIcon>
                          <LocationOn />
                        </ListItemIcon>
                        <ListItemText
                          primary='Session Type'
                          secondary='In-Person Session'
                        />
                      </ListItem>
                      {consultation.location && (
                        <ListItem>
                          <ListItemIcon>
                            <LocationCity />
                          </ListItemIcon>
                          <ListItemText
                            primary='Location'
                            secondary={consultation.location}
                          />
                        </ListItem>
                      )}
                    </>
                  )}
                </List>
              </Grid>
            </Grid>

            <Divider className={styles.divider} />

            {/* Notes */}
            <Box className={styles.notesSection}>
              <Typography variant='h6' gutterBottom>
                Notes
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                variant='outlined'
                placeholder='Add consultation notes here...'
                value={notes}
                onChange={handleNotesChange}
                className={styles.notesField}
              />
              <Button
                variant='contained'
                color='primary'
                className={styles.saveButton}
              >
                Save Notes
              </Button>
            </Box>
          </Card>
        </Grid>

        {/* User & Instructor Info */}
        <Grid item xs={12} md={4}>
          {/* User Info */}
          <Card
            title='User Information'
            className={styles.profileCard}
            icon={<Person />}
          >
            <Box className={styles.profileInfo}>
              <Avatar
                src={consultation.user?.profileImage}
                alt={consultation.user?.name}
                className={styles.profileAvatar}
              />
              <Box>
                <Typography variant='h6'>{consultation.user?.name}</Typography>
                <Typography variant='body2' color='textSecondary'>
                  {consultation.user?.email}
                </Typography>
              </Box>
            </Box>
            <Divider className={styles.divider} />
            <List dense>
              <ListItem>
                <ListItemText
                  primary='Fitness Level'
                  secondary={consultation.user?.fitnessLevel || "Not specified"}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary='Fitness Goals'
                  secondary={
                    consultation.user?.fitnessGoals?.join(", ") ||
                    "Not specified"
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary='Member Since'
                  secondary={
                    consultation.user?.createdAt
                      ? format(
                          new Date(consultation.user.createdAt),
                          "MMMM yyyy"
                        )
                      : "Not available"
                  }
                />
              </ListItem>
            </List>
            <Button
              variant='outlined'
              fullWidth
              onClick={() => navigate(`/users/${consultation.user?._id}`)}
              className={styles.viewProfileButton}
            >
              View User Profile
            </Button>
          </Card>

          {/* Instructor Info */}
          <Card
            title='Instructor Information'
            className={`${styles.profileCard} ${styles.marginTop}`}
            icon={<Person />}
          >
            <Box className={styles.profileInfo}>
              <Avatar
                src={consultation.instructor?.user?.profileImage}
                alt={consultation.instructor?.user?.name}
                className={styles.profileAvatar}
              />
              <Box>
                <Typography variant='h6'>
                  {consultation.instructor?.user?.name}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  {consultation.instructor?.user?.email}
                </Typography>
              </Box>
            </Box>
            <Divider className={styles.divider} />
            <List dense>
              <ListItem>
                <ListItemText
                  primary='Specialization'
                  secondary={
                    consultation.instructor?.specializations?.join(", ") ||
                    "Not specified"
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary='Experience'
                  secondary={`${
                    consultation.instructor?.experience || 0
                  } years`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary='Hourly Rate'
                  secondary={`$${consultation.instructor?.hourlyRate || 0}/hr`}
                />
              </ListItem>
            </List>
            <Button
              variant='outlined'
              fullWidth
              onClick={() =>
                navigate(`/instructors/${consultation.instructor?._id}`)
              }
              className={styles.viewProfileButton}
            >
              View Instructor Profile
            </Button>
          </Card>
        </Grid>
      </Grid>

      {/* Cancel Consultation Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={handleCloseCancelDialog}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>Cancel Consultation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel this consultation? This action will
            notify both the user and instructor.
          </DialogContentText>
          <TextField
            autoFocus
            margin='dense'
            label='Cancellation Reason'
            fullWidth
            variant='outlined'
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelDialog} color='inherit'>
            No, Keep It
          </Button>
          <Button
            onClick={() => updateConsultationStatus("cancelled")}
            color='error'
            variant='contained'
          >
            Yes, Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Complete Consultation Dialog */}
      <Dialog
        open={completeDialogOpen}
        onClose={handleCloseCompleteDialog}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>Complete Consultation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to mark this consultation as completed? This
            will process the payment to the instructor.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCompleteDialog} color='inherit'>
            Cancel
          </Button>
          <Button
            onClick={() => updateConsultationStatus("completed")}
            color='success'
            variant='contained'
          >
            Mark as Completed
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        content={confirmDialog.content}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
        onConfirm={() => {
          if (confirmDialog.action) {
            confirmDialog.action();
          }
          setConfirmDialog({ ...confirmDialog, open: false });
        }}
      />
    </Box>
  );
};

export default ConsultationDetails;
