import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Box,
  Avatar,
  InputBase,
  Tooltip,
  Divider,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  MailOutline as MailIcon,
  ExitToApp as LogoutIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useTheme } from "../../../hooks/useTheme";
import styles from "./Header.module.css";

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useTheme();

  const [anchorElNotifications, setAnchorElNotifications] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElSearch, setAnchorElSearch] = useState(null);

  // Handle notifications menu
  const handleNotificationsOpen = (event) => {
    setAnchorElNotifications(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setAnchorElNotifications(null);
  };

  // Handle user menu
  const handleUserMenuOpen = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorElUser(null);
  };

  // Handle search
  const handleSearchOpen = () => {
    setAnchorElSearch(true);
  };

  const handleSearchClose = () => {
    setAnchorElSearch(null);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Handle profile
  const handleProfile = () => {
    navigate("/settings/profile");
    handleUserMenuClose();
  };

  // Handle settings
  const handleSettings = () => {
    navigate("/settings/general");
    handleUserMenuClose();
  };

  // Notifications list - Sample data
  const notifications = [
    {
      id: 1,
      title: "New User Registered",
      time: "5 min ago",
    },
    {
      id: 2,
      title: "New Instructor Verification",
      time: "1 hour ago",
    },
    {
      id: 3,
      title: "New Gym Verification",
      time: "3 hours ago",
    },
  ];

  return (
    <AppBar position='fixed' className={styles.appBar}>
      <Toolbar>
        {/* Menu Toggle Button */}
        <IconButton
          edge='start'
          color='inherit'
          aria-label='open drawer'
          onClick={toggleSidebar}
          className={styles.menuButton}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo */}
        <Typography variant='h6' className={styles.logo}>
          GymBuddy Admin
        </Typography>

        {/* Search Bar */}
        <Box className={styles.search}>
          <Box className={styles.searchIcon}>
            <SearchIcon />
          </Box>
          <InputBase
            placeholder='Search…'
            classes={{
              root: styles.inputRoot,
              input: styles.inputInput,
            }}
            inputProps={{ "aria-label": "search" }}
          />
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Icons Section */}
        <Box className={styles.iconSection}>
          {/* Theme Toggle */}
          <Tooltip
            title={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
          >
            <IconButton color='inherit' onClick={toggleTheme}>
              {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>

          {/* Messages */}
          <Tooltip title='Messages'>
            <IconButton color='inherit'>
              <Badge badgeContent={4} color='secondary'>
                <MailIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title='Notifications'>
            <IconButton
              color='inherit'
              onClick={handleNotificationsOpen}
              aria-controls='notifications-menu'
              aria-haspopup='true'
            >
              <Badge badgeContent={notifications.length} color='secondary'>
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Help */}
          <Tooltip title='Help'>
            <IconButton color='inherit'>
              <HelpIcon />
            </IconButton>
          </Tooltip>

          {/* User Menu */}
          <Tooltip title='Account'>
            <IconButton
              edge='end'
              color='inherit'
              onClick={handleUserMenuOpen}
              className={styles.userMenuButton}
            >
              {user?.profileImage ? (
                <Avatar
                  src={user.profileImage}
                  alt={user.name}
                  className={styles.userAvatar}
                />
              ) : (
                <AccountCircle />
              )}
            </IconButton>
          </Tooltip>
        </Box>

        {/* Notifications Menu */}
        <Menu
          id='notifications-menu'
          anchorEl={anchorElNotifications}
          keepMounted
          open={Boolean(anchorElNotifications)}
          onClose={handleNotificationsClose}
          className={styles.notificationsMenu}
        >
          <Typography variant='subtitle1' className={styles.menuTitle}>
            Notifications
          </Typography>
          <Divider />
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <MenuItem
                key={notification.id}
                onClick={handleNotificationsClose}
                className={styles.notificationItem}
              >
                <Box className={styles.notificationContent}>
                  <Typography variant='body2'>{notification.title}</Typography>
                  <Typography variant='caption' color='textSecondary'>
                    {notification.time}
                  </Typography>
                </Box>
              </MenuItem>
            ))
          ) : (
            <MenuItem className={styles.notificationItem}>
              <Typography variant='body2'>No new notifications</Typography>
            </MenuItem>
          )}
          <Divider />
          <MenuItem
            onClick={handleNotificationsClose}
            className={styles.viewAllItem}
          >
            <Typography variant='body2' color='primary'>
              View All Notifications
            </Typography>
          </MenuItem>
        </Menu>

        {/* User Menu */}
        <Menu
          id='user-menu'
          anchorEl={anchorElUser}
          keepMounted
          open={Boolean(anchorElUser)}
          onClose={handleUserMenuClose}
          className={styles.userMenu}
        >
          <MenuItem onClick={handleProfile} className={styles.menuItem}>
            <AccountCircle className={styles.menuIcon} />
            <Typography variant='body2'>Profile</Typography>
          </MenuItem>
          <MenuItem onClick={handleSettings} className={styles.menuItem}>
            <SettingsIcon className={styles.menuIcon} />
            <Typography variant='body2'>Settings</Typography>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} className={styles.menuItem}>
            <LogoutIcon className={styles.menuIcon} />
            <Typography variant='body2'>Logout</Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
