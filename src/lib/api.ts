export interface AnimeMetadata {
    titolo: string;
    immagine_url: string;
    episodi_totali: number;
}

export async function fetchAnimeLogo(title: string): Promise<AnimeMetadata | null> {
    if (!title || title.length < 2) return null;

    try {
        const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(title)}&limit=1`);
        const result = await response.json();

        if (result.data && result.data.length > 0) {
            const anime = result.data[0];
            return {
                titolo: anime.title,
                immagine_url: anime.images.webp.large_image_url || anime.images.jpg.large_image_url,
                episodi_totali: anime.episodes || 0,
            };
        }
    } catch (error) {
        console.error("Error fetching anime metadata:", error);
    }

    return null;
}
