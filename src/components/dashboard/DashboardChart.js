import React from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Card from "../common/Card";
import styles from "./DashboardChart.module.css";

const DashboardChart = ({
  title,
  subtitle,
  type = "line",
  data = [],
  dataKeys = [],
  colors = ["#3f51b5", "#f50057", "#4caf50"],
  height = 300,
}) => {
  // Render chart based on type
  const renderChart = () => {
    switch (type) {
      case "area":
        return (
          <ResponsiveContainer width='100%' height={height}>
            <AreaChart
              data={data}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip />
              <Legend />
              {dataKeys.map((dataKey, index) => (
                <Area
                  key={dataKey.key}
                  type='monotone'
                  dataKey={dataKey.key}
                  name={dataKey.name || dataKey.key}
                  stroke={colors[index % colors.length]}
                  fill={colors[index % colors.length]}
                  fillOpacity={0.2}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );

      case "bar":
        return (
          <ResponsiveContainer width='100%' height={height}>
            <BarChart
              data={data}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip />
              <Legend />
              {dataKeys.map((dataKey, index) => (
                <Bar
                  key={dataKey.key}
                  dataKey={dataKey.key}
                  name={dataKey.name || dataKey.key}
                  fill={colors[index % colors.length]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case "pie":
        return (
          <ResponsiveContainer width='100%' height={height}>
            <PieChart margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <Pie
                data={data}
                cx='50%'
                cy='50%'
                labelLine={false}
                outerRadius={80}
                fill='#8884d8'
                nameKey={dataKeys[0].nameKey || "name"}
                dataKey={dataKeys[0].key || "value"}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case "line":
      default:
        return (
          <ResponsiveContainer width='100%' height={height}>
            <LineChart
              data={data}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip />
              <Legend />
              {dataKeys.map((dataKey, index) => (
                <Line
                  key={dataKey.key}
                  type='monotone'
                  dataKey={dataKey.key}
                  name={dataKey.name || dataKey.key}
                  stroke={colors[index % colors.length]}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <Card title={title} subtitle={subtitle}>
      <div className={styles.chartContainer}>{renderChart()}</div>
    </Card>
  );
};

export default DashboardChart;
