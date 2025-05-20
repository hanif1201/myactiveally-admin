import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Button,
  Typography,
} from "@mui/material";
import {
  Search,
  FilterList,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  Block,
  CheckCircle,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import api from "../../api";
import { useNotification } from "../../hooks/useNotification";
import { usePagination } from "../../hooks/usePagination";
import styles from "./UsersList.module.css";

const UsersList = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const {
    page,
    rowsPerPage,
    setTotal,
    handlePageChange,
    handleRowsPerPageChange,
  } = usePagination();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [actionAnchorEl, setActionAnchorEl] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    content: "",
    action: null,
  });

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await api.users.getAllUsers({
          page,
          limit: rowsPerPage,
          status: statusFilter,
          search: searchQuery,
        });

        setUsers(response.data.users);
        setTotal(response.data.pagination.total);
      } catch (error) {
        showError("Failed to fetch users");
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page, rowsPerPage, statusFilter, searchQuery, showError, setTotal]);

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Handle filter button click
  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  // Handle filter close
  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  // Handle filter selection
  const handleFilterSelect = (status) => {
    setStatusFilter(status);
    handleFilterClose();
  };

  // Handle action button click
  const handleActionClick = (event, userId) => {
    setActionAnchorEl(event.currentTarget);
    setSelectedUserId(userId);
  };

  // Handle action close
  const handleActionClose = () => {
    setActionAnchorEl(null);
    setSelectedUserId(null);
  };

  // Handle view user
  const handleViewUser = () => {
    navigate(`/users/${selectedUserId}`);
    handleActionClose();
  };

  // Handle edit user
  const handleEditUser = () => {
    navigate(`/users/edit/${selectedUserId}`);
    handleActionClose();
  };

  // Handle suspend user
  const handleSuspendUser = () => {
    setConfirmDialog({
      open: true,
      title: "Suspend User",
      content:
        "Are you sure you want to suspend this user? They will not be able to access the platform until reactivated.",
      action: async () => {
        try {
          await api.users.updateUserStatus(selectedUserId, "suspended");
          showSuccess("User suspended successfully");
          // Refresh users
          const updatedUsers = [...users];
          const userIndex = updatedUsers.findIndex(
            (user) => user._id === selectedUserId
          );
          if (userIndex !== -1) {
            updatedUsers[userIndex].accountStatus = "suspended";
            updatedUsers[userIndex].isActive = false;
            setUsers(updatedUsers);
          }
        } catch (error) {
          showError("Failed to suspend user");
          console.error("Error suspending user:", error);
        }
      },
    });
    handleActionClose();
  };

  // Handle activate user
  const handleActivateUser = () => {
    setConfirmDialog({
      open: true,
      title: "Activate User",
      content: "Are you sure you want to activate this user?",
      action: async () => {
        try {
          await api.users.updateUserStatus(selectedUserId, "active");
          showSuccess("User activated successfully");
          // Refresh users
          const updatedUsers = [...users];
          const userIndex = updatedUsers.findIndex(
            (user) => user._id === selectedUserId
          );
          if (userIndex !== -1) {
            updatedUsers[userIndex].accountStatus = "active";
            updatedUsers[userIndex].isActive = true;
            setUsers(updatedUsers);
          }
        } catch (error) {
          showError("Failed to activate user");
          console.error("Error activating user:", error);
        }
      },
    });
    handleActionClose();
  };

  // Handle delete user
  const handleDeleteUser = () => {
    setConfirmDialog({
      open: true,
      title: "Delete User",
      content:
        "Are you sure you want to delete this user? This action cannot be undone.",
      action: async () => {
        try {
          await api.users.deleteUser(selectedUserId);
          showSuccess("User deleted successfully");
          // Remove user from list
          setUsers(users.filter((user) => user._id !== selectedUserId));
        } catch (error) {
          showError("Failed to delete user");
          console.error("Error deleting user:", error);
        }
      },
    });
    handleActionClose();
  };

  // Close confirm dialog
  const handleCloseConfirmDialog = () => {
    setConfirmDialog({
      ...confirmDialog,
      open: false,
    });
  };

  // Execute confirm dialog action
  const handleConfirmDialogAction = async () => {
    if (confirmDialog.action) {
      await confirmDialog.action();
    }
    handleCloseConfirmDialog();
  };

  // Render status chip
  const renderStatusChip = (status) => {
    switch (status) {
      case "active":
        return <Chip label='Active' color='success' size='small' />;
      case "inactive":
        return <Chip label='Inactive' color='default' size='small' />;
      case "suspended":
        return <Chip label='Suspended' color='warning' size='small' />;
      case "deleted":
        return <Chip label='Deleted' color='error' size='small' />;
      default:
        return <Chip label='Unknown' color='default' size='small' />;
    }
  };

  return (
    <Box className={styles.usersListContainer}>
      <PageHeader
        title='Users'
        breadcrumbs={[{ label: "Users", link: "/users" }]}
        action={
          <Button
            variant='contained'
            color='primary'
            onClick={() => navigate("/users/new")}
          >
            Add User
          </Button>
        }
      />

      <Paper className={styles.usersListPaper}>
        {/* Search and Filter */}
        <Box className={styles.usersListToolbar}>
          <TextField
            placeholder='Search users...'
            variant='outlined'
            size='small'
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <Search />
                </InputAdornment>
              ),
            }}
            className={styles.searchField}
          />

          <Box>
            <Button
              variant='outlined'
              startIcon={<FilterList />}
              onClick={handleFilterClick}
            >
              Filter
              {statusFilter && (
                <Chip
                  label={statusFilter}
                  size='small'
                  onDelete={() => setStatusFilter("")}
                  className={styles.filterChip}
                />
              )}
            </Button>
            <Menu
              anchorEl={filterAnchorEl}
              open={Boolean(filterAnchorEl)}
              onClose={handleFilterClose}
            >
              <MenuItem onClick={() => handleFilterSelect("")}>All</MenuItem>
              <MenuItem onClick={() => handleFilterSelect("active")}>
                Active
              </MenuItem>
              <MenuItem onClick={() => handleFilterSelect("inactive")}>
                Inactive
              </MenuItem>
              <MenuItem onClick={() => handleFilterSelect("suspended")}>
                Suspended
              </MenuItem>
              <MenuItem onClick={() => handleFilterSelect("deleted")}>
                Deleted
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Users Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell align='right'>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align='center'>
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align='center'>
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={
                          user.userType === "instructor" ? "Instructor" : "User"
                        }
                        color={
                          user.userType === "instructor" ? "primary" : "default"
                        }
                        size='small'
                      />
                    </TableCell>
                    <TableCell>
                      {renderStatusChip(user.accountStatus)}
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell align='right'>
                      <IconButton
                        aria-label='actions'
                        onClick={(e) => handleActionClick(e, user._id)}
                      >
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          component='div'
          count={users.length}
          page={page - 1}
          rowsPerPage={rowsPerPage}
          onPageChange={(e, newPage) => handlePageChange(e, newPage + 1)}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Paper>

      {/* Action Menu */}
      <Menu
        anchorEl={actionAnchorEl}
        open={Boolean(actionAnchorEl)}
        onClose={handleActionClose}
      >
        <MenuItem onClick={handleViewUser}>
          <Visibility fontSize='small' className={styles.menuIcon} />
          View Details
        </MenuItem>
        <MenuItem onClick={handleEditUser}>
          <Edit fontSize='small' className={styles.menuIcon} />
          Edit
        </MenuItem>
        {selectedUserId &&
          users.find((user) => user._id === selectedUserId)?.accountStatus ===
            "active" && (
            <MenuItem onClick={handleSuspendUser}>
              <Block fontSize='small' className={styles.menuIcon} />
              Suspend
            </MenuItem>
          )}
        {selectedUserId &&
          ["inactive", "suspended"].includes(
            users.find((user) => user._id === selectedUserId)?.accountStatus
          ) && (
            <MenuItem onClick={handleActivateUser}>
              <CheckCircle fontSize='small' className={styles.menuIcon} />
              Activate
            </MenuItem>
          )}
        <MenuItem onClick={handleDeleteUser} className={styles.deleteMenuItem}>
          <Delete fontSize='small' className={styles.menuIcon} />
          Delete
        </MenuItem>
      </Menu>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        content={confirmDialog.content}
        onClose={handleCloseConfirmDialog}
        onConfirm={handleConfirmDialogAction}
        confirmText='Confirm'
        cancelText='Cancel'
        confirmColor={
          confirmDialog.title.includes("Delete") ? "error" : "primary"
        }
      />
    </Box>
  );
};

export default UsersList;
