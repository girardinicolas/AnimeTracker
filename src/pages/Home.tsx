import React, { useState } from 'react';
import { useAnime } from '../hooks/useAnime';
import { AnimeCard } from '../components/AnimeCard';
import { AnimeFilters } from '../components/AnimeFilters';
import { AddAnimeModal } from '../components/AddAnimeModal';
import { type UserAnime } from '../db';
import { Plus, LayoutGrid, Shuffle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    const [currentTab, setCurrentTab] = useState<UserAnime['stato']>('WATCHING');
    const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'title'>('recent');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAnime, setEditingAnime] = useState<UserAnime | null>(null);

    const animeList = useAnime(currentTab, sortBy);

    const handleEdit = (anime: UserAnime) => {
        setEditingAnime(anime);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingAnime(null);
        setIsModalOpen(true);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-2 bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                        Anime Tracker
                    </h1>
                    <p className="text-slate-500 font-medium">Tieni traccia del tuo progresso anime con facilità.</p>
                </div>

                <div className="flex gap-3">
                    <Link
                        to="/random"
                        className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <Shuffle size={20} />
                        Randomizer
                    </Link>
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                    >
                        <Plus size={20} />
                        Aggiungi
                    </button>
                </div>
            </header>

            <AnimeFilters
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
                sortBy={sortBy}
                setSortBy={setSortBy}
            />

            {animeList && animeList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {animeList.map(anime => (
                        <AnimeCard key={anime.id} anime={anime} onEdit={handleEdit} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center glass rounded-3xl border-2 border-dashed border-slate-200">
                    <div className="bg-slate-100 p-4 rounded-full mb-4">
                        <LayoutGrid size={48} className="text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700 mb-1">Nessun anime trovato</h3>
                    <p className="text-slate-400">Inizia aggiungendo un nuovo anime alla tua lista!</p>
                    <button
                        onClick={handleAdd}
                        className="mt-6 text-blue-600 font-bold hover:underline"
                    >
                        Aggiungi ora
                    </button>
                </div>
            )}

            <AddAnimeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                editAnime={editingAnime}
            />
        </div>
    );
};

export default Home;
