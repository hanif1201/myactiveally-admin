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
  Timer,
  AccessTime,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import PageHeader from "../../components/common/PageHeader";
import api from "../../api";
import { useNotification } from "../../hooks/useNotification";
import { usePagination } from "../../hooks/usePagination";
import styles from "./WorkoutsList.module.css";

const WorkoutsList = () => {
  const navigate = useNavigate();
  const { showError } = useNotification();
  const {
    page,
    rowsPerPage,
    setTotal,
    handlePageChange,
    handleRowsPerPageChange,
  } = usePagination();

  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [actionAnchorEl, setActionAnchorEl] = useState(null);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState(null);

  // Fetch workouts
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setLoading(true);
        const response = await api.workouts.getAllWorkouts({
          page,
          limit: rowsPerPage,
          type: typeFilter,
          search: searchQuery,
        });

        setWorkouts(response.data.workouts);
        setTotal(response.data.pagination.total);
      } catch (error) {
        showError("Failed to fetch workouts");
        console.error("Error fetching workouts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [page, rowsPerPage, typeFilter, searchQuery, showError, setTotal]);

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
  const handleFilterSelect = (type) => {
    setTypeFilter(type);
    handleFilterClose();
  };

  // Handle action button click
  const handleActionClick = (event, workoutId) => {
    setActionAnchorEl(event.currentTarget);
    setSelectedWorkoutId(workoutId);
  };

  // Handle action close
  const handleActionClose = () => {
    setActionAnchorEl(null);
    setSelectedWorkoutId(null);
  };

  // Handle view workout
  const handleViewWorkout = () => {
    navigate(`/workouts/${selectedWorkoutId}`);
    handleActionClose();
  };

  // Format date
  const formatDate = (date) => {
    return format(new Date(date), "MMM d, yyyy");
  };

  // Format duration
  const formatDuration = (duration) => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <Box className={styles.workoutsListContainer}>
      <PageHeader
        title='Workouts'
        breadcrumbs={[{ label: "Workouts", link: "/workouts" }]}
      />

      <Paper className={styles.workoutsListPaper}>
        {/* Search and Filter */}
        <Box className={styles.workoutsListToolbar}>
          <TextField
            placeholder='Search workouts...'
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
              {typeFilter && (
                <Chip
                  label={typeFilter}
                  size='small'
                  onDelete={() => setTypeFilter("")}
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
              <MenuItem onClick={() => handleFilterSelect("cardio")}>
                Cardio
              </MenuItem>
              <MenuItem onClick={() => handleFilterSelect("strength")}>
                Strength
              </MenuItem>
              <MenuItem onClick={() => handleFilterSelect("flexibility")}>
                Flexibility
              </MenuItem>
              <MenuItem onClick={() => handleFilterSelect("hiit")}>
                HIIT
              </MenuItem>
              <MenuItem onClick={() => handleFilterSelect("custom")}>
                Custom
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Workouts Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Calories</TableCell>
                <TableCell align='right'>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align='center'>
                    Loading workouts...
                  </TableCell>
                </TableRow>
              ) : workouts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align='center'>
                    No workouts found
                  </TableCell>
                </TableRow>
              ) : (
                workouts.map((workout) => (
                  <TableRow key={workout._id}>
                    <TableCell>{workout.name}</TableCell>
                    <TableCell>
                      <Box className={styles.userCell}>
                        <Avatar
                          src={workout.user?.profileImage}
                          alt={workout.user?.name}
                          className={styles.userAvatar}
                        />
                        <Typography variant='body2'>
                          {workout.user?.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<FitnessCenter fontSize='small' />}
                        label={workout.type || "Custom"}
                        size='small'
                      />
                    </TableCell>
                    <TableCell>{formatDate(workout.date)}</TableCell>
                    <TableCell>
                      <Box className={styles.durationCell}>
                        <AccessTime fontSize='small' />
                        <Typography variant='body2'>
                          {formatDuration(workout.duration)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{workout.calories || "N/A"}</TableCell>
                    <TableCell align='right'>
                      <IconButton
                        aria-label='actions'
                        onClick={(e) => handleActionClick(e, workout._id)}
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
          count={workouts.length}
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
        <MenuItem onClick={handleViewWorkout}>
          <Visibility fontSize='small' className={styles.menuIcon} />
          View Details
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default WorkoutsList;
