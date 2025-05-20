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
  Typography,
} from "@mui/material";
import {
  Search,
  FilterList,
  MoreVert,
  Visibility,
  Cancel,
  CheckCircle,
  Event,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import api from "../../api";
import { useNotification } from "../../hooks/useNotification";
import { usePagination } from "../../hooks/usePagination";
import styles from "./ConsultationsList.module.css";

const ConsultationsList = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const {
    page,
    rowsPerPage,
    setTotal,
    handlePageChange,
    handleRowsPerPageChange,
  } = usePagination();

  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [actionAnchorEl, setActionAnchorEl] = useState(null);
  const [selectedConsultationId, setSelectedConsultationId] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    content: "",
    action: null,
  });

  // Fetch consultations
  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        setLoading(true);
        const response = await api.consultations.getAllConsultations({
          page,
          limit: rowsPerPage,
          status: statusFilter,
        });

        setConsultations(response.data.consultations);
        setTotal(response.data.pagination.total);
      } catch (error) {
        showError("Failed to fetch consultations");
        console.error("Error fetching consultations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, [page, rowsPerPage, statusFilter, showError, setTotal]);

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
  const handleActionClick = (event, consultationId) => {
    setActionAnchorEl(event.currentTarget);
    setSelectedConsultationId(consultationId);
  };

  // Handle action close
  const handleActionClose = () => {
    setActionAnchorEl(null);
    setSelectedConsultationId(null);
  };

  // Handle view consultation
  const handleViewConsultation = () => {
    navigate(`/consultations/${selectedConsultationId}`);
    handleActionClose();
  };

  // Render status chip
  const renderStatusChip = (status) => {
    switch (status) {
      case "pending":
        return <Chip label='Pending' color='warning' size='small' />;
      case "confirmed":
        return <Chip label='Confirmed' color='primary' size='small' />;
      case "completed":
        return <Chip label='Completed' color='success' size='small' />;
      case "cancelled":
        return <Chip label='Cancelled' color='error' size='small' />;
      case "refunded":
        return <Chip label='Refunded' color='default' size='small' />;
      default:
        return <Chip label={status} color='default' size='small' />;
    }
  };

  // Format price
  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  // Format date and time
  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleString();
  };

  // Calculate duration in hours and minutes
  const formatDuration = (duration) => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;

    let result = "";
    if (hours > 0) {
      result += `${hours} hr${hours > 1 ? "s" : ""} `;
    }
    if (minutes > 0 || hours === 0) {
      result += `${minutes} min${minutes > 1 ? "s" : ""}`;
    }

    return result;
  };

  return (
    <Box className={styles.consultationsListContainer}>
      <PageHeader
        title='Consultations'
        breadcrumbs={[{ label: "Consultations", link: "/consultations" }]}
      />

      <Paper className={styles.consultationsListPaper}>
        {/* Search and Filter */}
        <Box className={styles.consultationsListToolbar}>
          <TextField
            placeholder='Search consultations...'
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
              <MenuItem onClick={() => handleFilterSelect("pending")}>
                Pending
              </MenuItem>
              <MenuItem onClick={() => handleFilterSelect("confirmed")}>
                Confirmed
              </MenuItem>
              <MenuItem onClick={() => handleFilterSelect("completed")}>
                Completed
              </MenuItem>
              <MenuItem onClick={() => handleFilterSelect("cancelled")}>
                Cancelled
              </MenuItem>
              <MenuItem onClick={() => handleFilterSelect("refunded")}>
                Refunded
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Consultations Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Instructor</TableCell>
                <TableCell>Date & Time</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align='right'>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} align='center'>
                    Loading consultations...
                  </TableCell>
                </TableRow>
              ) : consultations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align='center'>
                    No consultations found
                  </TableCell>
                </TableRow>
              ) : (
                consultations.map((consultation) => (
                  <TableRow key={consultation._id}>
                    <TableCell>{consultation._id.substring(0, 8)}...</TableCell>
                    <TableCell>
                      <Box className={styles.userCell}>
                        <Avatar
                          src={consultation.user?.profileImage}
                          alt={consultation.user?.name}
                          className={styles.avatar}
                        />
                        <Typography variant='body2'>
                          {consultation.user?.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box className={styles.userCell}>
                        <Avatar
                          src={consultation.instructor?.user?.profileImage}
                          alt={consultation.instructor?.user?.name}
                          className={styles.avatar}
                        />
                        <Typography variant='body2'>
                          {consultation.instructor?.user?.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {formatDateTime(consultation.startTime)}
                    </TableCell>
                    <TableCell>
                      {formatDuration(consultation.duration)}
                    </TableCell>
                    <TableCell>{consultation.consultationType}</TableCell>
                    <TableCell>{formatPrice(consultation.price)}</TableCell>
                    <TableCell>
                      {renderStatusChip(consultation.status)}
                    </TableCell>
                    <TableCell align='right'>
                      <IconButton
                        aria-label='actions'
                        onClick={(e) => handleActionClick(e, consultation._id)}
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
          count={consultations.length}
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
        <MenuItem onClick={handleViewConsultation}>
          <Visibility fontSize='small' className={styles.menuIcon} />
          View Details
        </MenuItem>
      </Menu>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        content={confirmDialog.content}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
        onConfirm={() => {
          if (confirmDialog.action) {
            confirmDialog.action();
          }
          setConfirmDialog({ ...confirmDialog, open: false });
        }}
      />
    </Box>
  );
};

export default ConsultationsList;
