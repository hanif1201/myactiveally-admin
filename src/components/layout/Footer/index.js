import React from "react";
import { Box, Typography, Link } from "@mui/material";
import styles from "./Footer.module.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box className={styles.footer}>
      <Typography variant='body2' color='textSecondary' align='center'>
        © {currentYear} GymBuddy Admin. All rights reserved.
      </Typography>
      <Box className={styles.links}>
        <Link href='#' color='inherit' className={styles.link}>
          Privacy Policy
        </Link>
        <Link href='#' color='inherit' className={styles.link}>
          Terms of Service
        </Link>
        <Link href='#' color='inherit' className={styles.link}>
          Contact Us
        </Link>
      </Box>
    </Box>
  );
};

export default Footer;
