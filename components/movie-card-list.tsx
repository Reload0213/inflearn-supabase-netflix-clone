'use client';

import { useEffect } from 'react';
import MovieCard from './movie-card';
import { searchMovies } from 'actions/movieActions';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { Spinner } from '@material-tailwind/react';
import { useRecoilValue } from 'recoil';
import { searchState } from 'utils/recoil/atoms';
import { useInView } from 'react-intersection-observer';

export default function MovieCardList() {
    const search = useRecoilValue(searchState);

    const [ref, inView] = useInView({
        threshold: 0,
    });

    const { data, isFetching, isFetchingNextPage, isFetchingPreviousPage, fetchNextPage, hasNextPage } =
        useInfiniteQuery({
            initialPageParam: 1,
            queryKey: ['movie', search],
            queryFn: ({ pageParam }) => searchMovies({ search, page: pageParam, pageSize: 12 }),
            getNextPageParam: (lastPage) => (lastPage?.page ? lastPage?.page + 1 : null),
        });

    useEffect(() => {
        if (inView && hasNextPage && !isFetching && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage]);

    return (
        <div className="grid gap-1 md:grid-cols-4 grid-cols-3 w-full h-full">
            {(isFetching || isFetchingNextPage) && <Spinner />}
            {
                <>
                    {data?.pages
                        ?.map((page) => page.data)
                        ?.flat()
                        ?.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    <div ref={ref}></div>
                </>
            }
        </div>
    );
}
