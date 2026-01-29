import React, { useState } from 'react';
import { useAnime } from '../hooks/useAnime';
import { AnimeCard } from '../components/AnimeCard';
import { AnimeFilters } from '../components/AnimeFilters';
import { AddAnimeModal } from '../components/AddAnimeModal';
import { type UserAnime } from '../db';
import { Plus, LayoutGrid, Shuffle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

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
        <div className="max-w-7xl mx-auto px-6 py-12">
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
            >
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-rose-500 font-bold tracking-wider uppercase text-sm">
                        <Sparkles size={16} />
                        <span>Your personal collection</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight">
                        Anime<span className="text-rose-500">Tracker</span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-md font-medium">
                        Tieni traccia delle tue serie preferite con uno stile mozzafiato.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <Link
                        to="/random"
                        className="group flex items-center gap-3 px-6 py-4 bg-slate-800/50 text-white font-bold rounded-2xl border border-slate-700/50 hover:bg-slate-700 transition-all shadow-xl backdrop-blur-sm"
                    >
                        <Shuffle size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                        <span>Randomizer</span>
                    </Link>
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-3 px-8 py-4 bg-rose-600 text-white font-bold rounded-2xl hover:bg-rose-500 transition-all shadow-lg shadow-rose-900/20 active:scale-95 hover:scale-[1.02]"
                    >
                        <Plus size={22} strokeWidth={3} />
                        <span>Aggiungi Anime</span>
                    </button>
                </div>
            </motion.header>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <AnimeFilters
                    currentTab={currentTab}
                    setCurrentTab={setCurrentTab}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                />
            </motion.div>

            <AnimatePresence mode="popLayout">
                {animeList && animeList.length > 0 ? (
                    <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                    >
                        {animeList.map((anime, index) => (
                            <motion.div
                                key={anime.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                transition={{
                                    delay: Math.min(index * 0.05, 0.4),
                                    duration: 0.4,
                                    type: "spring",
                                    stiffness: 100
                                }}
                            >
                                <AnimeCard anime={anime} onEdit={handleEdit} />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-32 text-center glass rounded-[2rem]"
                    >
                        <div className="bg-rose-500/10 p-6 rounded-full mb-6 border border-rose-500/20">
                            <LayoutGrid size={48} className="text-rose-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Nessun anime trovato</h3>
                        <p className="text-slate-400 max-w-xs">Inizia a riempire la tua lista aggiungendo il tuo primo anime!</p>
                        <button
                            onClick={handleAdd}
                            className="mt-8 px-6 py-3 bg-white text-slate-950 font-bold rounded-xl hover:bg-slate-100 transition-all active:scale-95"
                        >
                            Inizia ora
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <AddAnimeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                editAnime={editingAnime}
            />
        </div>
    );
};

export default Home;
