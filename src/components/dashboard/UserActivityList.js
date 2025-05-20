import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Button,
  Divider,
} from "@mui/material";
import {
  PersonAdd as PersonAddIcon,
  VerifiedUser as VerifiedUserIcon,
  EventNote as EventNoteIcon,
  Favorite as FavoriteIcon,
  FitnessCenter as FitnessCenterIcon,
} from "@mui/icons-material";
import { format, formatDistanceToNow } from "date-fns";
import Card from "../common/Card";
import styles from "./UserActivityList.module.css";

const UserActivityList = ({ activities = [] }) => {
  // Function to get icon based on activity type
  const getActivityIcon = (type) => {
    switch (type) {
      case "user_registered":
        return <PersonAddIcon />;
      case "instructor_verified":
        return <VerifiedUserIcon />;
      case "gym_verified":
        return <FitnessCenterIcon />;
      case "consultation_booked":
        return <EventNoteIcon />;
      case "match_created":
        return <FavoriteIcon />;
      default:
        return <PersonAddIcon />;
    }
  };

  // Function to format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // If today, show relative time (e.g., "2 hours ago")
    if (date.toDateString() === today.toDateString()) {
      return formatDistanceToNow(date, { addSuffix: true });
    }
    // If yesterday, show "Yesterday at HH:MM"
    else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${format(date, "h:mm a")}`;
    }
    // Otherwise, show the date
    else {
      return format(date, "MMM d, yyyy 'at' h:mm a");
    }
  };

  // Function to get activity message
  const getActivityMessage = (activity) => {
    switch (activity.type) {
      case "user_registered":
        return (
          <>
            <Typography component='span' fontWeight={500}>
              {activity.user.name}
            </Typography>{" "}
            registered as a new user.
          </>
        );
      case "instructor_verified":
        return (
          <>
            <Typography component='span' fontWeight={500}>
              {activity.user.name}
            </Typography>{" "}
            was verified as an instructor.
          </>
        );
      case "gym_verified":
        return (
          <>
            <Typography component='span' fontWeight={500}>
              {activity.gym.name}
            </Typography>{" "}
            was verified as a partner gym.
          </>
        );
      case "consultation_booked":
        return (
          <>
            <Typography component='span' fontWeight={500}>
              {activity.user.name}
            </Typography>{" "}
            booked a consultation with{" "}
            <Typography component='span' fontWeight={500}>
              {activity.instructor.name}
            </Typography>
            .
          </>
        );
      case "match_created":
        return (
          <>
            <Typography component='span' fontWeight={500}>
              {activity.users[0].name}
            </Typography>{" "}
            and{" "}
            <Typography component='span' fontWeight={500}>
              {activity.users[1].name}
            </Typography>{" "}
            were matched as workout buddies.
          </>
        );
      default:
        return "Unknown activity";
    }
  };

  return (
    <Card
      title='Recent Activity'
      subtitle='User activities across the platform'
      action={
        <Button variant='text' color='primary' size='small'>
          View All
        </Button>
      }
    >
      {activities.length === 0 ? (
        <Box className={styles.emptyState}>
          <Typography variant='body2' color='textSecondary'>
            No recent activities
          </Typography>
        </Box>
      ) : (
        <List className={styles.activityList}>
          {activities.map((activity, index) => (
            <React.Fragment key={index}>
              <ListItem alignItems='flex-start' className={styles.activityItem}>
                <ListItemAvatar>
                  <Avatar className={styles.activityAvatar}>
                    {getActivityIcon(activity.type)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={getActivityMessage(activity)}
                  secondary={formatTimestamp(activity.timestamp)}
                  primaryTypographyProps={{
                    variant: "body2",
                    color: "textPrimary",
                  }}
                  secondaryTypographyProps={{
                    variant: "caption",
                    color: "textSecondary",
                  }}
                />
              </ListItem>
              {index < activities.length - 1 && <Divider component='li' />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Card>
  );
};

export default UserActivityList;
