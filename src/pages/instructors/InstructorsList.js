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
  Avatar,
  Rating,
  Typography,
} from "@mui/material";
import {
  Search,
  FilterList,
  MoreVert,
  CheckCircle,
  Visibility,
  Block,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import api from "../../api";
import { useNotification } from "../../hooks/useNotification";
import { usePagination } from "../../hooks/usePagination";
import styles from "./InstructorsList.module.css";

const InstructorsList = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const {
    page,
    rowsPerPage,
    setTotal,
    handlePageChange,
    handleRowsPerPageChange,
  } = usePagination();

  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState("");
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [actionAnchorEl, setActionAnchorEl] = useState(null);
  const [selectedInstructorId, setSelectedInstructorId] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    content: "",
    action: null,
  });

  // Fetch instructors
  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        setLoading(true);
        const response = await api.instructors.getAllInstructors({
          page,
          limit: rowsPerPage,
          verified: verifiedFilter,
          search: searchQuery,
        });

        setInstructors(response.data.instructors);
        setTotal(response.data.pagination.total);
      } catch (error) {
        showError("Failed to fetch instructors");
        console.error("Error fetching instructors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
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
  const handleActionClick = (event, instructorId) => {
    setActionAnchorEl(event.currentTarget);
    setSelectedInstructorId(instructorId);
  };

  // Handle action close
  const handleActionClose = () => {
    setActionAnchorEl(null);
    setSelectedInstructorId(null);
  };

  // Handle view instructor
  const handleViewInstructor = () => {
    navigate(`/instructors/${selectedInstructorId}`);
    handleActionClose();
  };

  // Handle verify instructor
  const handleVerifyInstructor = () => {
    setConfirmDialog({
      open: true,
      title: "Verify Instructor",
      content:
        "Are you sure you want to verify this instructor? They will be able to offer their services on the platform.",
      action: async () => {
        try {
          await api.instructors.verifyInstructor(selectedInstructorId);
          showSuccess("Instructor verified successfully");
          // Update instructor in the list
          const updatedInstructors = instructors.map((instructor) =>
            instructor._id === selectedInstructorId
              ? { ...instructor, isVerified: true }
              : instructor
          );
          setInstructors(updatedInstructors);
        } catch (error) {
          showError("Failed to verify instructor");
          console.error("Error verifying instructor:", error);
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

  return (
    <Box className={styles.instructorsListContainer}>
      <PageHeader
        title='Instructors'
        breadcrumbs={[{ label: "Instructors", link: "/instructors" }]}
        action={
          <Button
            variant='contained'
            color='primary'
            onClick={() => navigate("/instructors/verification")}
          >
            Verification Requests
          </Button>
        }
      />

      <Paper className={styles.instructorsListPaper}>
        {/* Search and Filter */}
        <Box className={styles.instructorsListToolbar}>
          <TextField
            placeholder='Search instructors...'
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

        {/* Instructors Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Instructor</TableCell>
                <TableCell>Experience</TableCell>
                <TableCell>Specializations</TableCell>
                <TableCell>Hourly Rate</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align='right'>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align='center'>
                    Loading instructors...
                  </TableCell>
                </TableRow>
              ) : instructors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align='center'>
                    No instructors found
                  </TableCell>
                </TableRow>
              ) : (
                instructors.map((instructor) => (
                  <TableRow key={instructor._id}>
                    <TableCell>
                      <Box className={styles.instructorCell}>
                        <Avatar
                          src={instructor.user?.profileImage}
                          alt={instructor.user?.name}
                          className={styles.instructorAvatar}
                        />
                        <Box>
                          <Typography variant='body1'>
                            {instructor.user?.name}
                          </Typography>
                          <Typography variant='caption' color='textSecondary'>
                            {instructor.user?.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{instructor.experience} years</TableCell>
                    <TableCell>
                      {instructor.specializations &&
                      instructor.specializations.length > 0 ? (
                        <Box className={styles.chipContainer}>
                          {instructor.specializations
                            .slice(0, 2)
                            .map((spec) => (
                              <Chip
                                key={spec}
                                label={spec.replace("_", " ")}
                                size='small'
                                className={styles.chip}
                              />
                            ))}
                          {instructor.specializations.length > 2 && (
                            <Chip
                              label={`+${
                                instructor.specializations.length - 2
                              }`}
                              size='small'
                              variant='outlined'
                            />
                          )}
                        </Box>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell>${instructor.hourlyRate}/hr</TableCell>
                    <TableCell>
                      <Box className={styles.ratingCell}>
                        <Rating
                          value={instructor.averageRating || 0}
                          precision={0.5}
                          readOnly
                          size='small'
                        />
                        <Typography variant='caption' color='textSecondary'>
                          ({instructor.totalReviews || 0})
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {instructor.isVerified ? (
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
                        onClick={(e) => handleActionClick(e, instructor._id)}
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
          count={instructors.length}
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
        <MenuItem onClick={handleViewInstructor}>
          <Visibility fontSize='small' className={styles.menuIcon} />
          View Details
        </MenuItem>
        {selectedInstructorId &&
          !instructors.find((instr) => instr._id === selectedInstructorId)
            ?.isVerified && (
            <MenuItem onClick={handleVerifyInstructor}>
              <CheckCircle fontSize='small' className={styles.menuIcon} />
              Verify Instructor
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

export default InstructorsList;
