import { useState, useEffect, useMemo } from "react";

export default function usePagination<T>(projects: T[], perPage: number = 8) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(
    () => Math.ceil(projects.length / perPage),
    [projects.length, perPage]
  );

  const currentProjects = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return projects.slice(start, start + perPage);
  }, [projects, currentPage, perPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [projects]);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (startPage > 1) {
        pages.unshift("...");
        pages.unshift(1);
      }

      if (endPage < totalPages) {
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return {
    currentPage,
    setCurrentPage,
    totalPages,
    currentProjects,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    getPageNumbers,
  };
}

export type PaginationState<T> = ReturnType<typeof usePagination<T>>;