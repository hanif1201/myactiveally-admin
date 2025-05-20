import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = ({ isAuthenticated }) => {
  return isAuthenticated ? <Navigate to='/dashboard' replace /> : <Outlet />;
};

export default PublicRoute;
