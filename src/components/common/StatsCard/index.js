import React from "react";
import { Paper, Box, Typography, IconButton } from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import styles from "./StatsCard.module.css";

const StatsCard = ({
  title,
  value,
  icon,
  change,
  changeType = "percentage",
  trend = "neutral",
  color = "primary",
  ...props
}) => {
  // Format the change value
  const formattedChange = () => {
    if (changeType === "percentage") {
      return `${change >= 0 ? "+" : ""}${change}%`;
    } else if (changeType === "value") {
      return `${change >= 0 ? "+" : ""}${change}`;
    }
    return change;
  };

  // Determine trend color
  const trendColor = () => {
    if (trend === "up") return "success.main";
    if (trend === "down") return "error.main";
    return "text.secondary";
  };

  // Render trend icon
  const trendIcon = () => {
    if (trend === "up") return <ArrowUpward fontSize='small' />;
    if (trend === "down") return <ArrowDownward fontSize='small' />;
    return null;
  };

  return (
    <Paper className={styles.statsCard} {...props}>
      <Box className={styles.content}>
        <Box className={styles.textContent}>
          <Typography
            variant='body2'
            color='textSecondary'
            className={styles.title}
          >
            {title}
          </Typography>
          <Typography variant='h4' className={styles.value}>
            {value}
          </Typography>
          {change !== undefined && (
            <Box className={styles.change} sx={{ color: trendColor() }}>
              {trendIcon()}
              <Typography variant='caption'>{formattedChange()}</Typography>
            </Box>
          )}
        </Box>

        {icon && (
          <Box className={`${styles.iconContainer} ${styles[color]}`}>
            {icon}
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default StatsCard;
