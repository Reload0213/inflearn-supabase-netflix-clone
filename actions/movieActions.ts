'use server';

import { createServerSupabaseClient } from 'utils/supabase/server';

const handleError = (error) => {
    if (error) {
        console.error(error);
        throw error;
    }
};

export async function searchMovies(search = '') {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase.from('movie').select('*').ilike('title', `%${search}%`);

    handleError(error);

    return data;
}

export async function getMovieDetail(id) {
    const supabase = await createServerSupabaseClient();

    // maybeSingle 1개의 데이터를 가져오지만 null일 수도 있다는 뜻
    const { data, error } = await supabase.from('movie').select('*').eq('id', id).maybeSingle();

    handleError(error);

    return data;
}
