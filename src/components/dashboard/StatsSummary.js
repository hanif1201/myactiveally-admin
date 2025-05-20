import React from "react";
import { Grid } from "@mui/material";
import {
  PeopleOutline,
  PersonOutline,
  FitnessCenterOutlined,
  EventNoteOutlined,
  AttachMoney,
  Favorite as FavoriteIcon,
} from "@mui/icons-material";
import StatsCard from "../common/StatsCard";
import styles from "./StatsSummary.module.css";

const StatsSummary = ({ stats }) => {
  // Default stats if not provided
  const defaultStats = {
    users: {
      total: 0,
      growth: 0,
      active: 0,
    },
    instructors: {
      total: 0,
      growth: 0,
      verified: 0,
    },
    gyms: {
      total: 0,
      growth: 0,
      verified: 0,
    },
    consultations: {
      total: 0,
      growth: 0,
      active: 0,
    },
    matches: {
      total: 0,
      growth: 0,
      active: 0,
    },
    revenue: {
      total: 0,
      growth: 0,
      monthly: 0,
    },
  };

  // Merge with provided stats
  const mergedStats = {
    ...defaultStats,
    ...stats,
  };

  // Calculate growth trend
  const getTrend = (growth) => {
    if (growth > 0) return "up";
    if (growth < 0) return "down";
    return "neutral";
  };

  return (
    <Grid container spacing={3} className={styles.statsGrid}>
      {/* Total Users */}
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <StatsCard
          title='Total Users'
          value={mergedStats.users.total.toLocaleString()}
          icon={<PeopleOutline />}
          change={mergedStats.users.growth}
          trend={getTrend(mergedStats.users.growth)}
          color='primary'
        />
      </Grid>

      {/* Instructors */}
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <StatsCard
          title='Instructors'
          value={mergedStats.instructors.total.toLocaleString()}
          icon={<PersonOutline />}
          change={mergedStats.instructors.growth}
          trend={getTrend(mergedStats.instructors.growth)}
          color='secondary'
        />
      </Grid>

      {/* Gyms */}
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <StatsCard
          title='Gyms'
          value={mergedStats.gyms.total.toLocaleString()}
          icon={<FitnessCenterOutlined />}
          change={mergedStats.gyms.growth}
          trend={getTrend(mergedStats.gyms.growth)}
          color='info'
        />
      </Grid>

      {/* Consultations */}
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <StatsCard
          title='Consultations'
          value={mergedStats.consultations.total.toLocaleString()}
          icon={<EventNoteOutlined />}
          change={mergedStats.consultations.growth}
          trend={getTrend(mergedStats.consultations.growth)}
          color='success'
        />
      </Grid>

      {/* Matches */}
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <StatsCard
          title='Matches'
          value={mergedStats.matches.total.toLocaleString()}
          icon={<FavoriteIcon />}
          change={mergedStats.matches.growth}
          trend={getTrend(mergedStats.matches.growth)}
          color='warning'
        />
      </Grid>

      {/* Revenue */}
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <StatsCard
          title='Monthly Revenue'
          value={`$${mergedStats.revenue.monthly.toLocaleString()}`}
          icon={<AttachMoney />}
          change={mergedStats.revenue.growth}
          trend={getTrend(mergedStats.revenue.growth)}
          color='error'
        />
      </Grid>
    </Grid>
  );
};

export default StatsSummary;
