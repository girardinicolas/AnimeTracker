export interface UserAnime {
    id?: number;
    user_id?: string;
    titolo: string;
    immagine_url: string;
    episodi_totali: number;
    episodio_corrente: number;
    stagione: number;
    stato: 'WATCHING' | 'PLANNING' | 'COMPLETED';
    voto: number;
    updated_at: string | Date; // Supabase uses ISO strings
}
