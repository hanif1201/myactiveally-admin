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
  Rating,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Tab,
  Tabs,
  CircularProgress,
  Card as MuiCard,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Person,
  Email,
  Phone,
  LocationOn,
  CalendarToday,
  FitnessCenter,
  Star,
  VerifiedUser,
  ArrowBack,
  Edit,
  Block,
  CheckCircle,
  MoreVert,
  EventNote,
  AttachMoney,
  School,
  Work,
  Description,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Card from "../../components/common/Card";
import api from "../../api";
import { useNotification } from "../../hooks/useNotification";
import styles from "./InstructorDetails.module.css";
import { format } from "date-fns";

const InstructorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  const [instructor, setInstructor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    content: "",
    action: null,
  });

  // Fetch instructor details
  useEffect(() => {
    const fetchInstructorDetails = async () => {
      try {
        setLoading(true);
        const response = await api.instructors.getInstructorById(id);
        setInstructor(response.data);
      } catch (error) {
        showError("Failed to fetch instructor details");
        console.error("Error fetching instructor details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructorDetails();
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

  // Handle verify instructor
  const handleVerifyInstructor = () => {
    setConfirmDialog({
      open: true,
      title: "Verify Instructor",
      content:
        "Are you sure you want to verify this instructor? They will be able to offer their services on the platform.",
      action: async () => {
        try {
          await api.instructors.verifyInstructor(id);
          showSuccess("Instructor verified successfully");

          // Update instructor verification status
          setInstructor({
            ...instructor,
            isVerified: true,
          });
        } catch (error) {
          showError("Failed to verify instructor");
          console.error("Error verifying instructor:", error);
        }
      },
    });
    handleMenuClose();
  };

  // Handle unverify instructor
  const handleUnverifyInstructor = () => {
    setConfirmDialog({
      open: true,
      title: "Unverify Instructor",
      content:
        "Are you sure you want to unverify this instructor? They will no longer be able to offer their services on the platform.",
      action: async () => {
        try {
          // API call to unverify instructor
          // await api.instructors.unverifyInstructor(id);
          showSuccess("Instructor unverified successfully");

          // Update instructor verification status
          setInstructor({
            ...instructor,
            isVerified: false,
          });
        } catch (error) {
          showError("Failed to unverify instructor");
          console.error("Error unverifying instructor:", error);
        }
      },
    });
    handleMenuClose();
  };

  // Handle suspend instructor
  const handleSuspendInstructor = () => {
    setConfirmDialog({
      open: true,
      title: "Suspend Instructor",
      content:
        "Are you sure you want to suspend this instructor? Their account will be temporarily deactivated.",
      action: async () => {
        try {
          // API call to suspend instructor
          // await api.instructors.suspendInstructor(id);
          showSuccess("Instructor suspended successfully");

          // Update instructor status
          setInstructor({
            ...instructor,
            user: {
              ...instructor.user,
              accountStatus: "suspended",
            },
          });
        } catch (error) {
          showError("Failed to suspend instructor");
          console.error("Error suspending instructor:", error);
        }
      },
    });
    handleMenuClose();
  };

  // Handle activate instructor
  const handleActivateInstructor = () => {
    setConfirmDialog({
      open: true,
      title: "Activate Instructor",
      content: "Are you sure you want to activate this instructor?",
      action: async () => {
        try {
          // API call to activate instructor
          // await api.instructors.activateInstructor(id);
          showSuccess("Instructor activated successfully");

          // Update instructor status
          setInstructor({
            ...instructor,
            user: {
              ...instructor.user,
              accountStatus: "active",
            },
          });
        } catch (error) {
          showError("Failed to activate instructor");
          console.error("Error activating instructor:", error);
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

  if (loading) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress />
        <Typography variant='body1' sx={{ mt: 2 }}>
          Loading instructor details...
        </Typography>
      </Box>
    );
  }

  if (!instructor) {
    return (
      <Box className={styles.errorContainer}>
        <Typography variant='h6'>Instructor not found</Typography>
        <Button
          variant='contained'
          color='primary'
          startIcon={<ArrowBack />}
          onClick={() => navigate("/instructors")}
          sx={{ mt: 2 }}
        >
          Back to Instructors
        </Button>
      </Box>
    );
  }

  return (
    <Box className={styles.instructorDetailsContainer}>
      <PageHeader
        title='Instructor Details'
        breadcrumbs={[
          { label: "Instructors", link: "/instructors" },
          { label: instructor.user?.name, link: `/instructors/${id}` },
        ]}
        action={
          <Box>
            <Button
              variant='outlined'
              color='primary'
              startIcon={<ArrowBack />}
              onClick={() => navigate("/instructors")}
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

      {/* Instructor Profile Header */}
      <Paper className={styles.profileHeader}>
        <Box className={styles.profileHeaderContent}>
          <Avatar
            src={instructor.user?.profileImage}
            alt={instructor.user?.name}
            className={styles.avatar}
          />
          <Box className={styles.profileInfo}>
            <Box className={styles.profileNameRow}>
              <Typography variant='h4'>{instructor.user?.name}</Typography>
              {instructor.isVerified ? (
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
              {instructor.user?.accountStatus && (
                <Chip
                  label={
                    instructor.user.accountStatus.charAt(0).toUpperCase() +
                    instructor.user.accountStatus.slice(1)
                  }
                  color={
                    instructor.user.accountStatus === "active"
                      ? "success"
                      : instructor.user.accountStatus === "suspended"
                      ? "error"
                      : "default"
                  }
                  size='small'
                  className={styles.statusChip}
                />
              )}
            </Box>
            <Typography variant='body1' color='textSecondary'>
              {instructor.user?.email}
            </Typography>
            <Box className={styles.ratingContainer}>
              <Rating
                value={instructor.averageRating || 0}
                precision={0.5}
                readOnly
                size='small'
              />
              <Typography variant='body2' color='textSecondary'>
                ({instructor.totalReviews || 0} reviews)
              </Typography>
            </Box>
            <Box className={styles.profileDetails}>
              <Box className={styles.profileDetail}>
                <CalendarToday fontSize='small' color='action' />
                <Typography variant='body2'>
                  Joined{" "}
                  {instructor.user?.createdAt
                    ? format(new Date(instructor.user.createdAt), "MMMM yyyy")
                    : "N/A"}
                </Typography>
              </Box>
              {instructor.user?.location?.address && (
                <Box className={styles.profileDetail}>
                  <LocationOn fontSize='small' color='action' />
                  <Typography variant='body2'>
                    {instructor.user.location.address}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Instructor Tabs */}
      <Paper className={styles.tabsContainer}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor='primary'
          textColor='primary'
          className={styles.tabs}
        >
          <Tab label='Profile' />
          <Tab label='Consultations' />
          <Tab label='Reviews' />
          <Tab label='Earnings' />
        </Tabs>

        <Divider />

        <Box className={styles.tabContent}>
          {/* Profile Tab */}
          {tabValue === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card title='Personal Information'>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Email />
                      </ListItemIcon>
                      <ListItemText
                        primary='Email'
                        secondary={instructor.user?.email}
                      />
                    </ListItem>
                    {instructor.user?.phone && (
                      <ListItem>
                        <ListItemIcon>
                          <Phone />
                        </ListItemIcon>
                        <ListItemText
                          primary='Phone'
                          secondary={instructor.user.phone}
                        />
                      </ListItem>
                    )}
                    {instructor.user?.gender && (
                      <ListItem>
                        <ListItemIcon>
                          <Person />
                        </ListItemIcon>
                        <ListItemText
                          primary='Gender'
                          secondary={instructor.user.gender}
                        />
                      </ListItem>
                    )}
                    {instructor.user?.age && (
                      <ListItem>
                        <ListItemIcon>
                          <CalendarToday />
                        </ListItemIcon>
                        <ListItemText
                          primary='Age'
                          secondary={instructor.user.age}
                        />
                      </ListItem>
                    )}
                    {instructor.user?.location?.address && (
                      <ListItem>
                        <ListItemIcon>
                          <LocationOn />
                        </ListItemIcon>
                        <ListItemText
                          primary='Location'
                          secondary={instructor.user.location.address}
                        />
                      </ListItem>
                    )}
                  </List>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card title='Professional Information'>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Work />
                      </ListItemIcon>
                      <ListItemText
                        primary='Experience'
                        secondary={`${instructor.experience} years`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <AttachMoney />
                      </ListItemIcon>
                      <ListItemText
                        primary='Hourly Rate'
                        secondary={`$${instructor.hourlyRate}/hour`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <VerifiedUser />
                      </ListItemIcon>
                      <ListItemText
                        primary='Verification Status'
                        secondary={
                          instructor.isVerified ? "Verified" : "Not Verified"
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Star />
                      </ListItemIcon>
                      <ListItemText
                        primary='Rating'
                        secondary={
                          <Box display='flex' alignItems='center'>
                            <Rating
                              value={instructor.averageRating || 0}
                              precision={0.5}
                              readOnly
                              size='small'
                            />
                            <Typography
                              variant='body2'
                              color='textSecondary'
                              sx={{ ml: 1 }}
                            >
                              ({instructor.totalReviews || 0} reviews)
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  </List>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card title='Specializations'>
                  <Box className={styles.specializationsContainer}>
                    {instructor.specializations &&
                    instructor.specializations.length > 0 ? (
                      instructor.specializations.map((specialization) => (
                        <Chip
                          key={specialization}
                          label={specialization.replace("_", " ")}
                          className={styles.specializationChip}
                        />
                      ))
                    ) : (
                      <Typography variant='body2' color='textSecondary'>
                        No specializations listed
                      </Typography>
                    )}
                  </Box>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card title='About'>
                  <Typography variant='body1' className={styles.aboutText}>
                    {instructor.bio || "No bio information provided."}
                  </Typography>
                </Card>
              </Grid>

              {instructor.certificates &&
                instructor.certificates.length > 0 && (
                  <Grid item xs={12}>
                    <Card title='Certifications'>
                      <Grid container spacing={2}>
                        {instructor.certificates.map((certificate, index) => (
                          <Grid item xs={12} sm={6} md={4} key={index}>
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
                                <Typography
                                  variant='body2'
                                  color='textSecondary'
                                >
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
                            </MuiCard>
                          </Grid>
                        ))}
                      </Grid>
                    </Card>
                  </Grid>
                )}
            </Grid>
          )}

          {/* Consultations Tab */}
          {tabValue === 1 && (
            <Card title='Consultations'>
              <Typography variant='body2' color='textSecondary'>
                Instructor's consultation data will be displayed here
              </Typography>
            </Card>
          )}

          {/* Reviews Tab */}
          {tabValue === 2 && (
            <Card title='Reviews'>
              <Typography variant='body2' color='textSecondary'>
                Instructor's review data will be displayed here
              </Typography>
            </Card>
          )}

          {/* Earnings Tab */}
          {tabValue === 3 && (
            <Card title='Earnings'>
              <Typography variant='body2' color='textSecondary'>
                Instructor's earnings data will be displayed here
              </Typography>
            </Card>
          )}
        </Box>
      </Paper>

      {/* Instructor Actions Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        {!instructor.isVerified && (
          <MenuItem onClick={handleVerifyInstructor}>
            <CheckCircle fontSize='small' className={styles.menuIcon} />
            Verify Instructor
          </MenuItem>
        )}
        {instructor.isVerified && (
          <MenuItem onClick={handleUnverifyInstructor}>
            <Block fontSize='small' className={styles.menuIcon} />
            Unverify Instructor
          </MenuItem>
        )}
        {instructor.user?.accountStatus === "active" && (
          <MenuItem onClick={handleSuspendInstructor}>
            <Block fontSize='small' className={styles.menuIcon} />
            Suspend Instructor
          </MenuItem>
        )}
        {instructor.user?.accountStatus !== "active" && (
          <MenuItem onClick={handleActivateInstructor}>
            <CheckCircle fontSize='small' className={styles.menuIcon} />
            Activate Instructor
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

export default InstructorDetails;
