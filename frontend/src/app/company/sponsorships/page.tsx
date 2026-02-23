'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { Handshake, CheckCircle2, XCircle, Clock, MessageSquare, Compass } from 'lucide-react';

export default function CompanySponsorshipsPage() {
    const [deals, setDeals] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadDeals = async () => {
            try {
                const data = await fetchApi('/deals');
                setDeals(data || []);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        loadDeals();
    }, []);

    if (isLoading) {
        return <div className="animate-pulse h-64 bg-slate-900 rounded-3xl" />;
    }

    return (
        <div className="space-y-8 pb-12">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">My Sponsorships</h1>
                    <p className="text-slate-400">Track and manage your brand's event sponsorships.</p>
                </div>
                <div className="hidden sm:flex items-center justify-center p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                    <Handshake className="w-8 h-8 text-blue-400" />
                </div>
            </div>

            {deals.length === 0 ? (
                <div className="text-center py-20 bg-slate-900 border border-dashed border-white/10 rounded-3xl">
                    <Compass className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-white mb-2">No Active Campaigns</h3>
                    <p className="text-slate-400 max-w-sm mx-auto mb-6">
                        Start sponsoring events to increase your brand's reach among college students.
                    </p>
                    <Link
                        href="/company/discover"
                        className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-500/25"
                    >
                        Discover Events
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6">
                    {deals.map(deal => (
                        <div key={deal.id} className="bg-slate-900 border border-white/5 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row gap-6 items-start md:items-center justify-between relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-full blur-3xl -mr-10 -mt-20"></div>

                            <div className="flex-1 relative z-10">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${deal.status === 'ACCEPTED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' :
                                            deal.status === 'REJECTED' ? 'bg-red-500/20 text-red-400 border border-red-500/20' :
                                                'bg-amber-500/20 text-amber-400 border border-amber-500/20'
                                        }`}>
                                        {deal.status === 'PENDING' && <Clock className="w-3 h-3 inline mr-1" />}
                                        {deal.status === 'ACCEPTED' && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
                                        {deal.status === 'REJECTED' && <XCircle className="w-3 h-3 inline mr-1" />}
                                        {deal.status}
                                    </span>
                                    <span className="text-slate-500 text-sm">Tier selected</span>
                                    <span className="text-indigo-400 font-medium">{deal.tier.name} (${deal.tier.amount})</span>
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-1">
                                    {deal.event.name}
                                </h3>
                                <p className="text-slate-400 font-medium">
                                    Organized by {deal.event.club?.collegeName || 'Unknown Club'}
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t border-white/5 md:border-t-0 relative z-10">
                                <Link
                                    href={`/chat/${deal.event.club.userId}`}
                                    className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-all flex items-center justify-center flex-1 md:flex-none border border-white/10"
                                >
                                    <MessageSquare className="w-4 h-4 mr-2 text-indigo-400" />
                                    Message Club
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
