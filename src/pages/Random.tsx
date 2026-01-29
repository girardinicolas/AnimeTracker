import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useAnime } from '../hooks/useAnime';
import { WheelSpinner } from '../components/WheelSpinner';
import { type UserAnime } from '../db';

const Random: React.FC = () => {
    const planningAnime = useAnime('PLANNING');
    const [winner, setWinner] = useState<UserAnime | null>(null);

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 min-h-screen flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-12">
                <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-semibold">
                    <ArrowLeft size={20} />
                    Torna alla Home
                </Link>
                <div className="flex items-center gap-2 bg-amber-50 text-amber-600 px-4 py-2 rounded-full font-bold border border-amber-100 shadow-sm">
                    <Sparkles size={18} />
                    Lucky Spin
                </div>
            </div>

            <div className="text-center mb-12">
                <h1 className="text-4xl font-black text-slate-900 mb-4">Cosa guardiamo stasera?</h1>
                <p className="text-slate-500 max-w-md mx-auto">
                    Gira la ruota e lascia che il destino scelga il prossimo anime dalla tua lista <strong>"Da Vedere"</strong>.
                </p>
            </div>

            <div className="w-full max-w-md flex flex-col items-center">
                <WheelSpinner items={planningAnime || []} onResult={setWinner} />

                {winner && !planningAnime?.find(a => a.id === winner.id && false) /* dummy to trigger refresh if needed */ && (
                    <div className="mt-12 p-8 bg-blue-600 text-white rounded-3xl shadow-2xl shadow-blue-300 w-full animate-in zoom-in-90 duration-300 text-center">
                        <span className="text-blue-200 font-bold uppercase tracking-widest text-xs mb-2 block">IL VINCITORE È...</span>
                        <h2 className="text-3xl font-black mb-4">{winner.titolo}</h2>
                        <Link
                            to="/"
                            className="inline-block px-8 py-3 bg-white text-blue-600 font-bold rounded-2xl hover:bg-blue-50 transition-all shadow-lg"
                        >
                            Inizia a guardare!
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Random;
