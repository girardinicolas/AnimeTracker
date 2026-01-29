import Dexie, { type Table } from 'dexie';

export interface UserAnime {
    id?: number;
    titolo: string;
    immagine_url: string;
    episodi_totali: number;
    episodio_corrente: number;
    stagione: number;
    stato: 'WATCHING' | 'PLANNING' | 'COMPLETED';
    voto: number;
    updated_at: Date;
}

export class AnimeDatabase extends Dexie {
    anime!: Table<UserAnime>;

    constructor() {
        super('AnimeTrackerDB');
        this.version(3).stores({
            anime: '++id, titolo, stato, voto, updated_at'
        });
    }
}

export const db = new AnimeDatabase();
