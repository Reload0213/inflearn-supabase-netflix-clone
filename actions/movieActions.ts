'use server';

import { createServerSupabaseClient } from 'utils/supabase/server';

const handleError = (error) => {
    if (error) {
        console.error(error);
        throw error;
    }
};

export async function searchMovies({ search, page, pageSize }) {
    const supabase = await createServerSupabaseClient();

    const { data, count, error } = await supabase
        .from('movie')
        .select('*', { count: 'exact' })
        .ilike('title', `%${search}%`)
        .range((page - 1) * pageSize, page * pageSize - 1);

    const hasNextPage = count > page * pageSize;

    if (error) {
        console.error(error);
        return {
            data: [],
            count: 0,
            page: null,
            pageSize: null,
            error,
        };
    }
    return {
        data,
        page,
        pageSize,
        hasNextPage,
    };
}

export async function getMovieDetail(id) {
    const supabase = await createServerSupabaseClient();

    // maybeSingle 1개의 데이터를 가져오지만 null일 수도 있다는 뜻
    const { data, error } = await supabase.from('movie').select('*').eq('id', id).maybeSingle();

    handleError(error);

    return data;
}
