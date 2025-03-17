import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center mt-6 space-x-2">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={`cursor-pointer px-3 py-1 rounded border ${
          currentPage === 1 ? "bg-gray-300" : "bg-white hover:bg-gray-100"
        }`}
      >
        Prev
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`cursor-pointer px-3 py-1 rounded border ${
            page === currentPage
              ? "bg-blue-500 text-white"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={`cursor-pointer px-3 py-1 rounded border ${
          currentPage === totalPages
            ? "bg-gray-300"
            : "bg-white hover:bg-gray-100"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
