"use client";
// import { useState, useEffect } from 'react';
// import Image from 'next/image';
import './pagination.css';
import { useSearchParams, useRouter } from "next/navigation";

// Quirky Pagination Component
const QuirkyPagination = ({ totalItems, itemsPerPage = 5, currentPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const searchParams = useSearchParams();
    const router = useRouter();
    // Array of fun emoji reactions for page buttons
    const emojis = ['🤪', '🤯', '😎', '🤓', '🧐', '🤩', '😲', '🥳', '👽', '🦄'];

    // Get a consistent emoji for each page number
    const getEmoji = (pageNum) => {
        return emojis[pageNum % emojis.length];
    };

    // Handle page change with URL update
    const handlePageChange = (pageNum) => {
        // Update URL with page parameter
        const params = new URLSearchParams(searchParams);
        params.set("page", pageNum.toString());

        router.push(`?${params.toString()}`, { shallow: true });

        // Call the provided onPageChange function
        onPageChange(pageNum);
    };

    // Generate an array of page numbers to display
    const getPageNumbers = () => {
        const pages = [];

        // Always show first page
        pages.push(1);

        // Calculate range around current page
        const startPage = Math.max(2, currentPage - 1);
        const endPage = Math.min(totalPages - 1, currentPage + 1);

        // Add ellipsis after first page if needed
        if (startPage > 2) {
            pages.push('...');
        }

        // Add pages in the middle
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        // Add ellipsis before last page if needed
        if (endPage < totalPages - 1) {
            pages.push('...');
        }

        // Always show last page if there is more than one page
        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div className="quirky-pagination">
            {/*<div className="pagination-doodle left">*/}
            {/*    <Image src="/images/doodle-1.png" width={60} height={60} alt="Doodle" />*/}
            {/*</div>*/}

            {/* Previous button */}
            <button
                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-btn prev-btn"
                aria-label="Previous page"
            >
                <span className="btn-icon">👈</span>
                <span className="btn-text">Prev</span>
            </button>

            {/* Page numbers */}
            <div className="page-numbers">
                {getPageNumbers().map((page, index) => {
                    console.log("page:........................", currentPage === page, currentPage, page, getPageNumbers())
                        return typeof page === 'number' ? (
                            <button
                                key={`page-${page}`}
                                onClick={() => handlePageChange(page)}
                                className={`page-number ${currentPage === page ? 'active' : ''}`}
                                aria-label={`Page ${page}`}
                                aria-current={currentPage === page ? 'page' : undefined}
                            >
                                <span className="page-emoji">{getEmoji(page)}</span>
                                <span className="page-num">{page}</span>
                            </button>
                        ) : (
                            <span key={`ellipsis-${index}`} className="ellipsis">...</span>
                        )
                    }
                )}
            </div>

            {/* Next button */}
            <button
                onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-btn next-btn"
                aria-label="Next page"
            >
                <span className="btn-text">Next</span>
                <span className="btn-icon">👉</span>
            </button>

            {/*<div className="pagination-doodle right">*/}
            {/*    <Image src="/images/doodle-1.png" width={60} height={60} alt="Doodle" />*/}
            {/*</div>*/}

            {/* Fun message about current page */}
            <div className="quirky-message">
                {currentPage === 1 ? (
                    "You're at the beginning of weirdness! 🤪"
                ) : currentPage === totalPages ? (
                    "You've reached peak weird! 🤯"
                ) : (
                    `Page ${currentPage} of weird wonders! 🧐`
                )}
            </div>
        </div>
    );
};

// Export the component
export default QuirkyPagination;
