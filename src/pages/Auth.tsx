import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, Mail, Lock, Loader2 } from 'lucide-react';

const Auth: React.FC = () => {
    const { t } = useLanguage();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                // Supabase might require email confirmation, but for now we'll just show a message
                alert("Check your email for confirmation!");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-600/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl p-8 backdrop-blur-xl relative z-10"
            >
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-rose-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(225,29,72,0.4)] mb-6">
                        <img src="logo.png" alt="AT" className="w-10 h-10 invert brightness-0" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight">AnimeTracker</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">
                        {isLogin ? t('login') : t('register')}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{t('email')}</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-6 py-4 bg-slate-800/50 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-rose-500/50 transition-all font-medium"
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{t('password')}</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-6 py-4 bg-slate-800/50 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-rose-500/50 transition-all font-medium"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {error && (
                        <p className="text-rose-500 text-xs font-bold text-center mt-2 bg-rose-500/10 py-2 rounded-lg border border-rose-500/20">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-2xl shadow-xl shadow-rose-900/40 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : isLogin ? (
                            <LogIn size={20} />
                        ) : (
                            <UserPlus size={20} />
                        )}
                        <span>{isLogin ? t('login') : t('register')}</span>
                    </button>
                </form>

                <div className="mt-8 text-center px-4">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-slate-400 hover:text-white text-sm font-bold transition-all"
                    >
                        {isLogin ? t('noAccount') : t('haveAccount')}
                    </button>

                    <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-center gap-4 grayscale opacity-30">
                        <img src="logo.png" className="h-4" alt="logo" />
                        <span className="text-[10px] font-black tracking-widest uppercase">Anime Collection Cloud</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Auth;
