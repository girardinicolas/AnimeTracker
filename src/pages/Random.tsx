import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Trophy } from 'lucide-react';
import { useAnime } from '../hooks/useAnime';
import { WheelSpinner } from '../components/WheelSpinner';
import { type UserAnime } from '../db';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const Random: React.FC = () => {
    const { t } = useLanguage();
    const planningAnime = useAnime('PLANNING');
    const [winner, setWinner] = useState<UserAnime | null>(null);

    return (
        <div className="max-w-4xl mx-auto px-6 py-12 min-h-screen flex flex-col items-center">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full flex items-center justify-between mb-16"
            >
                <Link to="/" className="group flex items-center gap-2 text-slate-400 hover:text-white transition-all font-bold uppercase tracking-widest text-xs">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span>{t('backHome')}</span>
                </Link>
                <div className="flex items-center gap-2 bg-rose-500/10 text-rose-500 px-6 py-2.5 rounded-full font-black border border-rose-500/20 shadow-[0_0_20px_rgba(225,29,72,0.1)] text-xs uppercase tracking-widest">
                    <Sparkles size={16} />
                    {t('luckySpin')}
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center mb-16 space-y-4"
            >
                <h1 className="text-5xl md:text-6xl font-black text-white leading-tight">
                    {t('whatToWatch').split('?')[0]} <span className="text-rose-500">?</span>
                </h1>
                <p className="text-slate-400 max-w-md mx-auto text-lg font-medium">
                    {t('spinDescription')}
                </p>
            </motion.div>

            <div className="w-full max-w-md flex flex-col items-center">
                <WheelSpinner items={planningAnime || []} onResult={setWinner} />

                <AnimatePresence>
                    {winner && (
                        <motion.div
                            initial={{ opacity: 0, y: 40, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="mt-16 p-1 bg-gradient-to-br from-rose-500 to-amber-500 rounded-[2.5rem] shadow-[0_20px_50px_rgba(225,29,72,0.3)] w-full"
                        >
                            <div className="bg-slate-900 rounded-[2.4rem] p-10 text-center relative overflow-hidden">
                                {/* Subtle background glow */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-rose-500/20 blur-[80px] pointer-events-none" />

                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-500/10 text-rose-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-rose-500/20 mb-6">
                                    <Trophy size={14} />
                                    {t('winner')}
                                </div>
                                <h2 className="text-4xl font-black text-white mb-8 leading-tight">{winner.titolo}</h2>
                                <Link
                                    to="/"
                                    className="inline-flex px-10 py-4 bg-rose-600 text-white font-black rounded-2xl hover:bg-rose-500 transition-all shadow-xl shadow-rose-900/40 active:scale-95 text-lg"
                                >
                                    {t('startWatching')}
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Random;

