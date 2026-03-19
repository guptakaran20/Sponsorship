'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { Briefcase, GraduationCap, ArrowRight, ShieldCheck } from 'lucide-react';

export default function SelectRolePage() {
    const router = useRouter();
    const [role, setRole] = useState<'CLUB' | 'COMPANY'>('CLUB');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleCompleteProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const data = await fetchApi('/auth/complete-profile', {
                method: 'POST',
                body: JSON.stringify({ role }),
            });

            const userRole = data?.data?.user?.role;
            if (userRole === 'CLUB') {
                router.push('/club/dashboard');
            } else if (userRole === 'COMPANY' || userRole === 'ADMIN') {
                router.push('/company/dashboard');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to complete profile');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center p-4 sm:p-8 relative">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 right-0 md:right-1/4 w-64 md:w-96 h-64 md:h-96 bg-purple-600/20 rounded-full blur-[80px] md:blur-[100px]" />
                <div className="absolute bottom-1/4 left-0 md:left-1/4 w-64 md:w-96 h-64 md:h-96 bg-indigo-600/20 rounded-full blur-[80px] md:blur-[100px]" />
            </div>

            <div className="w-full max-w-md relative z-10 py-6 md:py-8">
                <div className="text-center mb-6 md:mb-8">
                    <div className="inline-flex items-center justify-center p-3 bg-white/5 rounded-2xl backdrop-blur-xl border border-white/10 mb-4 shadow-2xl">
                        <ShieldCheck className="w-8 h-8 text-indigo-400" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">Complete Profile</h1>
                    <p className="text-indigo-200 text-sm md:text-base">How would you like to use SponsorGrid?</p>
                </div>

                <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl">
                    <form onSubmit={handleCompleteProfile} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setRole('CLUB')}
                                className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-2 border transition-all h-32 ${role === 'CLUB'
                                    ? 'bg-indigo-500/20 border-indigo-400 text-white shadow-lg shadow-indigo-500/20'
                                    : 'bg-white/5 border-white/10 text-indigo-200 hover:bg-white/10'
                                    }`}
                            >
                                <GraduationCap className={`w-8 h-8 ${role === 'CLUB' ? 'text-indigo-400' : 'text-indigo-400/50'}`} />
                                <span className="text-sm font-medium mt-1">College Club</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setRole('COMPANY')}
                                className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-2 border transition-all h-32 ${role === 'COMPANY'
                                    ? 'bg-indigo-500/20 border-indigo-400 text-white shadow-lg shadow-indigo-500/20'
                                    : 'bg-white/5 border-white/10 text-indigo-200 hover:bg-white/10'
                                    }`}
                            >
                                <Briefcase className={`w-8 h-8 ${role === 'COMPANY' ? 'text-indigo-400' : 'text-indigo-400/50'}`} />
                                <span className="text-sm font-medium mt-1">Company</span>
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25 mt-6"
                        >
                            {isLoading ? 'Completing Profile...' : 'Continue'}
                            {!isLoading && <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
