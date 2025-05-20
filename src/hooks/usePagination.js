import { useState } from "react";

export const usePagination = (initialPage = 1, initialRowsPerPage = 10) => {
  const [page, setPage] = useState(initialPage);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [total, setTotal] = useState(0);

  // Calculate total pages
  const totalPages = Math.ceil(total / rowsPerPage);

  // Handle page change
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  return {
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    total,
    setTotal,
    totalPages,
    handlePageChange,
    handleRowsPerPageChange,
  };
};
