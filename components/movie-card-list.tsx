'use client';

import MovieCard from './movie-card';
import { searchMovies } from 'actions/movieActions';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@material-tailwind/react';
import { useRecoilValue } from 'recoil';
import { searchState } from 'utils/recoil/atoms';

export default function MovieCardList() {
    const search = useRecoilValue(searchState);

    const getMoviesQuery = useQuery({
        queryKey: ['movie', search],
        queryFn: () => searchMovies(search),
    });

    return (
        <div className="grid gap-1 md:grid-cols-4 grid-cols-3 w-full h-full">
            {getMoviesQuery?.isLoading ? (
                <Spinner />
            ) : (
                getMoviesQuery.data &&
                getMoviesQuery?.data.map((movie) => {
                    return <MovieCard key={movie.id} movie={movie} />;
                })
            )}
        </div>
    );
}
