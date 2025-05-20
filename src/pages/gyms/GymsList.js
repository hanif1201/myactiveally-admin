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
  Rating,
} from "@mui/material";
import {
  Search,
  FilterList,
  MoreVert,
  Visibility,
  CheckCircle,
  Block,
  LocationOn,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import api from "../../api";
import { useNotification } from "../../hooks/useNotification";
import { usePagination } from "../../hooks/usePagination";
import styles from "./GymsList.module.css";

const GymsList = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const {
    page,
    rowsPerPage,
    setTotal,
    handlePageChange,
    handleRowsPerPageChange,
  } = usePagination();

  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState("");
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [actionAnchorEl, setActionAnchorEl] = useState(null);
  const [selectedGymId, setSelectedGymId] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    content: "",
    action: null,
  });

  // Fetch gyms
  useEffect(() => {
    const fetchGyms = async () => {
      try {
        setLoading(true);
        const response = await api.gyms.getAllGyms({
          page,
          limit: rowsPerPage,
          verified: verifiedFilter,
          search: searchQuery,
        });

        setGyms(response.data.gyms);
        setTotal(response.data.pagination.total);
      } catch (error) {
        showError("Failed to fetch gyms");
        console.error("Error fetching gyms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGyms();
  }, [page, rowsPerPage, verifiedFilter, searchQuery, showError, setTotal]);

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
  const handleFilterSelect = (verified) => {
    setVerifiedFilter(verified);
    handleFilterClose();
  };

  // Handle action button click
  const handleActionClick = (event, gymId) => {
    setActionAnchorEl(event.currentTarget);
    setSelectedGymId(gymId);
  };

  // Handle action close
  const handleActionClose = () => {
    setActionAnchorEl(null);
    setSelectedGymId(null);
  };

  // Handle view gym
  const handleViewGym = () => {
    navigate(`/gyms/${selectedGymId}`);
    handleActionClose();
  };

  // Handle verify gym
  const handleVerifyGym = () => {
    setConfirmDialog({
      open: true,
      title: "Verify Gym",
      content:
        "Are you sure you want to verify this gym? It will be displayed to users on the platform.",
      action: async () => {
        try {
          await api.gyms.verifyGym(selectedGymId);
          showSuccess("Gym verified successfully");

          // Update gym in the list
          const updatedGyms = gyms.map((gym) =>
            gym._id === selectedGymId ? { ...gym, isVerified: true } : gym
          );
          setGyms(updatedGyms);
        } catch (error) {
          showError("Failed to verify gym");
          console.error("Error verifying gym:", error);
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

  // Format address
  const formatAddress = (gym) => {
    if (gym.address?.formattedAddress) {
      return gym.address.formattedAddress;
    }

    const addressParts = [];
    if (gym.address) addressParts.push(gym.address);
    if (gym.city) addressParts.push(gym.city);
    if (gym.state) addressParts.push(gym.state);
    if (gym.zipCode) addressParts.push(gym.zipCode);

    return addressParts.join(", ") || "No address provided";
  };

  return (
    <Box className={styles.gymsListContainer}>
      <PageHeader
        title='Gyms'
        breadcrumbs={[{ label: "Gyms", link: "/gyms" }]}
        action={
          <Button
            variant='contained'
            color='primary'
            onClick={() => navigate("/gyms/verification")}
          >
            Verification Requests
          </Button>
        }
      />

      <Paper className={styles.gymsListPaper}>
        {/* Search and Filter */}
        <Box className={styles.gymsListToolbar}>
          <TextField
            placeholder='Search gyms...'
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
              {verifiedFilter && (
                <Chip
                  label={
                    verifiedFilter === "true" ? "Verified" : "Not Verified"
                  }
                  size='small'
                  onDelete={() => setVerifiedFilter("")}
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
              <MenuItem onClick={() => handleFilterSelect("true")}>
                Verified
              </MenuItem>
              <MenuItem onClick={() => handleFilterSelect("false")}>
                Not Verified
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Gyms Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align='right'>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align='center'>
                    Loading gyms...
                  </TableCell>
                </TableRow>
              ) : gyms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align='center'>
                    No gyms found
                  </TableCell>
                </TableRow>
              ) : (
                gyms.map((gym) => (
                  <TableRow key={gym._id}>
                    <TableCell>{gym.name}</TableCell>
                    <TableCell>
                      <Box className={styles.addressCell}>
                        <LocationOn fontSize='small' color='action' />
                        <Typography variant='body2'>
                          {formatAddress(gym)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{gym.phone || "N/A"}</TableCell>
                    <TableCell>
                      <Box className={styles.ratingCell}>
                        <Rating
                          value={gym.averageRating || 0}
                          precision={0.5}
                          readOnly
                          size='small'
                        />
                        <Typography variant='caption' color='textSecondary'>
                          ({gym.totalReviews || 0})
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {gym.isVerified ? (
                        <Chip
                          icon={<CheckCircle fontSize='small' />}
                          label='Verified'
                          color='success'
                          size='small'
                        />
                      ) : (
                        <Chip label='Pending' color='warning' size='small' />
                      )}
                    </TableCell>
                    <TableCell align='right'>
                      <IconButton
                        aria-label='actions'
                        onClick={(e) => handleActionClick(e, gym._id)}
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
          count={gyms.length}
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
        <MenuItem onClick={handleViewGym}>
          <Visibility fontSize='small' className={styles.menuIcon} />
          View Details
        </MenuItem>
        {selectedGymId &&
          !gyms.find((gym) => gym._id === selectedGymId)?.isVerified && (
            <MenuItem onClick={handleVerifyGym}>
              <CheckCircle fontSize='small' className={styles.menuIcon} />
              Verify Gym
            </MenuItem>
          )}
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
      />
    </Box>
  );
};

export default GymsList;
