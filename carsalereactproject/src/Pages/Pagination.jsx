import React from 'react';
import './ProductList.css';
function Pagination({ nPages, currentPage, setCurrentPage }) {
  const pageNumbers = [...Array(nPages + 1).keys()].slice(1);

  const goToNextPage = () => {
    if (currentPage !== nPages) setCurrentPage(currentPage + 1);
  };
  
  const goToPrevPage = () => {
    if (currentPage !== 1) setCurrentPage(currentPage - 1);
  };

    return (
        <div>
            <nav className="nav-relative">
      <ul>
        <li>
          <button className="btn" onClick={goToPrevPage}>
            Previous
          </button>
        </li>
        
        {pageNumbers.map(pgNumber => (
          <li key={pgNumber}>
                <button className="btn" onClick={() => setCurrentPage(pgNumber)}>
              {pgNumber}
            </button>
          </li>
        ))}
        
        <li>
                  <button className="btn" onClick={goToNextPage}>
            Next
          </button>
        </li>
      </ul>
            </nav>
        </div>
  );
}

export default Pagination;