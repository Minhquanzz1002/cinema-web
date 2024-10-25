import { useCallback } from 'react';
import { UseQueryResult } from '@tanstack/react-query';
import { SuccessResponse } from '@/core/repository/interface';
import { PageObject } from '@/core/pagination/interface';

export interface PaginationState {
    page: number;
}

interface UseFilterPaginationProps<TData, TFilter extends PaginationState> {
    queryResult: UseQueryResult<SuccessResponse<PageObject<TData>>, unknown>;
    initialFilters: TFilter;
    onFilterChange: (filters: TFilter) => void;
}

function useFilterPagination<TData, TFilter extends PaginationState>({
                                                                         queryResult,
                                                                         initialFilters,
                                                                         onFilterChange
                                                                     }: UseFilterPaginationProps<TData, TFilter>) {

    const handleFilterChange = useCallback((newFilters: Partial<TFilter>) => {
        const updatedFilters = {
            ...initialFilters,
            ...newFilters,
            page: 'page' in newFilters ? newFilters.page : 1
        } as TFilter;

        onFilterChange(updatedFilters);
    }, [initialFilters, onFilterChange]);


    const handlePageChange = useCallback((newPage: number) => {
        handleFilterChange({ page: newPage } as Partial<TFilter>);
    }, [handleFilterChange]);


    const { data, isLoading, error } = queryResult;
    const content = data?.data.content || [];
    const totalPages = data?.data.page.totalPages || 0;

    return {
        // Data
        data: content,
        totalPages,
        currentPage: initialFilters.page,

        // Loading state
        isLoading,
        error,

        // Handlers
        onFilterChange: handleFilterChange,
        onPageChange: handlePageChange
    };
}

export default useFilterPagination;