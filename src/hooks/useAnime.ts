import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { type UserAnime } from '../db';
import { useAuth } from '../context/AuthContext';

export function useAnime(stato?: UserAnime['stato'], sortBy: 'recent' | 'oldest' | 'title' = 'recent') {
    const { user } = useAuth();
    const [animeList, setAnimeList] = useState<UserAnime[]>([]);

    useEffect(() => {
        if (!user) return;

        const fetchAnime = async () => {
            let query = supabase
                .from('anime')
                .select('*')
                .eq('user_id', user.id);

            if (stato) {
                query = query.eq('stato', stato);
            }

            const { data, error } = await query;

            if (error) {
                console.error("Error fetching anime:", error);
                return;
            }

            const results = (data || []) as UserAnime[];

            results.sort((a, b) => {
                if (sortBy === 'recent') return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
                if (sortBy === 'oldest') return new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
                if (sortBy === 'title') return a.titolo.localeCompare(b.titolo);
                return 0;
            });

            setAnimeList(results);
        };

        fetchAnime();

        // Real-time subscription
        const subscription = supabase
            .channel('anime_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'anime', filter: `user_id=eq.${user.id}` }, () => {
                fetchAnime();
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [user, stato, sortBy]);

    return animeList;
}

export const animeActions = {
    add: async (anime: Omit<UserAnime, 'id' | 'updated_at'>) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        return await supabase
            .from('anime')
            .insert({ ...anime, user_id: user.id });
    },
    update: async (id: number, anime: Partial<UserAnime>) => {
        return await supabase
            .from('anime')
            .update({ ...anime, updated_at: new Date().toISOString() })
            .eq('id', id);
    },
    delete: async (id: number) => {
        return await supabase
            .from('anime')
            .delete()
            .eq('id', id);
    },
    incrementProgress: async (anime: UserAnime) => {
        if (anime.id && anime.episodio_corrente < anime.episodi_totali) {
            const nextEp = anime.episodio_corrente + 1;
            let nextStato = anime.stato;

            if (nextEp === anime.episodi_totali) {
                nextStato = 'COMPLETED';
            } else if (nextEp > 0 && anime.stato === 'PLANNING') {
                nextStato = 'WATCHING';
            }

            return await supabase
                .from('anime')
                .update({
                    episodio_corrente: nextEp,
                    stato: nextStato,
                    updated_at: new Date().toISOString()
                })
                .eq('id', anime.id);
        }
    }
};
