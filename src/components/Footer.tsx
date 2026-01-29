import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
    const { t } = useLanguage();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-auto py-12 px-6 border-t border-white/5 bg-slate-950/20 backdrop-blur-md">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-slate-500 text-sm font-medium">
                <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-bold">AnimeTracker</span>
                    <span className="opacity-30">|</span>
                    <span>&copy; {currentYear} {t('allRightsReserved')}</span>
                </div>

                <div className="flex items-center gap-2 group">
                    <span>{t('developedBy')}</span>
                    <span className="text-white font-bold tracking-tight hover:text-rose-500 transition-colors cursor-default">TE</span>
                    <Heart size={14} className="text-rose-500 fill-rose-500 animate-pulse" />
                </div>
            </div>
        </footer>
    );
};
