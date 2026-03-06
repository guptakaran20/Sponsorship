'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const data = await fetchApi('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password, rememberMe }),
            });

            const role = data?.data?.user?.role;
            if (role === 'CLUB') {
                router.push('/club/dashboard');
            } else if (role) {
                router.push('/company/dashboard');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center p-4 sm:p-8 relative">
            {/* Background decorations */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-0 md:left-1/4 w-64 md:w-96 h-64 md:h-96 bg-purple-600/20 rounded-full blur-[80px] md:blur-[100px]" />
                <div className="absolute bottom-1/4 right-0 md:right-1/4 w-64 md:w-96 h-64 md:h-96 bg-indigo-600/20 rounded-full blur-[80px] md:blur-[100px]" />
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-6 md:mb-8">
                    <div className="inline-flex items-center justify-center p-3 bg-white/5 rounded-2xl backdrop-blur-xl border border-white/10 mb-4 shadow-2xl">
                        <Sparkles className="w-8 h-8 text-indigo-400" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">Welcome Back</h1>
                    <p className="text-indigo-200 text-sm md:text-base">Sign in to SponsorGrid to continue</p>
                </div>

                <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-indigo-100 pl-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value.toLowerCase())}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center pl-1">
                                <label className="text-sm font-medium text-indigo-100">Password</label>
                                <Link href="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center pl-1">
                            <input
                                type="checkbox"
                                id="remember-me"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 rounded bg-white/5 border border-white/20 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0"
                            />
                            <label htmlFor="remember-me" className="ml-2 text-sm text-indigo-200 cursor-pointer">
                                Remember me
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25"
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                            {!isLoading && <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-indigo-200">
                        Don't have an account?{' '}
                        <Link href="/register" className="text-white hover:text-indigo-400 font-medium transition-colors">
                            Create one now
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
