import { getMovieDetail } from 'actions/movieActions';
import UI from './ui';

// generateMetadata를 layout.js 혹은 page.js 파일에서 사용하면 next에서 자동으로 메타데이터 반영
export async function generateMetadata({ params }) {
    const movie = await getMovieDetail(params?.id);

    return {
        title: movie.title,
        description: movie.overview,
        openGraph: {
            images: [movie.image_url],
        },
    };
}

export default async function MovieDetail({ params }) {
    const movie = await getMovieDetail(params?.id);

    return (
        <main className="py-16 flex items-center bg-blue-50 w-full absolute top-0 bottom-0 left-0 right-0">
            {movie ? <UI movie={movie} /> : <div>Movie does not exists</div>}
        </main>
    );
}
