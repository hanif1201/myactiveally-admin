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
  Avatar,
  Typography,
  Button,
} from "@mui/material";
import {
  Search,
  FilterList,
  MoreVert,
  Visibility,
  FitnessCenter,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import PageHeader from "../../components/common/PageHeader";
import api from "../../api";
import { useNotification } from "../../hooks/useNotification";
import { usePagination } from "../../hooks/usePagination";
import styles from "./MatchesList.module.css";

const MatchesList = () => {
  const navigate = useNavigate();
  const { showError } = useNotification();
  const {
    page,
    rowsPerPage,
    setTotal,
    handlePageChange,
    handleRowsPerPageChange,
  } = usePagination();

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [actionAnchorEl, setActionAnchorEl] = useState(null);
  const [selectedMatchId, setSelectedMatchId] = useState(null);

  // Fetch matches
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const response = await api.matches.getAllMatches({
          page,
          limit: rowsPerPage,
          status: statusFilter,
          search: searchQuery,
        });

        setMatches(response.data.matches);
        setTotal(response.data.pagination.total);
      } catch (error) {
        showError("Failed to fetch matches");
        console.error("Error fetching matches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
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
  const handleActionClick = (event, matchId) => {
    setActionAnchorEl(event.currentTarget);
    setSelectedMatchId(matchId);
  };

  // Handle action close
  const handleActionClose = () => {
    setActionAnchorEl(null);
    setSelectedMatchId(null);
  };

  // Handle view match
  const handleViewMatch = () => {
    navigate(`/matches/${selectedMatchId}`);
    handleActionClose();
  };

  // Render status chip
  const renderStatusChip = (status) => {
    switch (status) {
      case "pending":
        return <Chip label='Pending' color='warning' size='small' />;
      case "active":
        return <Chip label='Active' color='success' size='small' />;
      case "cancelled":
        return <Chip label='Cancelled' color='error' size='small' />;
      case "completed":
        return <Chip label='Completed' color='default' size='small' />;
      default:
        return <Chip label='Unknown' color='default' size='small' />;
    }
  };

  // Format date
  const formatDate = (date) => {
    return format(new Date(date), "MMM d, yyyy");
  };

  return (
    <Box className={styles.matchesListContainer}>
      <PageHeader
        title='Matches'
        breadcrumbs={[{ label: "Matches", link: "/matches" }]}
      />

      <Paper className={styles.matchesListPaper}>
        {/* Search and Filter */}
        <Box className={styles.matchesListToolbar}>
          <TextField
            placeholder='Search matches...'
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
              <MenuItem onClick={() => handleFilterSelect("active")}>
                Active
              </MenuItem>
              <MenuItem onClick={() => handleFilterSelect("cancelled")}>
                Cancelled
              </MenuItem>
              <MenuItem onClick={() => handleFilterSelect("completed")}>
                Completed
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Matches Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Match ID</TableCell>
                <TableCell>User 1</TableCell>
                <TableCell>User 2</TableCell>
                <TableCell>Match Type</TableCell>
                <TableCell>Created On</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align='right'>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align='center'>
                    Loading matches...
                  </TableCell>
                </TableRow>
              ) : matches.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align='center'>
                    No matches found
                  </TableCell>
                </TableRow>
              ) : (
                matches.map((match) => (
                  <TableRow key={match._id}>
                    <TableCell>{match._id.substring(0, 8)}...</TableCell>
                    <TableCell>
                      <Box className={styles.userCell}>
                        <Avatar
                          src={match.user1?.profileImage}
                          alt={match.user1?.name}
                          className={styles.userAvatar}
                        />
                        <Typography variant='body2'>
                          {match.user1?.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box className={styles.userCell}>
                        <Avatar
                          src={match.user2?.profileImage}
                          alt={match.user2?.name}
                          className={styles.userAvatar}
                        />
                        <Typography variant='body2'>
                          {match.user2?.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<FitnessCenter fontSize='small' />}
                        label={match.matchType || "Workout"}
                        size='small'
                      />
                    </TableCell>
                    <TableCell>{formatDate(match.createdAt)}</TableCell>
                    <TableCell>{renderStatusChip(match.status)}</TableCell>
                    <TableCell align='right'>
                      <IconButton
                        aria-label='actions'
                        onClick={(e) => handleActionClick(e, match._id)}
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
          count={matches.length}
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
        <MenuItem onClick={handleViewMatch}>
          <Visibility fontSize='small' className={styles.menuIcon} />
          View Details
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default MatchesList;
