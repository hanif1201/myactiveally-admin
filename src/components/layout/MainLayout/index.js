import React, { useState, useEffect } from "react";
import { Box, CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Footer from "../Footer";
import Notifications from "../../common/Notifications";
import styles from "./MainLayout.module.css";

const MainLayout = () => {
  const [open, setOpen] = useState(true);
  const [mobile, setMobile] = useState(false);

  // Toggle sidebar
  const toggleSidebar = () => {
    setOpen(!open);
  };

  // Close sidebar on mobile
  const handleDrawerClose = () => {
    if (mobile) {
      setOpen(false);
    }
  };

  // Check if mobile view
  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth < 960);
      if (window.innerWidth < 960) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Box className={styles.root}>
      <CssBaseline />

      {/* Header */}
      <Header toggleSidebar={toggleSidebar} />

      {/* Sidebar */}
      <Sidebar
        open={open}
        variant={mobile ? "temporary" : "persistent"}
        onClose={handleDrawerClose}
      />

      {/* Main Content */}
      <Box
        component='main'
        className={`${styles.content} ${
          open && !mobile ? styles.contentShift : ""
        }`}
      >
        <div className={styles.toolbar} />
        <Box className={styles.pageContainer}>
          <Outlet />
        </Box>
        <Footer />
      </Box>

      {/* Notifications */}
      <Notifications />
    </Box>
  );
};

export default MainLayout;
