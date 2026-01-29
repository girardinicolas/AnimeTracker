import React, { useState, useRef } from 'react';
import { type UserAnime } from '../db';
import { motion } from 'framer-motion';

interface WheelSpinnerProps {
    items: UserAnime[];
    onResult: (anime: UserAnime) => void;
}

export const WheelSpinner: React.FC<WheelSpinnerProps> = ({ items, onResult }) => {
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const wheelRef = useRef<HTMLDivElement>(null);

    const spin = () => {
        if (isSpinning || items.length === 0) return;

        setIsSpinning(true);
        const extraSpins = 5 + Math.random() * 5;
        const newRotation = rotation + extraSpins * 360 + Math.random() * 360;
        setRotation(newRotation);

        setTimeout(() => {
            setIsSpinning(false);
            const winningIndex = Math.floor(Math.random() * items.length);
            onResult(items[winningIndex]);
        }, 3000);
    };

    if (items.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center p-12 bg-slate-900 border border-white/5 rounded-3xl"
            >
                <p className="text-slate-500 italic font-medium">Add some anime to your "To Watch" list to spin the wheel!</p>
            </motion.div>
        );
    }

    // Palette of passionate/dark colors
    const colors = [
        '#ef4444', // rose-500
        '#f59e0b', // amber-500
        '#6366f1', // indigo-500
        '#ec4899', // pink-500
        '#8b5cf6', // violet-500
        '#f97316', // orange-500
    ];

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-80 h-80 mb-16 group outline-none" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && spin()}>
                {/* Outer decorative ring */}
                <div className="absolute -inset-4 border border-white/5 rounded-full" />
                <div className="absolute -inset-1 border border-rose-500/20 rounded-full" />

                {/* Pointer (The "Pin") */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-30 drop-shadow-[0_0_15px_rgba(225,29,72,0.5)]">
                    <div className="w-8 h-10 bg-rose-600 clip-path-needle rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full mt-2" />
                    </div>
                </div>

                {/* Wheel container */}
                <div
                    ref={wheelRef}
                    className="w-full h-full rounded-full border-[10px] border-slate-900 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden transition-transform duration-[3000ms] cubic-bezier(0.15, 0, 0.15, 1) bg-slate-950"
                    style={{ transform: `rotate(${rotation}deg)` }}
                >
                    {items.map((item, i) => {
                        const angle = (360 / items.length);
                        const rotate = i * angle;
                        const skew = angle - 90;

                        return (
                            <div
                                key={item.id}
                                className="absolute top-1/2 left-1/2 w-[300px] h-[300px] origin-top-left flex items-center justify-center"
                                style={{
                                    transform: `rotate(${rotate}deg) skewY(${skew}deg)`,
                                    backgroundColor: colors[i % colors.length]
                                }}
                            >
                                <div
                                    className="absolute inset-0 opacity-40"
                                    style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.4), transparent)' }}
                                />
                                <span
                                    className="absolute left-14 top-14 font-black text-white text-[10px] -rotate-45 uppercase tracking-tighter"
                                    style={{
                                        transform: `skewY(-${skew}deg) rotate(45deg)`,
                                        maxWidth: '100px',
                                        textAlign: 'center',
                                        textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                                    }}
                                >
                                    {item.titolo}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Center cap */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-slate-900 rounded-full border-4 border-slate-800 flex items-center justify-center shadow-2xl z-20">
                    <div className="w-4 h-4 bg-rose-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(225,29,72,0.8)]" />
                </div>
            </div>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={spin}
                disabled={isSpinning}
                className="group relative px-14 py-5 bg-white text-slate-950 rounded-[2rem] font-black text-xl hover:bg-rose-50 transition-all shadow-2xl shadow-rose-900/10 disabled:opacity-50 disabled:grayscale overflow-hidden"
            >
                <span className="relative z-10">{isSpinning ? 'SPINNING...' : 'SPIN THE WHEEL'}</span>
                {/* Border glow on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-rose-500/20 to-amber-500/20" />
            </motion.button>
        </div>
    );
};

