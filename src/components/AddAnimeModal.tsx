import React, { useState, useEffect } from 'react';
import { type UserAnime } from '../db';
import { animeActions } from '../hooks/useAnime';
import { X, Trash2 } from 'lucide-react';

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
        stato: 'PLANNING',
    });

    useEffect(() => {
        if (editAnime) {
            setFormData({
                titolo: editAnime.titolo,
                immagine_url: editAnime.immagine_url,
                episodi_totali: editAnime.episodi_totali,
                episodio_corrente: editAnime.episodio_corrente,
                stato: editAnime.stato,
            });
        } else {
            setFormData({
                titolo: '',
                immagine_url: '',
                episodi_totali: 12,
                episodio_corrente: 0,
                stato: 'PLANNING',
            });
        }
    }, [editAnime, isOpen]);

    if (!isOpen) return null;

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50">
                    <h2 className="text-xl font-bold text-slate-800">
                        {editAnime ? 'Modifica Anime' : 'Aggiungi Anime'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Titolo</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            value={formData.titolo}
                            onChange={(e) => setFormData({ ...formData, titolo: e.target.value })}
                            placeholder="es. One Piece"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">URL Immagine</label>
                        <input
                            type="url"
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            value={formData.immagine_url}
                            onChange={(e) => setFormData({ ...formData, immagine_url: e.target.value })}
                            placeholder="https://..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Ep. Corrente</label>
                            <input
                                type="number"
                                min="0"
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                value={formData.episodio_corrente}
                                onChange={(e) => setFormData({ ...formData, episodio_corrente: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Totale Episodi</label>
                            <input
                                type="number"
                                min="1"
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                value={formData.episodi_totali}
                                onChange={(e) => setFormData({ ...formData, episodi_totali: parseInt(e.target.value) || 1 })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Stato</label>
                        <select
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
                            value={formData.stato}
                            onChange={(e) => setFormData({ ...formData, stato: e.target.value as any })}
                        >
                            <option value="PLANNING">Da Vedere</option>
                            <option value="WATCHING">In Corso</option>
                            <option value="COMPLETED">Completato</option>
                        </select>
                    </div>

                    <div className="pt-4 flex gap-3">
                        {editAnime && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100"
                            >
                                <Trash2 size={24} />
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 px-4 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                        >
                            Annulla
                        </button>
                        <button
                            type="submit"
                            className="flex-[2] py-3 px-4 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
                        >
                            Salva
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
