import React from 'react';
import { type UserAnime } from '../db';

interface AnimeFiltersProps {
    currentTab: UserAnime['stato'];
    setCurrentTab: (tab: UserAnime['stato']) => void;
    sortBy: 'recent' | 'oldest' | 'title';
    setSortBy: (sort: 'recent' | 'oldest' | 'title') => void;
}

export const AnimeFilters: React.FC<AnimeFiltersProps> = ({
    currentTab,
    setCurrentTab,
    sortBy,
    setSortBy
}) => {
    const tabs: { id: UserAnime['stato'], label: string }[] = [
        { id: 'WATCHING', label: 'In Corso' },
        { id: 'PLANNING', label: 'Da Vedere' },
        { id: 'COMPLETED', label: 'Completati' },
    ];

    return (
        <div className="space-y-4 mb-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex bg-slate-200/50 p-1 rounded-2xl backdrop-blur-sm self-start">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setCurrentTab(tab.id)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${currentTab === tab.id
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ordina:</span>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="bg-transparent text-sm font-semibold text-slate-600 outline-none cursor-pointer hover:text-blue-600 transition-colors"
                    >
                        <option value="recent">Più recenti</option>
                        <option value="oldest">Meno recenti</option>
                        <option value="title">Titolo A-Z</option>
                    </select>
                </div>
            </div>
        </div>
    );
};
