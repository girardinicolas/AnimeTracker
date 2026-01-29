import React, { useState, useRef } from 'react';
import { type UserAnime } from '../db';

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
            // We aim for the top (270 degrees in coordinate system usually, or 0 is right)
            // Actually, let's just pick one randomly to avoid complex math with rotation sync
            const winningIndex = Math.floor(Math.random() * items.length);
            onResult(items[winningIndex]);
        }, 3000);
    };

    if (items.length === 0) {
        return (
            <div className="text-center p-12 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <p className="text-slate-500 italic">Aggiungi degli anime alla lista "Da Vedere" per girare la ruota!</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-80 h-80 mb-12 group cursor-pointer" onClick={spin}>
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-10 w-8 h-8 bg-red-500 clip-path-triangle rotate-180"
                    style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />

                {/* Wheel container */}
                <div
                    ref={wheelRef}
                    className="w-full h-full rounded-full border-8 border-slate-800 shadow-2xl relative overflow-hidden transition-transform duration-[3000ms] cubic-bezier(0.15, 0, 0.15, 1)"
                    style={{ transform: `rotate(${rotation}deg)` }}
                >
                    {items.map((item, i) => {
                        const angle = (360 / items.length);
                        const rotate = i * angle;
                        const skew = angle - 90;

                        return (
                            <div
                                key={item.id}
                                className="absolute top-1/2 left-1/2 w-[200px] h-[200px] origin-top-left flex items-center justify-center"
                                style={{
                                    transform: `rotate(${rotate}deg) skewY(${skew}deg)`,
                                    backgroundColor: `hsl(${(i * 137.5) % 360}, 70%, 65%)`
                                }}
                            >
                                <span
                                    className="absolute left-12 top-12 font-bold text-white text-xs -rotate-45"
                                    style={{
                                        transform: `skewY(-${skew}deg) rotate(45deg)`,
                                        maxWidth: '80px',
                                        textAlign: 'center'
                                    }}
                                >
                                    {item.titolo}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Center button */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full border-4 border-slate-800 flex items-center justify-center shadow-lg z-20">
                    <div className="w-2 h-2 bg-slate-800 rounded-full" />
                </div>
            </div>

            <button
                onClick={spin}
                disabled={isSpinning}
                className="px-12 py-4 bg-slate-900 text-white rounded-2xl font-bold text-xl hover:bg-slate-800 transition-all shadow-xl disabled:opacity-50 active:scale-95"
            >
                {isSpinning ? 'Gira...' : 'GIRA LA RUOTA!'}
            </button>
        </div>
    );
};
