import React from "react";
import {
  Card as MuiCard,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";
import styles from "./Card.module.css";

const Card = ({
  title,
  subtitle,
  icon,
  action,
  menu,
  children,
  footer,
  className = "",
  ...props
}) => {
  return (
    <MuiCard className={`${styles.card} ${className}`} {...props}>
      {(title || subtitle || icon || action || menu) && (
        <CardHeader
          avatar={icon && <Box className={styles.icon}>{icon}</Box>}
          title={title && <Typography variant='h6'>{title}</Typography>}
          subheader={subtitle}
          action={
            <>
              {action}
              {menu && (
                <IconButton aria-label='settings'>
                  <MoreVertIcon />
                </IconButton>
              )}
            </>
          }
          className={styles.cardHeader}
        />
      )}

      <CardContent className={styles.cardContent}>{children}</CardContent>

      {footer && (
        <CardActions className={styles.cardFooter}>{footer}</CardActions>
      )}
    </MuiCard>
  );
};

export default Card;
