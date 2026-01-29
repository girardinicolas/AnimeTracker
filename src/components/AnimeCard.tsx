import React from 'react';
import { type UserAnime } from '../db';
import { animeActions } from '../hooks/useAnime';
import { Plus, Edit2, Play, CheckCircle, Clock } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface AnimeCardProps {
    anime: UserAnime;
    onEdit: (anime: UserAnime) => void;
}

export const AnimeCard: React.FC<AnimeCardProps> = ({ anime, onEdit }) => {
    const progress = Math.round((anime.episodio_corrente / anime.episodi_totali) * 100);

    const statusColors = {
        WATCHING: 'bg-amber-100 text-amber-700 border-amber-200',
        PLANNING: 'bg-blue-100 text-blue-700 border-blue-200',
        COMPLETED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    };

    const statusIcons = {
        WATCHING: <Play size={14} className="mr-1" />,
        PLANNING: <Clock size={14} className="mr-1" />,
        COMPLETED: <CheckCircle size={14} className="mr-1" />,
    };

    const statusLabels = {
        WATCHING: 'In Corso',
        PLANNING: 'Da Vedere',
        COMPLETED: 'Completato',
    };

    return (
        <div className="glass rounded-2xl overflow-hidden group hover:scale-[1.02] transition-all duration-300">
            <div className="relative h-48 overflow-hidden cursor-pointer" onClick={() => onEdit(anime)}>
                <img
                    src={anime.immagine_url || 'https://via.placeholder.com/300x450?text=No+Poster'}
                    alt={anime.titolo}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-2 right-2">
                    <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold border flex items-center shadow-sm backdrop-blur-sm",
                        statusColors[anime.stato]
                    )}>
                        {statusIcons[anime.stato]}
                        {statusLabels[anime.stato]}
                    </span>
                </div>
            </div>

            <div className="p-4">
                <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-1">{anime.titolo}</h3>

                <div className="flex justify-between items-center text-sm text-slate-500 mb-2">
                    <span>Ep. {anime.episodio_corrente} / {anime.episodi_totali}</span>
                    <span>{progress}%</span>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-2 mb-4 overflow-hidden">
                    <div
                        className={cn(
                            "h-full transition-all duration-500",
                            anime.stato === 'COMPLETED' ? 'bg-emerald-500' : 'bg-blue-500'
                        )}
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => animeActions.incrementProgress(anime)}
                        disabled={anime.episodio_corrente >= anime.episodi_totali}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white py-2 rounded-xl flex items-center justify-center gap-1 font-medium transition-colors shadow-lg shadow-emerald-200"
                    >
                        <Plus size={18} /> +1 Ep
                    </button>
                    <button
                        onClick={() => onEdit(anime)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-2 rounded-xl transition-colors"
                    >
                        <Edit2 size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};
