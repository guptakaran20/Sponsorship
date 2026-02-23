'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { Handshake, CheckCircle2, XCircle, Clock, MessageSquare, Briefcase } from 'lucide-react';

export default function ClubSponsorshipsPage() {
    const [deals, setDeals] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadDeals();
    }, []);

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

    const handleUpdateStatus = async (dealId: string, status: string) => {
        try {
            await fetchApi(`/deals/${dealId}`, {
                method: 'PUT',
                body: JSON.stringify({ status })
            });
            loadDeals();
        } catch (error) {
            alert('Failed to update deal status');
        }
    };

    if (isLoading) {
        return <div className="animate-pulse h-64 bg-slate-900 rounded-3xl" />;
    }

    return (
        <div className="space-y-8 pb-12">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Sponsorship Requests</h1>
                    <p className="text-slate-400">Review proposals from brands and manage active sponsorships.</p>
                </div>
                <div className="hidden sm:flex items-center justify-center p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                    <Handshake className="w-8 h-8 text-indigo-400" />
                </div>
            </div>

            {deals.length === 0 ? (
                <div className="text-center py-20 bg-slate-900 border border-dashed border-white/10 rounded-3xl">
                    <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-white mb-2">No Sponsorship Requests Yet</h3>
                    <p className="text-slate-400 max-w-sm mx-auto">
                        When companies request to sponsor your events, they will appear here.
                    </p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {deals.map(deal => (
                        <div key={deal.id} className="bg-slate-900 border border-white/5 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                            <div className="flex-1">
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
                                    <span className="text-slate-500 text-sm">Applied for</span>
                                    <span className="text-indigo-400 font-medium">{deal.tier.name} (${deal.tier.amount})</span>
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-1">
                                    {deal.company.industry || 'Company'} <span className="text-slate-500 text-lg font-normal mx-2">for</span> {deal.event.name}
                                </h3>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t border-white/5 md:border-t-0">
                                <Link
                                    href={`/chat/${deal.company.userId}`}
                                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-all flex items-center justify-center flex-1 md:flex-none border border-white/10"
                                >
                                    <MessageSquare className="w-4 h-4 mr-2 text-indigo-400" />
                                    Chat
                                </Link>

                                {deal.status === 'PENDING' && (
                                    <>
                                        <button
                                            onClick={() => handleUpdateStatus(deal.id, 'REJECTED')}
                                            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl font-medium transition-all flex-1 md:flex-none"
                                        >
                                            Decline
                                        </button>
                                        <button
                                            onClick={() => handleUpdateStatus(deal.id, 'ACCEPTED')}
                                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-all shadow-lg shadow-emerald-500/25 flex-1 md:flex-none"
                                        >
                                            Accept Proposal
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
