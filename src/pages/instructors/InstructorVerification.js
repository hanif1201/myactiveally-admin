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
  Rating,
} from "@mui/material";
import {
  Person,
  Email,
  Phone,
  LocationOn,
  School,
  VerifiedUser,
  CheckCircle,
  Cancel,
  Visibility,
  AttachMoney,
  Work,
  FitnessCenter,
  Description,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import api from "../../api";
import { useNotification } from "../../hooks/useNotification";
import { format } from "date-fns";
import styles from "./InstructorVerification.module.css";

const InstructorVerification = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  const [pendingInstructors, setPendingInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [verificationNote, setVerificationNote] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);

  // Fetch pending instructors
  useEffect(() => {
    const fetchPendingInstructors = async () => {
      try {
        setLoading(true);
        const response = await api.instructors.getAllInstructors({
          verified: "false",
        });
        setPendingInstructors(response.data.instructors);
      } catch (error) {
        showError("Failed to fetch pending instructors");
        console.error("Error fetching pending instructors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingInstructors();
  }, [showError]);

  // Handle select instructor
  const handleSelectInstructor = (instructor) => {
    setSelectedInstructor(instructor);
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

  // Handle verify instructor
  const handleVerifyInstructor = async () => {
    try {
      await api.instructors.verifyInstructor(selectedInstructor._id);
      showSuccess("Instructor verified successfully");

      // Remove instructor from pending list
      setPendingInstructors(
        pendingInstructors.filter(
          (instructor) => instructor._id !== selectedInstructor._id
        )
      );

      // Clear selected instructor
      setSelectedInstructor(null);
    } catch (error) {
      showError("Failed to verify instructor");
      console.error("Error verifying instructor:", error);
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

  // Handle reject instructor
  const handleRejectInstructor = async () => {
    try {
      // In a real application, you would implement the rejection API
      // await api.instructors.rejectInstructor(selectedInstructor._id, rejectionReason);

      showSuccess("Instructor rejected successfully");

      // Remove instructor from pending list
      setPendingInstructors(
        pendingInstructors.filter(
          (instructor) => instructor._id !== selectedInstructor._id
        )
      );

      // Clear selected instructor
      setSelectedInstructor(null);
      handleCloseRejectionDialog();
    } catch (error) {
      showError("Failed to reject instructor");
      console.error("Error rejecting instructor:", error);
      handleCloseRejectionDialog();
    }
  };

  // Handle view instructor details
  const handleViewInstructorDetails = () => {
    navigate(`/instructors/${selectedInstructor._id}`);
  };

  return (
    <Box className={styles.verificationContainer}>
      <PageHeader
        title='Instructor Verification'
        breadcrumbs={[
          { label: "Instructors", link: "/instructors" },
          { label: "Verification", link: "/instructors/verification" },
        ]}
        action={
          <Button variant='outlined' onClick={() => navigate("/instructors")}>
            Back to Instructors
          </Button>
        }
      />

      <Grid container spacing={3}>
        {/* Pending Instructors List */}
        <Grid item xs={12} md={4}>
          <Paper className={styles.pendingListPaper}>
            <Typography variant='h6' className={styles.pendingListTitle}>
              Pending Verification
              <Chip
                label={pendingInstructors.length}
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
                  Loading instructors...
                </Typography>
              </Box>
            ) : pendingInstructors.length === 0 ? (
              <Box className={styles.emptyListContainer}>
                <Typography variant='body2' color='textSecondary'>
                  No pending verification requests
                </Typography>
              </Box>
            ) : (
              <List className={styles.pendingList}>
                {pendingInstructors.map((instructor) => (
                  <ListItem
                    key={instructor._id}
                    button
                    selected={selectedInstructor?._id === instructor._id}
                    onClick={() => handleSelectInstructor(instructor)}
                    className={styles.pendingListItem}
                  >
                    <Avatar
                      src={instructor.user?.profileImage}
                      alt={instructor.user?.name}
                      className={styles.listItemAvatar}
                    />
                    <ListItemText
                      primary={instructor.user?.name}
                      secondary={`${instructor.experience} years experience`}
                    />
                    <Chip label='Pending' color='warning' size='small' />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Instructor Details */}
        <Grid item xs={12} md={8}>
          {!selectedInstructor ? (
            <Paper className={styles.noSelectionPaper}>
              <Typography variant='h6' align='center'>
                Select an instructor to review their verification request
              </Typography>
              <Typography variant='body2' color='textSecondary' align='center'>
                View instructor details, credentials, and certifications to
                verify their profile
              </Typography>
            </Paper>
          ) : (
            <Box>
              {/* Instructor Profile */}
              <Paper className={styles.instructorDetailsPaper}>
                <Box className={styles.instructorHeader}>
                  <Box className={styles.instructorInfo}>
                    <Avatar
                      src={selectedInstructor.user?.profileImage}
                      alt={selectedInstructor.user?.name}
                      className={styles.instructorAvatar}
                    />
                    <Box>
                      <Typography variant='h5'>
                        {selectedInstructor.user?.name}
                      </Typography>
                      <Typography variant='body2' color='textSecondary'>
                        {selectedInstructor.user?.email}
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    variant='outlined'
                    startIcon={<Visibility />}
                    onClick={handleViewInstructorDetails}
                    className={styles.viewDetailsButton}
                  >
                    View Full Profile
                  </Button>
                </Box>

                <Divider className={styles.divider} />

                {/* Basic Information */}
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant='h6' className={styles.sectionTitle}>
                      Personal Information
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <Email />
                        </ListItemIcon>
                        <ListItemText
                          primary='Email'
                          secondary={selectedInstructor.user?.email}
                        />
                      </ListItem>
                      {selectedInstructor.user?.phone && (
                        <ListItem>
                          <ListItemIcon>
                            <Phone />
                          </ListItemIcon>
                          <ListItemText
                            primary='Phone'
                            secondary={selectedInstructor.user.phone}
                          />
                        </ListItem>
                      )}
                      {selectedInstructor.user?.location?.address && (
                        <ListItem>
                          <ListItemIcon>
                            <LocationOn />
                          </ListItemIcon>
                          <ListItemText
                            primary='Location'
                            secondary={selectedInstructor.user.location.address}
                          />
                        </ListItem>
                      )}
                      {selectedInstructor.user?.createdAt && (
                        <ListItem>
                          <ListItemIcon>
                            <Person />
                          </ListItemIcon>
                          <ListItemText
                            primary='Account Created'
                            secondary={format(
                              new Date(selectedInstructor.user.createdAt),
                              "MMMM d, yyyy"
                            )}
                          />
                        </ListItem>
                      )}
                    </List>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant='h6' className={styles.sectionTitle}>
                      Professional Information
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <Work />
                        </ListItemIcon>
                        <ListItemText
                          primary='Experience'
                          secondary={`${selectedInstructor.experience} years`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <AttachMoney />
                        </ListItemIcon>
                        <ListItemText
                          primary='Hourly Rate'
                          secondary={`$${selectedInstructor.hourlyRate}/hour`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <FitnessCenter />
                        </ListItemIcon>
                        <ListItemText
                          primary='Specializations'
                          secondary={
                            selectedInstructor.specializations
                              ? selectedInstructor.specializations.join(", ")
                              : "None listed"
                          }
                        />
                      </ListItem>
                    </List>
                  </Grid>
                </Grid>

                <Divider className={styles.divider} />

                {/* Bio */}
                <Typography variant='h6' className={styles.sectionTitle}>
                  About
                </Typography>
                <Typography variant='body1' className={styles.bioText}>
                  {selectedInstructor.bio || "No bio information provided."}
                </Typography>

                <Divider className={styles.divider} />

                {/* Certifications */}
                <Typography variant='h6' className={styles.sectionTitle}>
                  Certifications
                </Typography>

                {selectedInstructor.certificates &&
                selectedInstructor.certificates.length > 0 ? (
                  <Grid container spacing={2}>
                    {selectedInstructor.certificates.map(
                      (certificate, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <MuiCard className={styles.certificationCard}>
                            <CardContent>
                              <Typography variant='h6' gutterBottom>
                                {certificate.name}
                              </Typography>
                              <Typography
                                variant='body2'
                                color='textSecondary'
                                gutterBottom
                              >
                                Issued by: {certificate.issuedBy}
                              </Typography>
                              <Typography variant='body2' color='textSecondary'>
                                Issued on:{" "}
                                {format(
                                  new Date(certificate.issuedDate),
                                  "MMMM yyyy"
                                )}
                              </Typography>
                              {certificate.expiryDate && (
                                <Typography
                                  variant='body2'
                                  color='textSecondary'
                                >
                                  Expires on:{" "}
                                  {format(
                                    new Date(certificate.expiryDate),
                                    "MMMM yyyy"
                                  )}
                                </Typography>
                              )}
                            </CardContent>
                            {certificate.documentUrl && (
                              <CardActions>
                                <Button
                                  size='small'
                                  color='primary'
                                  href={certificate.documentUrl}
                                  target='_blank'
                                  rel='noopener noreferrer'
                                >
                                  View Certificate
                                </Button>
                              </CardActions>
                            )}
                          </MuiCard>
                        </Grid>
                      )
                    )}
                  </Grid>
                ) : (
                  <Typography variant='body2' color='textSecondary'>
                    No certifications uploaded
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
                      onClick={handleVerifyInstructor}
                    >
                      Verify Instructor
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
        <DialogTitle>Reject Instructor Verification</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please provide a reason for rejecting this instructor verification
            request. This message will be sent to the instructor.
          </DialogContentText>
          <TextField
            autoFocus
            margin='dense'
            label='Rejection Reason'
            placeholder='e.g., Insufficient certification details, Missing relevant experience, etc.'
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
            onClick={handleRejectInstructor}
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

export default InstructorVerification;
