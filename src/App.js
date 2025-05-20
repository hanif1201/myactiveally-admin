import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { useTheme } from "./context/ThemeContext";
import { CssBaseline, ThemeProvider as MuiThemeProvider } from "@mui/material";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import MainLayout from "./components/layout/MainLayout";

// Auth Pages
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";

// Dashboard Pages
import Dashboard from "./pages/dashboard/Dashboard";

// User Pages
import UsersList from "./pages/users/UsersList";
import UserDetails from "./pages/users/UserDetails";
import UserForm from "./pages/users/UserForm";

// Instructor Pages
import InstructorsList from "./pages/instructors/InstructorsList";
import InstructorDetails from "./pages/instructors/InstructorDetails";
import InstructorVerification from "./pages/instructors/InstructorVerification";

// Gym Pages
import GymsList from "./pages/gyms/GymsList";
import GymDetails from "./pages/gyms/GymDetails";
import GymVerification from "./pages/gyms/GymVerification";

// Consultation Pages
import ConsultationsList from "./pages/consultations/ConsultationsList";
import ConsultationDetails from "./pages/consultations/ConsultationDetails";

// Match Pages
import MatchesList from "./pages/matches/MatchesList";
import MatchDetails from "./pages/matches/MatchDetails";

// Workout Pages
import WorkoutsList from "./pages/workouts/WorkoutsList";
import WorkoutDetails from "./pages/workouts/WorkoutDetails";

// Report Pages
import UserReports from "./pages/reports/UserReports";
import InstructorReports from "./pages/reports/InstructorReports";
import ConsultationReports from "./pages/reports/ConsultationReports";
import MatchReports from "./pages/reports/MatchReports";

// Settings Pages
import GeneralSettings from "./pages/settings/GeneralSettings";
import ApiSettings from "./pages/settings/ApiSettings";

function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const { theme } = useTheme();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute isAuthenticated={isAuthenticated} />}>
          <Route path='/login' element={<Login />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
        </Route>

        {/* Private Routes */}
        <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
          <Route element={<MainLayout />}>
            <Route path='/' element={<Navigate to='/dashboard' replace />} />
            <Route path='/dashboard' element={<Dashboard />} />

            {/* Users */}
            <Route path='/users' element={<UsersList />} />
            <Route path='/users/:id' element={<UserDetails />} />
            <Route path='/users/new' element={<UserForm />} />
            <Route path='/users/edit/:id' element={<UserForm />} />

            {/* Instructors */}
            <Route path='/instructors' element={<InstructorsList />} />
            <Route path='/instructors/:id' element={<InstructorDetails />} />
            <Route
              path='/instructors/verification'
              element={<InstructorVerification />}
            />

            {/* Gyms */}
            <Route path='/gyms' element={<GymsList />} />
            <Route path='/gyms/:id' element={<GymDetails />} />
            <Route path='/gyms/verification' element={<GymVerification />} />

            {/* Consultations */}
            <Route path='/consultations' element={<ConsultationsList />} />
            <Route
              path='/consultations/:id'
              element={<ConsultationDetails />}
            />

            {/* Matches */}
            <Route path='/matches' element={<MatchesList />} />
            <Route path='/matches/:id' element={<MatchDetails />} />

            {/* Workouts */}
            <Route path='/workouts' element={<WorkoutsList />} />
            <Route path='/workouts/:id' element={<WorkoutDetails />} />

            {/* Reports */}
            <Route path='/reports/users' element={<UserReports />} />
            <Route
              path='/reports/instructors'
              element={<InstructorReports />}
            />
            <Route
              path='/reports/consultations'
              element={<ConsultationReports />}
            />
            <Route path='/reports/matches' element={<MatchReports />} />

            {/* Settings */}
            <Route path='/settings/general' element={<GeneralSettings />} />
            <Route path='/settings/api' element={<ApiSettings />} />
          </Route>
        </Route>

        {/* 404 - Not Found */}
        <Route path='*' element={<Navigate to='/login' replace />} />
      </Routes>
    </MuiThemeProvider>
  );
}

export default App;
