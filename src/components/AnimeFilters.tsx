import React from 'react';
import { type UserAnime } from '../db';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

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
    setSortBy,
}) => {
    const { t } = useLanguage();
    const tabs: { id: UserAnime['stato']; label: string }[] = [
        { id: 'WATCHING', label: t('watching') },
        { id: 'PLANNING', label: t('planned') },
        { id: 'COMPLETED', label: t('history') },
    ];

    return (
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
            <div className="flex p-1.5 bg-slate-900 border border-white/5 rounded-2xl shadow-inner backdrop-blur-sm">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setCurrentTab(tab.id)}
                        className={cn(
                            "relative px-8 py-3 text-sm font-bold transition-all duration-300 rounded-xl",
                            currentTab === tab.id
                                ? "text-white shadow-xl"
                                : "text-slate-500 hover:text-slate-300"
                        )}
                    >
                        {currentTab === tab.id && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-rose-600 rounded-xl -z-10 shadow-[0_0_20px_rgba(225,29,72,0.3)]"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="flex items-center gap-4 bg-slate-900/50 p-1.5 rounded-2xl border border-white/5">
                <span className="text-xs font-black uppercase tracking-widest text-slate-500 ml-4 font-outfit">{t('sortBy')}</span>
                <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as any)}
                    className="bg-transparent text-white font-bold text-sm px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50 cursor-pointer"
                >
                    <option value="recent">{t('recent')}</option>
                    <option value="oldest">{t('oldest')}</option>
                    <option value="title">{t('title')}</option>
                </select>
            </div>
        </div>
    );
};

