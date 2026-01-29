import { useLiveQuery } from 'dexie-react-hooks';
import { db, type UserAnime } from '../db';

export function useAnime(stato?: UserAnime['stato'], sortBy: 'recent' | 'oldest' | 'title' = 'recent') {
    return useLiveQuery(async () => {
        let collection = db.anime.toCollection();

        if (stato) {
            collection = db.anime.where('stato').equals(stato);
        }

        let results = await collection.toArray();

        // Sorting logic since we are already in JS and Dexie sorting can be complex for multis
        results.sort((a, b) => {
            if (sortBy === 'recent') return b.updated_at.getTime() - a.updated_at.getTime();
            if (sortBy === 'oldest') return a.updated_at.getTime() - b.updated_at.getTime();
            if (sortBy === 'title') return a.titolo.localeCompare(b.titolo);
            return 0;
        });

        return results;
    }, [stato, sortBy]);
}

export const animeActions = {
    add: async (anime: Omit<UserAnime, 'id' | 'updated_at'>) => {
        return await db.anime.add({ ...anime, updated_at: new Date() });
    },
    update: async (id: number, anime: Partial<UserAnime>) => {
        return await db.anime.update(id, { ...anime, updated_at: new Date() });
    },
    delete: async (id: number) => {
        return await db.anime.delete(id);
    },
    incrementProgress: async (anime: UserAnime) => {
        if (anime.id && anime.episodio_corrente < anime.episodi_totali) {
            return await db.anime.update(anime.id, {
                episodio_corrente: anime.episodio_corrente + 1,
                updated_at: new Date()
            });
        }
    }
};
