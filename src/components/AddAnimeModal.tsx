import React, { useState, useEffect } from 'react';
import { type UserAnime } from '../db';
import { animeActions } from '../hooks/useAnime';
import { X, Trash2, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

interface AddAnimeModalProps {
    isOpen: boolean;
    onClose: () => void;
    editAnime?: UserAnime | null;
}

export const AddAnimeModal: React.FC<AddAnimeModalProps> = ({ isOpen, onClose, editAnime }) => {
    const [formData, setFormData] = useState<Omit<UserAnime, 'id' | 'updated_at'>>({
        titolo: '',
        immagine_url: '',
        episodi_totali: 12,
        episodio_corrente: 0,
        stagione: 1,
        stato: 'PLANNING',
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
            });
        } else {
            setFormData({
                titolo: '',
                immagine_url: '',
                episodi_totali: 12,
                episodio_corrente: 0,
                stagione: 1,
                stato: 'PLANNING',
            });
        }
    }, [editAnime, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editAnime?.id) {
            await animeActions.update(editAnime.id, formData);
        } else {
            await animeActions.add(formData);
        }
        onClose();
    };

    const handleDelete = async () => {
        if (editAnime?.id && window.confirm('Sei sicuro di voler eliminare questo anime?')) {
            await animeActions.delete(editAnime.id);
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
                                    {editAnime ? 'Edit Series' : 'New Anime'}
                                </h2>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
                                    {editAnime ? 'Update your progress' : 'Add to your collection'}
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
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-6 py-4 bg-slate-800/50 border border-white/5 rounded-2xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 outline-none transition-all font-medium"
                                    value={formData.titolo}
                                    onChange={(e) => setFormData({ ...formData, titolo: e.target.value })}
                                    placeholder="e.g. Neon Genesis Evangelion"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Poster URL</label>
                                <input
                                    type="url"
                                    className="w-full px-6 py-4 bg-slate-800/50 border border-white/5 rounded-2xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 outline-none transition-all font-medium"
                                    value={formData.immagine_url}
                                    onChange={(e) => setFormData({ ...formData, immagine_url: e.target.value })}
                                    placeholder="https://image-url.com/poster.jpg"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1 text-[10px]">Season</label>
                                    <input
                                        type="number"
                                        min="1"
                                        className="w-full px-4 py-4 bg-slate-800/50 border border-white/5 rounded-2xl text-white focus:ring-2 focus:ring-rose-500/50 outline-none transition-all font-bold text-center"
                                        value={formData.stagione}
                                        onChange={(e) => setFormData({ ...formData, stagione: parseInt(e.target.value) || 1 })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1 text-[10px]">Current Ep</label>
                                    <input
                                        type="number"
                                        min="0"
                                        className="w-full px-4 py-4 bg-slate-800/50 border border-white/5 rounded-2xl text-white focus:ring-2 focus:ring-rose-500/50 outline-none transition-all font-bold text-center"
                                        value={formData.episodio_corrente}
                                        onChange={(e) => setFormData({ ...formData, episodio_corrente: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1 text-[10px]">Total Ep</label>
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
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Status</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {(['PLANNING', 'WATCHING', 'COMPLETED'] as const).map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, stato: s })}
                                            className={cn(
                                                "py-3 rounded-xl text-[10px] font-black uppercase tracking-tighter border transition-all",
                                                formData.stato === s
                                                    ? "bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-900/20"
                                                    : "bg-slate-800/50 border-white/5 text-slate-400 hover:text-white"
                                            )}
                                        >
                                            {s === 'PLANNING' ? 'Planned' : s === 'WATCHING' ? 'Watching' : 'Finished'}
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
                                    className="flex-1 py-4 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-2xl shadow-xl shadow-rose-900/20 transition-all active:scale-95 flex items-center justify-center gap-3"
                                >
                                    <Save size={20} strokeWidth={3} />
                                    <span>{editAnime ? 'Save Changes' : 'Add to Collection'}</span>
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

