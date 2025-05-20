import React from "react";
import { Box, Typography, Grid, Divider } from "@mui/material";
import { TrendingUp, TrendingDown } from "@mui/icons-material";
import Card from "../common/Card";
import styles from "./RevenueOverview.module.css";

const RevenueOverview = ({ revenue = {} }) => {
  const {
    total = 0,
    growth = 0,
    platform = 0,
    instructors = 0,
    thisMonth = 0,
    lastMonth = 0,
  } = revenue;

  // Format currency
  const formatCurrency = (value) => {
    return `$${value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Format percentage
  const formatPercentage = (value) => {
    return `${value >= 0 ? "+" : ""}${value}%`;
  };

  return (
    <Card title='Revenue Overview' subtitle='Platform earnings summary'>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box className={styles.revenueBox}>
            <Typography variant='h6' className={styles.revenueBoxTitle}>
              Total Revenue
            </Typography>
            <Box className={styles.revenueValueContainer}>
              <Typography variant='h3' className={styles.revenueValue}>
                {formatCurrency(total)}
              </Typography>
              <Box
                className={`${styles.revenueChange} ${
                  growth >= 0 ? styles.positive : styles.negative
                }`}
              >
                {growth >= 0 ? (
                  <TrendingUp fontSize='small' />
                ) : (
                  <TrendingDown fontSize='small' />
                )}
                <Typography variant='body2'>
                  {formatPercentage(growth)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box className={styles.revenueBox}>
            <Typography variant='h6' className={styles.revenueBoxTitle}>
              Platform Fees
            </Typography>
            <Box className={styles.revenueValueContainer}>
              <Typography variant='h3' className={styles.revenueValue}>
                {formatCurrency(platform)}
              </Typography>
              <Typography variant='body2' color='textSecondary'>
                {Math.round((platform / total) * 100)}% of total
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Divider className={styles.divider} />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box className={styles.revenueItem}>
            <Typography variant='subtitle1'>This Month</Typography>
            <Typography variant='h6'>{formatCurrency(thisMonth)}</Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box className={styles.revenueItem}>
            <Typography variant='subtitle1'>Last Month</Typography>
            <Box className={styles.revenueItemValue}>
              <Typography variant='h6'>{formatCurrency(lastMonth)}</Typography>
              <Box
                className={`${styles.revenueItemChange} ${
                  thisMonth >= lastMonth ? styles.positive : styles.negative
                }`}
              >
                {thisMonth >= lastMonth ? (
                  <TrendingUp fontSize='small' />
                ) : (
                  <TrendingDown fontSize='small' />
                )}
                <Typography variant='body2'>
                  {formatPercentage(
                    Math.round(((thisMonth - lastMonth) / lastMonth) * 100)
                  )}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box className={styles.revenueItem}>
            <Typography variant='subtitle1'>Instructor Earnings</Typography>
            <Typography variant='h6'>{formatCurrency(instructors)}</Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box className={styles.revenueItem}>
            <Typography variant='subtitle1'>
              Average Per Consultation
            </Typography>
            <Typography variant='h6'>
              {formatCurrency(total / (revenue.consultationsCount || 1))}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
};

export default RevenueOverview;
