import React from 'react';
import { Pagination } from 'react-bootstrap';

const ProductsPagination = ({ totalProducts, productsPerPage, currentPage, setCurrentPage }) => {
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  return (
    <Pagination className="mt-4 justify-content-center">
      {/* Previous Button */}
      <Pagination.Prev
        disabled={currentPage === 1}
        onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
      >
        Previous
      </Pagination.Prev>

      {/* Page Numbers */}
      {[...Array(totalPages)].map((_, idx) => (
        <Pagination.Item
          key={idx + 1}
          active={idx + 1 === currentPage}
          onClick={() => setCurrentPage(idx + 1)}
        >
          {idx + 1}
        </Pagination.Item>
      ))}

      {/* Next Button */}
      <Pagination.Next
        disabled={currentPage === totalPages}
        onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
      >
        Next
      </Pagination.Next>
    </Pagination>
  );
};

export default ProductsPagination;
