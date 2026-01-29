export interface AnimeMetadata {
    titolo: string;
    immagine_url: string;
    episodi_totali: number;
    voto: number;
}

export async function searchAnime(query: string): Promise<AnimeMetadata[]> {
    if (!query || query.length < 3) return [];

    try {
        const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=5`);
        const result = await response.json();

        if (result.data) {
            return result.data.map((anime: any) => ({
                titolo: anime.title,
                immagine_url: anime.images.webp.large_image_url || anime.images.jpg.large_image_url,
                episodi_totali: anime.episodes || 0,
                voto: anime.score || 0,
            }));
        }
    } catch (error) {
        console.error("Error searching anime:", error);
    }

    return [];
}

export async function fetchAnimeLogo(title: string): Promise<AnimeMetadata | null> {
    const results = await searchAnime(title);
    return results.length > 0 ? results[0] : null;
}
