import { QueryFunction, QueryKey } from '@tanstack/query-core';
import { SuccessResponse } from '@/core/repository/interface';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

function useDataFetching<T>(
    queryKey: QueryKey,
    queryFn: QueryFunction<SuccessResponse<T>>,
    options?: Omit<UseQueryOptions<SuccessResponse<T>>, 'queryFn' | 'queryKey'>,
) {
    const [data, setData] = useState<T | null>(null);
    const query = useQuery<SuccessResponse<T>>({
        queryKey,
        queryFn,
        ...options,
    });

    useEffect(() => {
        if (query.data) {
            setData(query.data.data);
        }
    }, [query.data]);

    return { ...query, data };
}

export default useDataFetching;