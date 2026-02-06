import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { type UserAnime } from '../db';
import { useAuth } from '../context/AuthContext';

export function useAnime(stato?: UserAnime['stato'], sortBy: 'recent' | 'oldest' | 'title' = 'recent') {
    const { user } = useAuth();
    const [animeList, setAnimeList] = useState<UserAnime[]>([]);

    const fetchAnime = async () => {
        if (!user) return;
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

    useEffect(() => {
        fetchAnime();

        if (!user) return;

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

    const actions = {
        add: async (anime: Omit<UserAnime, 'id' | 'updated_at'>) => {
            if (!user) return { error: { message: "User not found" } };

            const { error } = await supabase
                .from('anime')
                .insert({ ...anime, user_id: user.id });

            if (error) console.error("Supabase Add Error:", error.message, error.details);
            else fetchAnime();
            return { error };
        },
        update: async (id: number, anime: Partial<UserAnime>) => {
            const { error } = await supabase
                .from('anime')
                .update({ ...anime, updated_at: new Date().toISOString() })
                .eq('id', id);

            if (error) console.error("Supabase Update Error:", error.message, error.details);
            else fetchAnime();
            return { error };
        },
        delete: async (id: number) => {
            const { error } = await supabase
                .from('anime')
                .delete()
                .eq('id', id);

            if (error) console.error("Supabase Delete Error:", error.message, error.details);
            else fetchAnime();
            return { error };
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

                const { error } = await supabase
                    .from('anime')
                    .update({
                        episodio_corrente: nextEp,
                        stato: nextStato,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', anime.id);

                if (error) console.error("Supabase Increment Error:", error.message, error.details);
                else fetchAnime();
                return { error };
            }
        }
    };

    return { animeList, actions };
}

