import React from "react";
import { Snackbar, Alert as MuiAlert } from "@mui/material";
import { useNotification } from "../../../hooks/useNotification";
import styles from "./Notifications.module.css";

// Alert component
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

const Notifications = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <>
      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={true}
          autoHideDuration={notification.duration || 5000}
          onClose={() => removeNotification(notification.id)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          className={styles.notification}
        >
          <Alert
            onClose={() => removeNotification(notification.id)}
            severity={notification.type || "info"}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
};

export default Notifications;
