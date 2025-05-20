import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  Box,
  Typography,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  FitnessCenter as FitnessCenterIcon,
  LocationOn as LocationOnIcon,
  EventNote as EventNoteIcon,
  Favorite as FavoriteIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import styles from "./Sidebar.module.css";

const Sidebar = ({ open, variant, onClose }) => {
  const location = useLocation();

  // Menu states
  const [openUsers, setOpenUsers] = useState(false);
  const [openGyms, setOpenGyms] = useState(false);
  const [openConsultations, setOpenConsultations] = useState(false);
  const [openMatches, setOpenMatches] = useState(false);
  const [openWorkouts, setOpenWorkouts] = useState(false);
  const [openReports, setOpenReports] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);

  // Toggle menu handlers
  const handleToggleUsers = () => {
    setOpenUsers(!openUsers);
  };

  const handleToggleGyms = () => {
    setOpenGyms(!openGyms);
  };

  const handleToggleConsultations = () => {
    setOpenConsultations(!openConsultations);
  };

  const handleToggleMatches = () => {
    setOpenMatches(!openMatches);
  };

  const handleToggleWorkouts = () => {
    setOpenWorkouts(!openWorkouts);
  };

  const handleToggleReports = () => {
    setOpenReports(!openReports);
  };

  const handleToggleSettings = () => {
    setOpenSettings(!openSettings);
  };

  // Check if current path is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Check if current path starts with prefix
  const isActivePrefix = (prefix) => {
    return location.pathname.startsWith(prefix);
  };

  const sidebarContent = (
    <div className={styles.sidebar}>
      {/* Logo */}
      <Box className={styles.logo}>
        <Typography variant='h6' component='div'>
          GymBuddy Admin
        </Typography>
      </Box>

      <Divider />

      <List component='nav'>
        {/* Dashboard */}
        <ListItem
          button
          component={Link}
          to='/dashboard'
          className={isActive("/dashboard") ? styles.activeItem : ""}
        >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary='Dashboard' />
        </ListItem>

        {/* Users */}
        <ListItem
          button
          onClick={handleToggleUsers}
          className={isActivePrefix("/users") ? styles.activeItem : ""}
        >
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary='Users' />
          {openUsers ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openUsers} timeout='auto' unmountOnExit>
          <List component='div' disablePadding>
            <ListItem
              button
              component={Link}
              to='/users'
              className={`${styles.nested} ${
                isActive("/users") ? styles.activeItem : ""
              }`}
            >
              <ListItemText primary='All Users' />
            </ListItem>
            <ListItem
              button
              component={Link}
              to='/users/new'
              className={`${styles.nested} ${
                isActive("/users/new") ? styles.activeItem : ""
              }`}
            >
              <ListItemText primary='Add User' />
            </ListItem>
          </List>
        </Collapse>

        {/* Instructors */}
        <ListItem
          button
          onClick={handleToggleUsers}
          className={isActivePrefix("/instructors") ? styles.activeItem : ""}
        >
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary='Instructors' />
          {openUsers ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openUsers} timeout='auto' unmountOnExit>
          <List component='div' disablePadding>
            <ListItem
              button
              component={Link}
              to='/instructors'
              className={`${styles.nested} ${
                isActive("/instructors") ? styles.activeItem : ""
              }`}
            >
              <ListItemText primary='All Instructors' />
            </ListItem>
            <ListItem
              button
              component={Link}
              to='/instructors/verification'
              className={`${styles.nested} ${
                isActive("/instructors/verification") ? styles.activeItem : ""
              }`}
            >
              <ListItemText primary='Verification Requests' />
            </ListItem>
          </List>
        </Collapse>

        {/* Gyms */}
        <ListItem
          button
          onClick={handleToggleGyms}
          className={isActivePrefix("/gyms") ? styles.activeItem : ""}
        >
          <ListItemIcon>
            <FitnessCenterIcon />
          </ListItemIcon>
          <ListItemText primary='Gyms' />
          {openGyms ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openGyms} timeout='auto' unmountOnExit>
          <List component='div' disablePadding>
            <ListItem
              button
              component={Link}
              to='/gyms'
              className={`${styles.nested} ${
                isActive("/gyms") ? styles.activeItem : ""
              }`}
            >
              <ListItemText primary='All Gyms' />
            </ListItem>
            <ListItem
              button
              component={Link}
              to='/gyms/verification'
              className={`${styles.nested} ${
                isActive("/gyms/verification") ? styles.activeItem : ""
              }`}
            >
              <ListItemText primary='Verification Requests' />
            </ListItem>
          </List>
        </Collapse>

        {/* Consultations */}
        <ListItem
          button
          onClick={handleToggleConsultations}
          className={isActivePrefix("/consultations") ? styles.activeItem : ""}
        >
          <ListItemIcon>
            <EventNoteIcon />
          </ListItemIcon>
          <ListItemText primary='Consultations' />
          {openConsultations ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openConsultations} timeout='auto' unmountOnExit>
          <List component='div' disablePadding>
            <ListItem
              button
              component={Link}
              to='/consultations'
              className={`${styles.nested} ${
                isActive("/consultations") ? styles.activeItem : ""
              }`}
            >
              <ListItemText primary='All Consultations' />
            </ListItem>
          </List>
        </Collapse>

        {/* Matches */}
        <ListItem
          button
          onClick={handleToggleMatches}
          className={isActivePrefix("/matches") ? styles.activeItem : ""}
        >
          <ListItemIcon>
            <FavoriteIcon />
          </ListItemIcon>
          <ListItemText primary='Matches' />
          {openMatches ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openMatches} timeout='auto' unmountOnExit>
          <List component='div' disablePadding>
            <ListItem
              button
              component={Link}
              to='/matches'
              className={`${styles.nested} ${
                isActive("/matches") ? styles.activeItem : ""
              }`}
            >
              <ListItemText primary='All Matches' />
            </ListItem>
          </List>
        </Collapse>

        {/* Workouts */}
        <ListItem
          button
          onClick={handleToggleWorkouts}
          className={isActivePrefix("/workouts") ? styles.activeItem : ""}
        >
          <ListItemIcon>
            <FitnessCenterIcon />
          </ListItemIcon>
          <ListItemText primary='Workouts' />
          {openWorkouts ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openWorkouts} timeout='auto' unmountOnExit>
          <List component='div' disablePadding>
            <ListItem
              button
              component={Link}
              to='/workouts'
              className={`${styles.nested} ${
                isActive("/workouts") ? styles.activeItem : ""
              }`}
            >
              <ListItemText primary='All Workouts' />
            </ListItem>
          </List>
        </Collapse>

        {/* Reports */}
        <ListItem
          button
          onClick={handleToggleReports}
          className={isActivePrefix("/reports") ? styles.activeItem : ""}
        >
          <ListItemIcon>
            <AssessmentIcon />
          </ListItemIcon>
          <ListItemText primary='Reports' />
          {openReports ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openReports} timeout='auto' unmountOnExit>
          <List component='div' disablePadding>
            <ListItem
              button
              component={Link}
              to='/reports/users'
              className={`${styles.nested} ${
                isActive("/reports/users") ? styles.activeItem : ""
              }`}
            >
              <ListItemText primary='User Reports' />
            </ListItem>
            <ListItem
              button
              component={Link}
              to='/reports/instructors'
              className={`${styles.nested} ${
                isActive("/reports/instructors") ? styles.activeItem : ""
              }`}
            >
              <ListItemText primary='Instructor Reports' />
            </ListItem>
            <ListItem
              button
              component={Link}
              to='/reports/consultations'
              className={`${styles.nested} ${
                isActive("/reports/consultations") ? styles.activeItem : ""
              }`}
            >
              <ListItemText primary='Consultation Reports' />
            </ListItem>
            <ListItem
              button
              component={Link}
              to='/reports/matches'
              className={`${styles.nested} ${
                isActive("/reports/matches") ? styles.activeItem : ""
              }`}
            >
              <ListItemText primary='Match Reports' />
            </ListItem>
          </List>
        </Collapse>

        {/* Settings */}
        <ListItem
          button
          onClick={handleToggleSettings}
          className={isActivePrefix("/settings") ? styles.activeItem : ""}
        >
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary='Settings' />
          {openSettings ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openSettings} timeout='auto' unmountOnExit>
          <List component='div' disablePadding>
            <ListItem
              button
              component={Link}
              to='/settings/general'
              className={`${styles.nested} ${
                isActive("/settings/general") ? styles.activeItem : ""
              }`}
            >
              <ListItemText primary='General Settings' />
            </ListItem>
            <ListItem
              button
              component={Link}
              to='/settings/api'
              className={`${styles.nested} ${
                isActive("/settings/api") ? styles.activeItem : ""
              }`}
            >
              <ListItemText primary='API Settings' />
            </ListItem>
          </List>
        </Collapse>
      </List>
    </div>
  );

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      className={styles.drawer}
      classes={{
        paper: styles.drawerPaper,
      }}
    >
      {sidebarContent}
    </Drawer>
  );
};

export default Sidebar;
