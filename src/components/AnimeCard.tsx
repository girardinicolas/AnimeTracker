import React from 'react';
import { type UserAnime } from '../db';
import { animeActions } from '../hooks/useAnime';
import { Plus, Edit2, Play, CheckCircle, Clock, Star } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

interface AnimeCardProps {
    anime: UserAnime;
    onEdit: (anime: UserAnime) => void;
}

export const AnimeCard: React.FC<AnimeCardProps> = ({ anime, onEdit }) => {
    const progress = Math.round((anime.episodio_corrente / anime.episodi_totali) * 100);

    const statusColors = {
        WATCHING: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
        PLANNING: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        COMPLETED: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    };

    const statusIcons = {
        WATCHING: <Play size={14} className="mr-1.5 fill-current" />,
        PLANNING: <Clock size={14} className="mr-1.5" />,
        COMPLETED: <CheckCircle size={14} className="mr-1.5" />,
    };

    const statusLabels = {
        WATCHING: 'Watching',
        PLANNING: 'Planned',
        COMPLETED: 'Finished',
    };

    return (
        <motion.div
            whileHover={{ y: -8 }}
            className="group relative bg-slate-900/40 rounded-[2rem] border border-white/[0.05] overflow-hidden backdrop-blur-md shadow-2xl transition-all duration-500 hover:shadow-rose-900/10 hover:border-white/[0.1]"
        >
            {/* Image Section */}
            <div className="relative aspect-[3/4] overflow-hidden cursor-pointer" onClick={() => onEdit(anime)}>
                <img
                    src={anime.immagine_url || 'https://via.placeholder.com/300x450?text=No+Poster'}
                    alt={anime.titolo}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-500" />

                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                    <span className={cn(
                        "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center backdrop-blur-md shadow-lg",
                        statusColors[anime.stato]
                    )}>
                        {statusIcons[anime.stato]}
                        {statusLabels[anime.stato]}
                    </span>
                </div>

                {/* Rating Badge (Simulated or from DB if available) */}
                <div className="absolute top-4 right-4 bg-slate-950/60 backdrop-blur-md border border-white/10 px-2 py-1.5 rounded-xl flex items-center gap-1">
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                    <span className="text-[10px] font-bold text-white">4.8</span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
                <h3 className="font-bold text-xl leading-tight mb-4 text-white line-clamp-1 group-hover:text-rose-400 transition-colors duration-300">
                    {anime.titolo}
                </h3>

                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Progress <span className="text-white ml-2">{anime.episodio_corrente} / {anime.episodi_totali}</span>
                        </div>
                        <span className="text-xs font-black text-rose-500">{progress}%</span>
                    </div>

                    <div className="relative h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={cn(
                                "absolute inset-y-0 left-0 rounded-full",
                                anime.stato === 'COMPLETED' ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]' : 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                            )}
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                animeActions.incrementProgress(anime);
                            }}
                            disabled={anime.episodio_corrente >= anime.episodi_totali}
                            className="flex-[2] bg-rose-600 hover:bg-rose-500 disabled:opacity-20 disabled:grayscale text-white py-3 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all active:scale-95 shadow-xl shadow-rose-900/20"
                        >
                            <Plus size={18} strokeWidth={3} />
                            <span>Episodio</span>
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(anime);
                            }}
                            className="flex-1 bg-white/5 hover:bg-white/10 text-white p-3 rounded-2xl border border-white/5 transition-all active:scale-95 flex items-center justify-center"
                        >
                            <Edit2 size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

