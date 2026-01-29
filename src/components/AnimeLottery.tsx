import React, { useState, useEffect, useRef } from 'react';
import { type UserAnime } from '../db';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, Zap } from 'lucide-react';

interface AnimeLotteryProps {
    items: UserAnime[];
    onResult: (anime: UserAnime) => void;
}

export const AnimeLottery: React.FC<AnimeLotteryProps> = ({ items, onResult }) => {
    const { t } = useLanguage();
    const [isSpinning, setIsSpinning] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [shuffling, setShuffling] = useState(false);

    // Using a ref to track the animation loop without causing re-renders for every frame
    const animationRef = useRef<number>(0);
    const speedRef = useRef<number>(50); // Initial speed (ms)
    const startTimeRef = useRef<number>(0);

    useEffect(() => {
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, []);

    const startLottery = () => {
        if (isSpinning || items.length === 0) return;

        setIsSpinning(true);
        setShuffling(true);
        startTimeRef.current = Date.now();
        speedRef.current = 50; // Start fast

        const animate = () => {
            const elapsed = Date.now() - startTimeRef.current;

            // Logic to slow down over time
            if (elapsed > 2000) {
                speedRef.current += 5; // Slow down
            }
            if (elapsed > 4000) {
                speedRef.current += 20; // Slow down more
            }

            // Stop condition
            if (elapsed > 5000 && speedRef.current > 300) {
                // Pick a random winner that isn't the current one to ensure movement
                const finalIndex = Math.floor(Math.random() * items.length);
                setCurrentIndex(finalIndex);
                setShuffling(false);
                setIsSpinning(false);
                onResult(items[finalIndex]);
                return;
            }

            // Move to next item
            setCurrentIndex(prev => (prev + 1) % items.length);

            // Loop with variable speed timeout simulation using requestAnimationFrame
            setTimeout(() => {
                animationRef.current = requestAnimationFrame(animate);
            }, speedRef.current);
        };

        animationRef.current = requestAnimationFrame(animate);
    };

    if (items.length === 0) {
        return (
            <div className="text-center p-12 bg-slate-900 border border-white/5 rounded-3xl">
                <p className="text-slate-500 italic font-medium">{t('addSomeAnime')}</p>
            </div>
        );
    }

    const currentItem = items[currentIndex];

    return (
        <div className="flex flex-col items-center gap-12">
            {/* Display Area */}
            <div className="relative w-72 h-[28rem] perspective-1000">
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={shuffling ? `shuffle-${currentIndex}` : `winner-${currentItem.id}`}
                        initial={{ opacity: 0, y: 50, scale: 0.8, rotateX: -20 }}
                        animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                        exit={{ opacity: 0, y: -50, scale: 0.8, rotateX: 20 }}
                        transition={{ duration: shuffling ? 0.1 : 0.5 }}
                        className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-2xl border-4 border-slate-900 bg-slate-900"
                    >
                        <img
                            src={currentItem.immagine_url}
                            alt={currentItem.titolo}
                            className="w-full h-full object-cover filter brightness-75"
                        />
                        <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent">
                            <h3 className="text-white font-black text-xl leading-tight line-clamp-2 drop-shadow-lg">
                                {currentItem.titolo}
                            </h3>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs font-bold text-rose-500 uppercase tracking-widest bg-rose-500/10 px-2 py-1 rounded-lg border border-rose-500/20">
                                    {currentItem.episodi_totali > 0 ? `${currentItem.episodi_totali} Eps` : 'TV Series'}
                                </span>
                            </div>
                        </div>

                        {/* Overlay flash effect */}
                        {shuffling && (
                            <div className="absolute inset-0 bg-white/10 mix-blend-overlay" />
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Decorative Elements */}
                <div className="absolute -inset-4 bg-gradient-to-b from-rose-500/20 to-transparent blur-2xl -z-10 rounded-[3rem]" />
            </div>

            {/* Controls */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startLottery}
                disabled={isSpinning}
                className="group relative px-12 py-5 bg-white text-slate-950 rounded-2xl font-black text-xl hover:bg-rose-50 transition-all shadow-2xl shadow-rose-900/10 disabled:opacity-50 disabled:grayscale overflow-hidden flex items-center gap-3"
            >
                <Zap size={24} className={isSpinning ? 'animate-pulse text-rose-500' : 'text-slate-400'} />
                <span className="relative z-10">{isSpinning ? t('drawing') : t('startExtraction')}</span>
            </motion.button>
        </div>
    );
};
