import { UseQueryResult } from '@tanstack/react-query';
import { SuccessResponse } from '@/core/repository/interface';
import { PageObject } from '@/core/pagination/interface';
import { useCallback, useEffect, useState } from 'react';

interface UsePaginationProps<T> {
    queryResult: UseQueryResult<SuccessResponse<PageObject<T>>, unknown>;
    initialPage?: number;
}

interface PaginationResult<T> {
    data: T[];
    currentPage: number;
    totalPages: number;
    onChangePage: (page: number) => void;
    isLoading: boolean;
    error: unknown;
}

function usePagination<T>({ queryResult, initialPage = 1 }: UsePaginationProps<T>): PaginationResult<T> {
    const [currentPage, setCurrentPage] = useState<number>(initialPage);
    const { data, isLoading, error } = queryResult;

    const onChangePage = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    useEffect(() => {
        setCurrentPage(initialPage);
    }, [initialPage]);

    const totalPages = data?.data.page.totalPages || 0;
    const paginatedData = data?.data.content || [];

    return {
        currentPage,
        totalPages,
        data: paginatedData,
        onChangePage,
        isLoading,
        error,
    };
}

export default usePagination;
