import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Grid,
  Typography,
  Avatar,
  Divider,
  Chip,
  Button,
  CircularProgress,
  Tabs,
  Tab,
  IconButton,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import {
  Person,
  Email,
  Phone,
  LocationOn,
  CalendarToday,
  FitnessCenter,
  ArrowBack,
  Edit,
  Block,
  CheckCircle,
  Delete,
  MoreVert,
  FavoriteBorder,
  EventNote,
  People,
  Star,
  VerifiedUser,
  AttachMoney,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Card from "../../components/common/Card";
import api from "../../api";
import { useNotification } from "../../hooks/useNotification";
import styles from "./UserDetails.module.css";

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    content: "",
    action: null,
  });

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const response = await api.users.getUserById(id);
        setUser(response.data);
      } catch (error) {
        showError("Failed to fetch user details");
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
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

  // Handle edit user
  const handleEditUser = () => {
    navigate(`/users/edit/${id}`);
    handleMenuClose();
  };

  // Handle suspend user
  const handleSuspendUser = () => {
    setConfirmDialog({
      open: true,
      title: "Suspend User",
      content:
        "Are you sure you want to suspend this user? They will not be able to access the platform until reactivated.",
      action: async () => {
        try {
          await api.users.updateUserStatus(id, "suspended");
          showSuccess("User suspended successfully");
          // Update user status
          setUser({
            ...user,
            accountStatus: "suspended",
            isActive: false,
          });
        } catch (error) {
          showError("Failed to suspend user");
          console.error("Error suspending user:", error);
        }
      },
    });
    handleMenuClose();
  };

  // Handle activate user
  const handleActivateUser = () => {
    setConfirmDialog({
      open: true,
      title: "Activate User",
      content: "Are you sure you want to activate this user?",
      action: async () => {
        try {
          await api.users.updateUserStatus(id, "active");
          showSuccess("User activated successfully");
          // Update user status
          setUser({
            ...user,
            accountStatus: "active",
            isActive: true,
          });
        } catch (error) {
          showError("Failed to activate user");
          console.error("Error activating user:", error);
        }
      },
    });
    handleMenuClose();
  };

  // Handle delete user
  const handleDeleteUser = () => {
    setConfirmDialog({
      open: true,
      title: "Delete User",
      content:
        "Are you sure you want to delete this user? This action cannot be undone.",
      action: async () => {
        try {
          await api.users.deleteUser(id);
          showSuccess("User deleted successfully");
          navigate("/users");
        } catch (error) {
          showError("Failed to delete user");
          console.error("Error deleting user:", error);
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

  // Render status chip
  const renderStatusChip = (status) => {
    switch (status) {
      case "active":
        return <Chip label='Active' color='success' size='small' />;
      case "inactive":
        return <Chip label='Inactive' color='default' size='small' />;
      case "suspended":
        return <Chip label='Suspended' color='warning' size='small' />;
      case "deleted":
        return <Chip label='Deleted' color='error' size='small' />;
      default:
        return <Chip label='Unknown' color='default' size='small' />;
    }
  };

  if (loading) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress />
        <Typography variant='body1' sx={{ mt: 2 }}>
          Loading user details...
        </Typography>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box className={styles.errorContainer}>
        <Typography variant='h6'>User not found</Typography>
        <Button
          variant='contained'
          color='primary'
          startIcon={<ArrowBack />}
          onClick={() => navigate("/users")}
          sx={{ mt: 2 }}
        >
          Back to Users
        </Button>
      </Box>
    );
  }

  return (
    <Box className={styles.userDetailsContainer}>
      <PageHeader
        title='User Details'
        breadcrumbs={[
          { label: "Users", link: "/users" },
          { label: user.name, link: `/users/${id}` },
        ]}
        action={
          <Box>
            <Button
              variant='outlined'
              color='primary'
              startIcon={<ArrowBack />}
              onClick={() => navigate("/users")}
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

      {/* User Profile Header */}
      <Paper className={styles.profileHeader}>
        <Box className={styles.profileHeaderContent}>
          <Avatar
            src={user.profileImage}
            alt={user.name}
            className={styles.avatar}
          />
          <Box className={styles.profileInfo}>
            <Box className={styles.profileNameRow}>
              <Typography variant='h4'>{user.name}</Typography>
              {renderStatusChip(user.accountStatus)}
            </Box>
            <Typography variant='body1' color='textSecondary'>
              {user.email}
            </Typography>
            <Box className={styles.profileDetails}>
              <Box className={styles.profileDetail}>
                <CalendarToday fontSize='small' color='action' />
                <Typography variant='body2'>
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
              {user.location?.address && (
                <Box className={styles.profileDetail}>
                  <LocationOn fontSize='small' color='action' />
                  <Typography variant='body2'>
                    {user.location.address}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* User Details Tabs */}
      <Paper className={styles.tabsContainer}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor='primary'
          textColor='primary'
          className={styles.tabs}
        >
          <Tab label='Profile' />
          <Tab label='Matches' />
          <Tab label='Consultations' />
          <Tab label='Workouts' />
          <Tab label='Activity' />
        </Tabs>

        <Divider />

        <Box className={styles.tabContent}>
          {/* Profile Tab */}
          {tabValue === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card title='Basic Information'>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Person />
                      </ListItemIcon>
                      <ListItemText
                        primary='User Type'
                        secondary={
                          user.userType === "instructor"
                            ? "Instructor"
                            : "Regular User"
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Email />
                      </ListItemIcon>
                      <ListItemText primary='Email' secondary={user.email} />
                    </ListItem>
                    {user.age && (
                      <ListItem>
                        <ListItemIcon>
                          <CalendarToday />
                        </ListItemIcon>
                        <ListItemText primary='Age' secondary={user.age} />
                      </ListItem>
                    )}
                    {user.gender && (
                      <ListItem>
                        <ListItemIcon>
                          <Person />
                        </ListItemIcon>
                        <ListItemText
                          primary='Gender'
                          secondary={user.gender}
                        />
                      </ListItem>
                    )}
                    {user.location?.address && (
                      <ListItem>
                        <ListItemIcon>
                          <LocationOn />
                        </ListItemIcon>
                        <ListItemText
                          primary='Location'
                          secondary={user.location.address}
                        />
                      </ListItem>
                    )}
                  </List>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card title='Fitness Information'>
                  <List>
                    {user.fitnessLevel && (
                      <ListItem>
                        <ListItemIcon>
                          <FitnessCenter />
                        </ListItemIcon>
                        <ListItemText
                          primary='Fitness Level'
                          secondary={user.fitnessLevel}
                        />
                      </ListItem>
                    )}
                    {user.fitnessGoals && user.fitnessGoals.length > 0 && (
                      <ListItem>
                        <ListItemIcon>
                          <FitnessCenter />
                        </ListItemIcon>
                        <ListItemText
                          primary='Fitness Goals'
                          secondary={
                            <Box className={styles.chipContainer}>
                              {user.fitnessGoals.map((goal) => (
                                <Chip
                                  key={goal}
                                  label={goal.replace("_", " ")}
                                  size='small'
                                  className={styles.chip}
                                />
                              ))}
                            </Box>
                          }
                        />
                      </ListItem>
                    )}
                    {user.preferredWorkouts &&
                      user.preferredWorkouts.length > 0 && (
                        <ListItem>
                          <ListItemIcon>
                            <FitnessCenter />
                          </ListItemIcon>
                          <ListItemText
                            primary='Preferred Workouts'
                            secondary={
                              <Box className={styles.chipContainer}>
                                {user.preferredWorkouts.map((workout) => (
                                  <Chip
                                    key={workout}
                                    label={workout.replace("_", " ")}
                                    size='small'
                                    className={styles.chip}
                                  />
                                ))}
                              </Box>
                            }
                          />
                        </ListItem>
                      )}
                  </List>
                </Card>
              </Grid>

              {user.userType === "instructor" && user.instructorProfile && (
                <Grid item xs={12}>
                  <Card title='Instructor Information'>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <List>
                          <ListItem>
                            <ListItemIcon>
                              <FitnessCenter />
                            </ListItemIcon>
                            <ListItemText
                              primary='Experience'
                              secondary={`${user.instructorProfile.experience} years`}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <AttachMoney />
                            </ListItemIcon>
                            <ListItemText
                              primary='Hourly Rate'
                              secondary={`$${user.instructorProfile.hourlyRate}`}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <Star />
                            </ListItemIcon>
                            <ListItemText
                              primary='Rating'
                              secondary={`${user.instructorProfile.averageRating} (${user.instructorProfile.totalReviews} reviews)`}
                            />
                          </ListItem>
                        </List>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <ListItem>
                          <ListItemIcon>
                            <FitnessCenter />
                          </ListItemIcon>
                          <ListItemText
                            primary='Specializations'
                            secondary={
                              <Box className={styles.chipContainer}>
                                {user.instructorProfile.specializations.map(
                                  (spec) => (
                                    <Chip
                                      key={spec}
                                      label={spec.replace("_", " ")}
                                      size='small'
                                      className={styles.chip}
                                    />
                                  )
                                )}
                              </Box>
                            }
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <VerifiedUser />
                          </ListItemIcon>
                          <ListItemText
                            primary='Verification Status'
                            secondary={
                              user.instructorProfile.isVerified ? (
                                <Chip
                                  label='Verified'
                                  color='success'
                                  size='small'
                                />
                              ) : (
                                <Chip
                                  label='Pending Verification'
                                  color='warning'
                                  size='small'
                                />
                              )
                            }
                          />
                        </ListItem>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              )}
            </Grid>
          )}

          {/* Matches Tab */}
          {tabValue === 1 && (
            <Card title='Matches'>
              <Typography variant='body2' color='textSecondary'>
                User's match data will be displayed here
              </Typography>
            </Card>
          )}

          {/* Consultations Tab */}
          {tabValue === 2 && (
            <Card title='Consultations'>
              <Typography variant='body2' color='textSecondary'>
                User's consultation data will be displayed here
              </Typography>
            </Card>
          )}

          {/* Workouts Tab */}
          {tabValue === 3 && (
            <Card title='Workouts'>
              <Typography variant='body2' color='textSecondary'>
                User's workout data will be displayed here
              </Typography>
            </Card>
          )}

          {/* Activity Tab */}
          {tabValue === 4 && (
            <Card title='Activity Log'>
              <Typography variant='body2' color='textSecondary'>
                User's activity data will be displayed here
              </Typography>
            </Card>
          )}
        </Box>
      </Paper>

      {/* User Actions Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditUser}>
          <Edit fontSize='small' className={styles.menuIcon} />
          Edit User
        </MenuItem>
        {user.accountStatus === "active" && (
          <MenuItem onClick={handleSuspendUser}>
            <Block fontSize='small' className={styles.menuIcon} />
            Suspend User
          </MenuItem>
        )}
        {["inactive", "suspended"].includes(user.accountStatus) && (
          <MenuItem onClick={handleActivateUser}>
            <CheckCircle fontSize='small' className={styles.menuIcon} />
            Activate User
          </MenuItem>
        )}
        <MenuItem onClick={handleDeleteUser} className={styles.deleteMenuItem}>
          <Delete fontSize='small' className={styles.menuIcon} />
          Delete User
        </MenuItem>
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
        confirmColor={
          confirmDialog.title.includes("Delete") ? "error" : "primary"
        }
      />
    </Box>
  );
};

export default UserDetails;
