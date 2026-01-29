import React, { useState, useRef, useEffect } from 'react';
import { type UserAnime } from '../db';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { ChevronDown } from 'lucide-react';

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
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const tabs: { id: UserAnime['stato']; label: string }[] = [
        { id: 'WATCHING', label: t('watching') },
        { id: 'PLANNING', label: t('planned') },
        { id: 'COMPLETED', label: t('history') },
    ];

    const sortOptions: { id: typeof sortBy, label: string }[] = [
        { id: 'recent', label: t('recent') },
        { id: 'oldest', label: t('oldest') },
        { id: 'title', label: t('title') },
    ];

    const currentSortLabel = sortOptions.find(opt => opt.id === sortBy)?.label;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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

            <div className="relative" ref={dropdownRef}>
                <div className="flex items-center gap-4 bg-slate-900/50 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-500 ml-4 font-outfit">{t('sortBy')}</span>

                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2 bg-slate-800/50 hover:bg-slate-800 text-white font-bold text-sm px-4 py-2 rounded-xl transition-all border border-white/5"
                    >
                        {currentSortLabel}
                        <ChevronDown
                            size={16}
                            className={cn("transition-transform duration-300", isDropdownOpen && "rotate-180")}
                        />
                    </button>
                </div>

                <AnimatePresence>
                    {isDropdownOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-2 w-48 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 backdrop-blur-xl"
                        >
                            <div className="p-1.5 space-y-1">
                                {sortOptions.map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => {
                                            setSortBy(option.id);
                                            setIsDropdownOpen(false);
                                        }}
                                        className={cn(
                                            "w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-between",
                                            sortBy === option.id
                                                ? "bg-rose-600 text-white"
                                                : "text-slate-400 hover:bg-white/5 hover:text-white"
                                        )}
                                    >
                                        {option.label}
                                        {sortBy === option.id && (
                                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

