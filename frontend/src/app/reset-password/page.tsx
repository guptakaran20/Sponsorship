'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { Lock, ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token') || '';

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (!token) {
            setError('Invalid or missing reset token.');
            return;
        }

        setIsLoading(true);

        try {
            await fetchApi('/auth/reset-password', {
                method: 'POST',
                body: JSON.stringify({ token, password }),
            });
            setSuccess(true);
            setTimeout(() => router.push('/login'), 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to reset password. The link may have expired.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            {success ? (
                <div className="text-center space-y-4">
                    <div className="p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-xl text-emerald-200 text-sm">
                        Password reset successfully! Redirecting to login...
                    </div>
                    <Link href="/login" className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors text-sm">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Go to Sign In
                    </Link>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
                            {error}
                        </div>
                    )}

                    {!token && (
                        <div className="p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-xl text-yellow-200 text-sm">
                            No reset token found. Please use the link from your email.
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-indigo-100 pl-1">New Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                placeholder="••••••••"
                                minLength={8}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-indigo-100 pl-1">Confirm New Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300" />
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                placeholder="••••••••"
                                minLength={8}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !token}
                        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25"
                    >
                        {isLoading ? 'Resetting...' : 'Reset Password'}
                    </button>

                    <div className="text-center">
                        <Link href="/login" className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors text-sm">
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Back to Sign In
                        </Link>
                    </div>
                </form>
            )}
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]" />

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-3 bg-white/5 rounded-2xl backdrop-blur-xl border border-white/10 mb-4 shadow-2xl">
                        <Sparkles className="w-8 h-8 text-indigo-400" />
                    </div>
                    <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Reset Password</h1>
                    <p className="text-indigo-200">Enter your new password below.</p>
                </div>

                <Suspense fallback={<div className="animate-pulse h-64 bg-white/5 rounded-3xl" />}>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    );
}
