import React, { useState, useRef, useEffect } from 'react';
import { type UserAnime } from '../db';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

interface WheelSpinnerProps {
    items: UserAnime[];
    onResult: (anime: UserAnime) => void;
}

export const WheelSpinner: React.FC<WheelSpinnerProps> = ({ items, onResult }) => {
    const { t } = useLanguage();
    const [isSpinning, setIsSpinning] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [rotation, setRotation] = useState(0);

    // Palette of passionate/dark colors
    const colors = [
        '#e11d48', // rose-600
        '#d97706', // amber-600
        '#4f46e5', // indigo-600
        '#db2777', // pink-600
        '#7c3aed', // violet-600
        '#ea580c', // orange-600
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const size = 320; // Canvas dimensions
        const center = size / 2;
        const radius = size / 2 - 10; // Padding

        canvas.width = size;
        canvas.height = size;

        ctx.clearRect(0, 0, size, size);

        if (items.length === 0) return;

        const sliceAngle = (2 * Math.PI) / items.length;

        items.forEach((item, i) => {
            const startAngle = i * sliceAngle;
            const endAngle = startAngle + sliceAngle;

            // Draw Slice
            ctx.beginPath();
            ctx.moveTo(center, center);
            ctx.arc(center, center, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = colors[i % colors.length];
            ctx.fill();
            ctx.stroke();

            // Draw Text
            ctx.save();
            ctx.translate(center, center);
            ctx.rotate(startAngle + sliceAngle / 2);
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#ffffff';
            ctx.font = '900 14px "Inter", sans-serif';
            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = 4;
            ctx.fillText(item.titolo.substring(0, 18) + (item.titolo.length > 18 ? '...' : ''), radius - 20, 0);
            ctx.restore();
        });

    }, [items]);

    const spin = () => {
        if (isSpinning || items.length === 0) return;

        setIsSpinning(true);
        const extraSpins = 5 + Math.random() * 5; // 5 to 10 full spins
        const segmentAngle = 360 / items.length;

        // Random winning index
        const winningIndex = Math.floor(Math.random() * items.length);

        // Calculate rotation to land on the winner at the TOP (270 degrees / -90 degrees in Canvas land)
        // Canvas 0 is 3 o'clock. We want the winning slice to be at 12 o'clock.
        // Rotation needed = 270 - CenterAngleOfWinner
        // We add 360 * extraSpins for the effect.

        const winningCenterAngle = (winningIndex * segmentAngle) + (segmentAngle / 2);
        const targetRotation = 270 - winningCenterAngle;
        const finalAngle = (extraSpins * 360) + targetRotation;

        setRotation(finalAngle);

        setTimeout(() => {
            setIsSpinning(false);
            onResult(items[winningIndex]);
        }, 4000);
    };

    if (items.length === 0) {
        return (
            <div className="text-center p-12 bg-slate-900 border border-white/5 rounded-3xl">
                <p className="text-slate-500 italic font-medium">{t('addSomeAnime')}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-80 h-80 mb-16 group">
                {/* Pointer */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20 drop-shadow-xl filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)]">
                    <div className="w-8 h-12 bg-white clip-path-needle flex items-center justify-center transform translate-y-2">
                        <div className="w-2 h-2 bg-rose-600 rounded-full mb-4" />
                    </div>
                </div>

                {/* Spinning Canvas */}
                <div
                    className="w-full h-full rounded-full border-8 border-slate-800 shadow-[0_0_60px_rgba(0,0,0,0.6)] overflow-hidden transition-transform duration-[4000ms] cubic-bezier(0.15, 0.85, 0.35, 1)"
                    style={{ transform: `rotate(${rotation}deg)` }}
                >
                    <canvas ref={canvasRef} className="w-full h-full" />
                </div>
            </div>

            <button
                onClick={spin}
                disabled={isSpinning}
                className="px-12 py-4 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-2xl shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
            >
                {isSpinning ? t('spinning') : t('spinTheWheel')}
            </button>
        </div>
    );
};
