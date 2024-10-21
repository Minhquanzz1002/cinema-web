import React, {useMemo} from 'react';
import {FaAngleLeft, FaAngleRight, FaAnglesLeft, FaAnglesRight} from "react-icons/fa6";

type PaginationProps = {
    totalPages: number;
    currentPage: number;
    onChangePage: (page: number) => void;
}

const usePageRange = (currentPage: number, totalPages: number) => {
    return useMemo(() => {
        const range = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                range.push(i);
            }
        } else if (currentPage <= 4) {
            for (let i = 1; i <= 5; i++) {
                range.push(i);
            }
            range.push('...', totalPages);
        } else if (currentPage > totalPages - 4) {
            range.push(1, '...');
            for (let i = totalPages - 4; i <= totalPages; i++) {
                range.push(i);
            }
        } else {
            range.push(1, '...', currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2, '...', totalPages);
        }

        return range;
    }, [currentPage, totalPages]);
};

const PageButton = React.memo(({page, currentPage, onClick}: {
    page: number | string;
    currentPage: number;
    onClick: () => void
}) => {
    if (typeof page === 'number') {
        return (
            <button onClick={onClick} className={`w-full h-full`}
                    aria-label={`Page ${page}`}
                    aria-current={page === currentPage ? 'page' : undefined}
                    disabled={page === currentPage}
            >
                {page}
            </button>
        );
    }

    return <span className="select-none">{page}</span>;
});

PageButton.displayName = 'PageButton';

const Pagination = ({totalPages, currentPage, onChangePage}: PaginationProps) => {
    const handleFirstPage = () => onChangePage(1);
    const handleLastPage = () => onChangePage(totalPages);
    const handlePrevPage = () => onChangePage(Math.max(1, currentPage - 1));
    const handleNextPage = () => onChangePage(Math.min(totalPages, currentPage + 1));

    const pageRange = usePageRange(currentPage, totalPages);

    return (
        <div className="flex flex-nowrap w-full items-center justify-center space-x-1">
            <button onClick={handleFirstPage} aria-label="First Page"
                    className="size-8 rounded-lg flex justify-center items-center border disabled:text-gray-600"
                    disabled={currentPage === 1}>
                <FaAnglesLeft size={12}/>
            </button>
            <button onClick={handlePrevPage} aria-label="Previous Page"
                    className="size-8 rounded-lg flex justify-center items-center border disabled:text-gray-600"
                    disabled={currentPage === 1}>
                <FaAngleLeft size={12}/>
            </button>
            <ul className="flex flex-row space-x-1">
                {
                    pageRange.map((page, index) => (
                        <li key={`page-${index}`}
                            className={`font-medium text-sm size-8 rounded-lg flex justify-center items-center border ${page === currentPage ? 'bg-brand-500 text-white border-brand-500' : 'hover:bg-gray-50'}`}>
                            <PageButton page={page} currentPage={currentPage}
                                        onClick={() => typeof page === 'number' && onChangePage(page)}/>
                        </li>
                    ))
                }
            </ul>
            <button onClick={handleNextPage} aria-label="Next Page"
                    className=" font-medium size-8 rounded-lg flex justify-center items-center border disabled:text-gray-600"
                    disabled={currentPage === totalPages}>
                <FaAngleRight size={12}/>
            </button>
            <button onClick={handleLastPage}
                    className="size-8 rounded-lg flex justify-center items-center border disabled:text-gray-600"
                    aria-label="Last Page" disabled={currentPage === totalPages}>
                <FaAnglesRight size={12}/>
            </button>
        </div>
    );
};

export default React.memo(Pagination);