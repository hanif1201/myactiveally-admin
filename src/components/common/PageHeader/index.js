import React from "react";
import { Box, Typography, Breadcrumbs, Link, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import styles from "./PageHeader.module.css";

const PageHeader = ({ title, breadcrumbs, action }) => {
  return (
    <Box className={styles.pageHeader}>
      <Box className={styles.titleSection}>
        <Typography variant='h4' component='h1' className={styles.title}>
          {title}
        </Typography>

        {action && <Box className={styles.actionButton}>{action}</Box>}
      </Box>

      {breadcrumbs && (
        <Breadcrumbs aria-label='breadcrumb' className={styles.breadcrumbs}>
          <Link component={RouterLink} to='/' color='inherit'>
            Dashboard
          </Link>

          {breadcrumbs.map((breadcrumb, index) => (
            <React.Fragment key={index}>
              {index === breadcrumbs.length - 1 ? (
                <Typography color='textPrimary'>{breadcrumb.label}</Typography>
              ) : (
                <Link
                  component={RouterLink}
                  to={breadcrumb.link}
                  color='inherit'
                >
                  {breadcrumb.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </Breadcrumbs>
      )}
    </Box>
  );
};

export default PageHeader;
