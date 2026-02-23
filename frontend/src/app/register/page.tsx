'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi, setAuthToken } from '@/lib/api';
import { Mail, Lock, User, Briefcase, GraduationCap, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'CLUB',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const data = await fetchApi('/auth/register', {
                method: 'POST',
                body: JSON.stringify(formData),
            });

            if (data?.token) {
                setAuthToken(data.token);
                // Redirect based on role
                if (data.user?.role === 'CLUB') {
                    router.push('/club/dashboard');
                } else {
                    router.push('/company/dashboard');
                }
            }
        } catch (err: any) {
            setError(err.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
            {/* Background decorations */}
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]" />

            <div className="w-full max-w-md relative z-10 py-8">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-3 bg-white/5 rounded-2xl backdrop-blur-xl border border-white/10 mb-4 shadow-2xl">
                        <ShieldCheck className="w-8 h-8 text-indigo-400" />
                    </div>
                    <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Join SponsorBridge</h1>
                    <p className="text-indigo-200">Create an account to connect and sponsor</p>
                </div>

                <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                    <form onSubmit={handleRegister} className="space-y-5">
                        {error && (
                            <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Role Selector */}
                        <div className="grid grid-cols-2 gap-4 pb-2">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'CLUB' })}
                                className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-2 border transition-all ${formData.role === 'CLUB'
                                        ? 'bg-indigo-500/20 border-indigo-400 text-white'
                                        : 'bg-white/5 border-white/10 text-indigo-200 hover:bg-white/10'
                                    }`}
                            >
                                <GraduationCap className={formData.role === 'CLUB' ? 'text-indigo-400' : 'text-indigo-400/50'} />
                                <span className="text-sm font-medium">College Club</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'COMPANY' })}
                                className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-2 border transition-all ${formData.role === 'COMPANY'
                                        ? 'bg-indigo-500/20 border-indigo-400 text-white'
                                        : 'bg-white/5 border-white/10 text-indigo-200 hover:bg-white/10'
                                    }`}
                            >
                                <Briefcase className={formData.role === 'COMPANY' ? 'text-indigo-400' : 'text-indigo-400/50'} />
                                <span className="text-sm font-medium">Company</span>
                            </button>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-indigo-100 pl-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300" />
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                    placeholder={formData.role === 'CLUB' ? 'e.g. Tech Society IIT' : 'e.g. Google India'}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-indigo-100 pl-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                    placeholder={formData.role === 'CLUB' ? 'club@college.edu' : 'marketing@company.com'}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-indigo-100 pl-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300" />
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                    placeholder="Create a strong password"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25 mt-4"
                        >
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                            {!isLoading && <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-indigo-200">
                        Already have an account?{' '}
                        <Link href="/login" className="text-white hover:text-indigo-400 font-medium transition-colors">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
