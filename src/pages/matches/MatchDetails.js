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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Person,
  CalendarToday,
  AccessTime,
  FitnessCenter,
  Chat,
  LocationOn,
  ArrowBack,
  MoreVert,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import PageHeader from "../../components/common/PageHeader";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Card from "../../components/common/Card";
import api from "../../api";
import { useNotification } from "../../hooks/useNotification";
import styles from "./MatchDetails.module.css";

const MatchDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    content: "",
    action: null,
  });

  // Fetch match details
  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        setLoading(true);
        const response = await api.matches.getMatchById(id);
        setMatch(response.data);
      } catch (error) {
        showError("Failed to fetch match details");
        console.error("Error fetching match details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchDetails();
  }, [id, showError]);

  // Handle menu open
  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  // Handle approve match
  const handleApproveMatch = () => {
    setConfirmDialog({
      open: true,
      title: "Approve Match",
      content: "Are you sure you want to approve this match?",
      action: async () => {
        try {
          // API call to approve match
          // await api.matches.approveMatch(id);
          showSuccess("Match approved successfully");

          // Update match status
          setMatch({
            ...match,
            status: "active",
          });
        } catch (error) {
          showError("Failed to approve match");
          console.error("Error approving match:", error);
        }
      },
    });
    handleMenuClose();
  };

  // Handle cancel match
  const handleCancelMatch = () => {
    setConfirmDialog({
      open: true,
      title: "Cancel Match",
      content: "Are you sure you want to cancel this match?",
      action: async () => {
        try {
          // API call to cancel match
          // await api.matches.cancelMatch(id);
          showSuccess("Match cancelled successfully");

          // Update match status
          setMatch({
            ...match,
            status: "cancelled",
          });
        } catch (error) {
          showError("Failed to cancel match");
          console.error("Error cancelling match:", error);
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

  // Format date
  const formatDate = (date) => {
    return format(new Date(date), "MMMM d, yyyy");
  };

  // Format time
  const formatTime = (time) => {
    if (!time) return "N/A";
    return format(new Date(time), "h:mm a");
  };

  // Render status chip
  const renderStatusChip = (status) => {
    switch (status) {
      case "pending":
        return <Chip label='Pending' color='warning' size='small' />;
      case "active":
        return <Chip label='Active' color='success' size='small' />;
      case "cancelled":
        return <Chip label='Cancelled' color='error' size='small' />;
      case "completed":
        return <Chip label='Completed' color='default' size='small' />;
      default:
        return <Chip label='Unknown' color='default' size='small' />;
    }
  };

  if (loading) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress />
        <Typography variant='body1' sx={{ mt: 2 }}>
          Loading match details...
        </Typography>
      </Box>
    );
  }

  if (!match) {
    return (
      <Box className={styles.errorContainer}>
        <Typography variant='h6'>Match not found</Typography>
        <Button
          variant='contained'
          color='primary'
          startIcon={<ArrowBack />}
          onClick={() => navigate("/matches")}
          sx={{ mt: 2 }}
        >
          Back to Matches
        </Button>
      </Box>
    );
  }

  return (
    <Box className={styles.matchDetailsContainer}>
      <PageHeader
        title='Match Details'
        breadcrumbs={[
          { label: "Matches", link: "/matches" },
          { label: `Match #${id.substring(0, 8)}`, link: `/matches/${id}` },
        ]}
        action={
          <Box>
            <Button
              variant='outlined'
              color='primary'
              startIcon={<ArrowBack />}
              onClick={() => navigate("/matches")}
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

      {/* Match Status Card */}
      <Paper className={styles.statusCard}>
        <Box className={styles.statusCardContent}>
          <Box>
            <Typography variant='overline' className={styles.statusLabel}>
              Match Status
            </Typography>
            {renderStatusChip(match.status)}
          </Box>

          <Box className={styles.matchInfo}>
            <Box className={styles.matchInfoItem}>
              <CalendarToday fontSize='small' color='action' />
              <Typography variant='body2'>
                Created: {formatDate(match.createdAt)}
              </Typography>
            </Box>
            {match.matchType && (
              <Box className={styles.matchInfoItem}>
                <FitnessCenter fontSize='small' color='action' />
                <Typography variant='body2'>Type: {match.matchType}</Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3} className={styles.contentGrid}>
        {/* User 1 Details */}
        <Grid item xs={12} md={6}>
          <Card title='User 1'>
            <Box className={styles.userProfile}>
              <Avatar
                src={match.user1?.profileImage}
                alt={match.user1?.name}
                className={styles.userAvatar}
              />
              <Box className={styles.userInfo}>
                <Typography variant='h6'>{match.user1?.name}</Typography>
                <Typography variant='body2' color='textSecondary'>
                  {match.user1?.email}
                </Typography>
              </Box>
            </Box>
            <Divider className={styles.divider} />
            <List dense>
              {match.user1?.fitnessLevel && (
                <ListItem>
                  <ListItemIcon>
                    <FitnessCenter />
                  </ListItemIcon>
                  <ListItemText
                    primary='Fitness Level'
                    secondary={match.user1.fitnessLevel}
                  />
                </ListItem>
              )}
              {match.user1?.location && (
                <ListItem>
                  <ListItemIcon>
                    <LocationOn />
                  </ListItemIcon>
                  <ListItemText
                    primary='Location'
                    secondary={match.user1.location}
                  />
                </ListItem>
              )}
            </List>
            <Button
              variant='outlined'
              fullWidth
              onClick={() => navigate(`/users/${match.user1?._id}`)}
              className={styles.viewProfileButton}
            >
              View Profile
            </Button>
          </Card>
        </Grid>

        {/* User 2 Details */}
        <Grid item xs={12} md={6}>
          <Card title='User 2'>
            <Box className={styles.userProfile}>
              <Avatar
                src={match.user2?.profileImage}
                alt={match.user2?.name}
                className={styles.userAvatar}
              />
              <Box className={styles.userInfo}>
                <Typography variant='h6'>{match.user2?.name}</Typography>
                <Typography variant='body2' color='textSecondary'>
                  {match.user2?.email}
                </Typography>
              </Box>
            </Box>
            <Divider className={styles.divider} />
            <List dense>
              {match.user2?.fitnessLevel && (
                <ListItem>
                  <ListItemIcon>
                    <FitnessCenter />
                  </ListItemIcon>
                  <ListItemText
                    primary='Fitness Level'
                    secondary={match.user2.fitnessLevel}
                  />
                </ListItem>
              )}
              {match.user2?.location && (
                <ListItem>
                  <ListItemIcon>
                    <LocationOn />
                  </ListItemIcon>
                  <ListItemText
                    primary='Location'
                    secondary={match.user2.location}
                  />
                </ListItem>
              )}
            </List>
            <Button
              variant='outlined'
              fullWidth
              onClick={() => navigate(`/users/${match.user2?._id}`)}
              className={styles.viewProfileButton}
            >
              View Profile
            </Button>
          </Card>
        </Grid>

        {/* Match Details */}
        <Grid item xs={12}>
          <Card title='Match Details'>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <FitnessCenter />
                    </ListItemIcon>
                    <ListItemText
                      primary='Match Type'
                      secondary={match.matchType || "General Workout"}
                    />
                  </ListItem>
                  {match.location && (
                    <ListItem>
                      <ListItemIcon>
                        <LocationOn />
                      </ListItemIcon>
                      <ListItemText
                        primary='Meeting Location'
                        secondary={match.location}
                      />
                    </ListItem>
                  )}
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CalendarToday />
                    </ListItemIcon>
                    <ListItemText
                      primary='Created On'
                      secondary={formatDate(match.createdAt)}
                    />
                  </ListItem>
                  {match.scheduledTime && (
                    <ListItem>
                      <ListItemIcon>
                        <AccessTime />
                      </ListItemIcon>
                      <ListItemText
                        primary='Scheduled Time'
                        secondary={formatTime(match.scheduledTime)}
                      />
                    </ListItem>
                  )}
                </List>
              </Grid>
            </Grid>
            {match.notes && (
              <>
                <Divider className={styles.divider} />
                <Typography variant='subtitle1' gutterBottom>
                  Notes
                </Typography>
                <Typography variant='body2'>{match.notes}</Typography>
              </>
            )}
          </Card>
        </Grid>

        {/* Messages */}
        <Grid item xs={12}>
          <Card title='Messages'>
            {match.messages && match.messages.length > 0 ? (
              <List>
                {match.messages.map((message, index) => (
                  <ListItem key={index} alignItems='flex-start'>
                    <ListItemAvatar>
                      <Avatar
                        src={message.sender?.profileImage}
                        alt={message.sender?.name}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant='subtitle2'>
                          {message.sender?.name}
                          <Typography
                            component='span'
                            variant='caption'
                            color='textSecondary'
                            sx={{ ml: 1 }}
                          >
                            {format(
                              new Date(message.timestamp),
                              "MMM d, yyyy h:mm a"
                            )}
                          </Typography>
                        </Typography>
                      }
                      secondary={message.content}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant='body2' color='textSecondary'>
                No messages exchanged yet
              </Typography>
            )}
          </Card>
        </Grid>
      </Grid>

      {/* Match Actions Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        {match.status === "pending" && (
          <MenuItem onClick={handleApproveMatch}>
            <CheckCircle fontSize='small' className={styles.menuIcon} />
            Approve Match
          </MenuItem>
        )}
        {["pending", "active"].includes(match.status) && (
          <MenuItem onClick={handleCancelMatch}>
            <Cancel fontSize='small' className={styles.menuIcon} />
            Cancel Match
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

export default MatchDetails;
