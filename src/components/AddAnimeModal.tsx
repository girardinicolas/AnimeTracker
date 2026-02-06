import React, { useState, useEffect, useRef } from 'react';
import { type UserAnime } from '../db';
import { useAnime } from '../hooks/useAnime';
import { X, Trash2, Save, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { fetchAnimeLogo, searchAnime, type AnimeMetadata } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';

interface AddAnimeModalProps {
    isOpen: boolean;
    onClose: () => void;
    editAnime?: UserAnime | null;
    onSuccess?: () => void;
}

export const AddAnimeModal: React.FC<AddAnimeModalProps> = ({ isOpen, onClose, editAnime, onSuccess }) => {
    const { actions } = useAnime();
    const { t } = useLanguage();
    const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);
    const [suggestions, setSuggestions] = useState<AnimeMetadata[]>([]);
    const wasSelected = useRef(false);
    const [formData, setFormData] = useState<Omit<UserAnime, 'id' | 'updated_at'>>({
        titolo: '',
        immagine_url: '',
        episodi_totali: 12,
        episodio_corrente: 0,
        stagione: 1,
        stato: 'PLANNING',
        voto: 0,
    });

    useEffect(() => {
        if (editAnime) {
            setFormData({
                titolo: editAnime.titolo,
                immagine_url: editAnime.immagine_url,
                episodi_totali: editAnime.episodi_totali,
                episodio_corrente: editAnime.episodio_corrente,
                stagione: editAnime.stagione || 1,
                stato: editAnime.stato,
                voto: editAnime.voto || 0,
            });
        } else {
            setFormData({
                titolo: '',
                immagine_url: '',
                episodi_totali: 12,
                episodio_corrente: 0,
                stagione: 1,
                stato: 'PLANNING',
                voto: 0,
            });
        }
        setSuggestions([]);
    }, [editAnime, isOpen]);

    // Handle debounced search for suggestions
    useEffect(() => {
        if (editAnime) return; // Don't suggest when editing

        if (wasSelected.current) {
            wasSelected.current = false;
            return;
        }

        const timer = setTimeout(async () => {
            if (formData.titolo.trim().length >= 3) {
                const results = await searchAnime(formData.titolo);
                setSuggestions(results);
            } else {
                setSuggestions([]);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [formData.titolo, editAnime]);

    const handleSelectSuggestion = (anime: AnimeMetadata) => {
        wasSelected.current = true;
        setFormData(prev => ({
            ...prev,
            titolo: anime.titolo,
            immagine_url: anime.immagine_url,
            episodi_totali: anime.episodi_totali,
            voto: anime.voto,
        }));
        setSuggestions([]);
    };

    const handleMagicFetch = async () => {
        if (!formData.titolo) return;
        setIsLoadingMetadata(true);
        const metadata = await fetchAnimeLogo(formData.titolo);
        if (metadata) {
            handleSelectSuggestion(metadata);
        }
        setIsLoadingMetadata(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Final attempt to fetch if URL is still empty
        let currentData = { ...formData };
        if (!currentData.immagine_url) {
            const metadata = await fetchAnimeLogo(currentData.titolo);
            if (metadata) {
                currentData.immagine_url = metadata.immagine_url;
                currentData.voto = metadata.voto;
                if (currentData.episodi_totali === 12 || currentData.episodi_totali === 0) {
                    currentData.episodi_totali = metadata.episodi_totali;
                }
            }
        }

        // Automatic state calculation based on progress
        if (currentData.episodio_corrente === 0) {
            currentData.stato = 'PLANNING';
        } else if (currentData.episodio_corrente >= currentData.episodi_totali) {
            currentData.stato = 'COMPLETED';
            currentData.episodio_corrente = currentData.episodi_totali; // Cap at total
        } else {
            currentData.stato = 'WATCHING';
        }

        if (editAnime?.id) {
            await actions.update(editAnime.id, currentData);
        } else {
            await actions.add(currentData);
        }
        onSuccess?.();
        onClose();
    };

    const handleDelete = async () => {
        if (editAnime?.id && window.confirm(t('deleteConfirm'))) {
            await actions.delete(editAnime.id);
            onSuccess?.();
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
                    >
                        <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                            <div>
                                <h2 className="text-2xl font-black text-white">
                                    {editAnime ? t('editSeries') : t('newAnime')}
                                </h2>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
                                    {editAnime ? t('updateProgress') : t('addToCollection')}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-3 hover:bg-white/5 rounded-2xl text-slate-400 hover:text-white transition-all"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="space-y-2 relative">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Title</label>
                                <div className="relative group/input">
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-6 py-4 bg-slate-800/50 border border-white/5 rounded-2xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 outline-none transition-all font-medium"
                                        value={formData.titolo}
                                        onChange={(e) => setFormData({ ...formData, titolo: e.target.value })}
                                        placeholder="e.g. Neon Genesis Evangelion"
                                        autoComplete="off"
                                    />

                                    {/* Suggestions Dropdown */}
                                    <AnimatePresence>
                                        {suggestions.length > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                className="absolute left-0 right-0 top-full mt-2 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[110] backdrop-blur-xl"
                                            >
                                                <div className="p-1 space-y-1">
                                                    {suggestions.map((anime, idx) => (
                                                        <button
                                                            key={idx}
                                                            type="button"
                                                            onClick={() => handleSelectSuggestion(anime)}
                                                            className="w-full flex items-center gap-3 p-2 hover:bg-white/5 transition-all text-left group"
                                                        >
                                                            <img
                                                                src={anime.immagine_url}
                                                                alt={anime.titolo}
                                                                className="w-10 h-14 object-cover rounded-lg flex-shrink-0"
                                                            />
                                                            <div className="flex-grow">
                                                                <p className="text-sm font-bold text-white line-clamp-1 group-hover:text-rose-400">
                                                                    {anime.titolo}
                                                                </p>
                                                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-0.5">
                                                                    {anime.episodi_totali > 0 ? `${anime.episodi_totali} Eps` : 'Unknown Eps'} • MAL: {anime.voto > 0 ? anime.voto : 'N/A'}
                                                                </p>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            <div className="space-y-2 relative">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Poster URL</label>
                                <div className="relative group/input">
                                    <input
                                        type="url"
                                        className="w-full px-6 py-4 bg-slate-800/50 border border-white/5 rounded-2xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 outline-none transition-all font-medium pr-16"
                                        value={formData.immagine_url}
                                        onChange={(e) => setFormData({ ...formData, immagine_url: e.target.value })}
                                        placeholder="https://image-url.com/poster.jpg"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleMagicFetch}
                                        disabled={isLoadingMetadata || !formData.titolo}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-xl transition-all disabled:opacity-30 disabled:grayscale"
                                        title={t('syncMal')}
                                    >
                                        {isLoadingMetadata ? (
                                            <Loader2 size={20} className="animate-spin" />
                                        ) : (
                                            <Sparkles size={20} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="block h-4 text-xs font-black text-slate-500 uppercase tracking-widest ml-1 text-[10px] leading-none">{t('season')}</label>
                                    <input
                                        type="number"
                                        min="1"
                                        className="w-full px-4 py-4 bg-slate-800/50 border border-white/5 rounded-2xl text-white focus:ring-2 focus:ring-rose-500/50 outline-none transition-all font-bold text-center"
                                        value={formData.stagione}
                                        onChange={(e) => setFormData({ ...formData, stagione: parseInt(e.target.value) || 1 })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block h-4 text-xs font-black text-slate-500 uppercase tracking-widest ml-1 text-[10px] leading-none">{t('currentEp')}</label>
                                    <input
                                        type="number"
                                        min="0"
                                        className="w-full px-4 py-4 bg-slate-800/50 border border-white/5 rounded-2xl text-white focus:ring-2 focus:ring-rose-500/50 outline-none transition-all font-bold text-center"
                                        value={formData.episodio_corrente}
                                        onChange={(e) => setFormData({ ...formData, episodio_corrente: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block h-4 text-xs font-black text-slate-500 uppercase tracking-widest ml-1 text-[10px] leading-none">{t('totalEp')}</label>
                                    <input
                                        type="number"
                                        min="1"
                                        className="w-full px-4 py-4 bg-slate-800/50 border border-white/5 rounded-2xl text-white focus:ring-2 focus:ring-rose-500/50 outline-none transition-all font-bold text-center"
                                        value={formData.episodi_totali}
                                        onChange={(e) => setFormData({ ...formData, episodi_totali: parseInt(e.target.value) || 1 })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">{t('status')}</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {(['PLANNING', 'WATCHING', 'COMPLETED'] as const).map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, stato: s })}
                                            className={cn(
                                                "py-3 rounded-xl text-[10px] font-black uppercase tracking-tighter border transition-all",
                                                formData.stato === s
                                                    ? "bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-900/40"
                                                    : "bg-slate-800/50 border-white/5 text-slate-400 hover:text-white"
                                            )}
                                        >
                                            {s === 'PLANNING' ? t('planned') : s === 'WATCHING' ? t('watching') : t('history')}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-6 flex gap-4">
                                {editAnime && (
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        className="p-4 bg-slate-800 text-rose-500 hover:bg-rose-500 hover:text-white rounded-2xl border border-white/5 transition-all"
                                    >
                                        <Trash2 size={24} />
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    className="flex-1 py-4 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-2xl shadow-xl shadow-rose-900/40 transition-all active:scale-95 flex items-center justify-center gap-3"
                                >
                                    <Save size={20} strokeWidth={3} />
                                    <span>{editAnime ? t('saveChanges') : t('addToCollection')}</span>
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

