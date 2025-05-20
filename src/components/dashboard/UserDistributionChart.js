import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import Card from "../common/Card";
import styles from "./UserDistributionChart.module.css";

const UserDistributionChart = ({
  data,
  title = "User Distribution",
  subtitle = "Users by fitness level",
}) => {
  const theme = useTheme();

  // Default colors based on theme
  const colors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.error.main,
  ];

  // Format percentage
  const formatPercentage = (value) => {
    return `${value}%`;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Box className={styles.customTooltip}>
          <Typography variant='subtitle2'>{payload[0].name}</Typography>
          <Typography variant='body2'>
            {`${payload[0].value} users (${(
              (payload[0].value /
                data.reduce((sum, entry) => sum + entry.value, 0)) *
              100
            ).toFixed(1)}%)`}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Card title={title} subtitle={subtitle}>
      <Box className={styles.chartContainer}>
        <ResponsiveContainer width='100%' height={300}>
          <PieChart>
            <Pie
              data={data}
              cx='50%'
              cy='50%'
              innerRadius={60}
              outerRadius={90}
              fill='#8884d8'
              paddingAngle={2}
              dataKey='value'
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>

      <Box className={styles.statsContainer}>
        {data.map((entry, index) => (
          <Box key={entry.name} className={styles.statItem}>
            <Box
              className={styles.statColor}
              sx={{ backgroundColor: colors[index % colors.length] }}
            />
            <Box className={styles.statInfo}>
              <Typography variant='body2' className={styles.statLabel}>
                {entry.name}
              </Typography>
              <Typography variant='body1' className={styles.statValue}>
                {entry.value}
              </Typography>
              <Typography variant='caption' color='textSecondary'>
                {formatPercentage(
                  (
                    (entry.value / data.reduce((sum, e) => sum + e.value, 0)) *
                    100
                  ).toFixed(1)
                )}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Card>
  );
};

export default UserDistributionChart;
