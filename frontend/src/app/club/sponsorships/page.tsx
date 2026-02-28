'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { Handshake, CheckCircle2, XCircle, Clock, Briefcase, CheckCircle, ShieldCheck, ChevronRight } from 'lucide-react';

export default function ClubSponsorshipsPage() {
    const [deals, setDeals] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pinInput, setPinInput] = useState<{ [key: string]: string }>({});
    const [verifying, setVerifying] = useState<{ [key: string]: boolean }>({});

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

    const handleVerifyPin = async (dealId: string) => {
        const pin = pinInput[dealId];
        if (!pin || pin.length !== 6) return alert("Please enter a valid 6-character PIN.");

        setVerifying({ ...verifying, [dealId]: true });
        try {
            await fetchApi(`/deals/${dealId}/verify`, {
                method: 'POST',
                body: JSON.stringify({ pin })
            });
            alert('Deal verified and completed successfully!');
            loadDeals();
        } catch (error: any) {
            alert(error.message || 'Failed to verify PIN');
        } finally {
            setVerifying({ ...verifying, [dealId]: false });
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
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${deal.status === 'COMPLETED' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/20' : deal.status === 'ACCEPTED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' :
                                        deal.status === 'REJECTED' ? 'bg-red-500/20 text-red-400 border border-red-500/20' :
                                            'bg-amber-500/20 text-amber-400 border border-amber-500/20'
                                        }`}>
                                        {deal.status === 'PENDING' && <Clock className="w-3 h-3 inline mr-1" />}
                                        {deal.status === 'ACCEPTED' && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
                                        {deal.status === 'COMPLETED' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                                        {deal.status === 'REJECTED' && <XCircle className="w-3 h-3 inline mr-1" />}
                                        {deal.status}
                                    </span>
                                    <span className="text-slate-500 text-sm">Applied for</span>
                                    <span className="text-indigo-400 font-medium">{deal.tier.name} (₹{deal.tier.amount})</span>
                                </div>

                                {/* Deal Status Timeline */}
                                <div className="flex items-center gap-1 my-3">
                                    {['PENDING', 'ACCEPTED', 'COMPLETED'].map((step, idx) => {
                                        const statusOrder = ['PENDING', 'ACCEPTED', 'COMPLETED'];
                                        const currentIdx = deal.status === 'REJECTED' ? 0 : statusOrder.indexOf(deal.status);
                                        const stepIdx = statusOrder.indexOf(step);
                                        const isActive = stepIdx <= currentIdx;
                                        const isRejected = deal.status === 'REJECTED' && step === 'PENDING';
                                        return (
                                            <div key={step} className="flex items-center gap-1 flex-1">
                                                <div className={`w-2 h-2 rounded-full shrink-0 ${isRejected ? 'bg-red-500' : isActive ? 'bg-indigo-500' : 'bg-white/10'}`} />
                                                <div className={`h-0.5 flex-1 rounded ${idx < 2 ? (isActive && stepIdx < currentIdx ? 'bg-indigo-500' : 'bg-white/10') : 'hidden'}`} />
                                            </div>
                                        );
                                    })}
                                    <span className="text-[10px] text-slate-500 ml-1">
                                        {deal.status === 'REJECTED' ? 'Declined' : deal.status === 'COMPLETED' ? 'Done' : deal.status === 'ACCEPTED' ? 'Awaiting PIN' : 'Reviewing'}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-2xl font-bold text-white">
                                        {deal.company.industry || 'Company'}
                                    </h3>
                                    <a
                                        href={`/view/company/${deal.companyId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-indigo-400 hover:text-indigo-300 font-bold hover:underline transition-all flex items-center bg-indigo-500/10 px-2 py-0.5 rounded-lg text-sm border border-indigo-500/20"
                                    >
                                        View Profile <ChevronRight className="w-4 h-4 ml-0.5" />
                                    </a>
                                </div>
                                <h4 className="text-slate-400 font-medium">
                                    for {deal.event.name}
                                </h4>

                                {/* Contact Details Section */}
                                {['PENDING', 'ACCEPTED', 'COMPLETED'].includes(deal.status) && (deal.company.contactPerson || deal.company.contactNumber || deal.company.website || deal.company.socialLinks) && (
                                    <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-xl">
                                        <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Company Profile & Contact</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                            {deal.company.contactPerson && (
                                                <div className="text-slate-300">
                                                    <span className="text-slate-500 mr-2">Contact:</span>
                                                    {deal.company.contactPerson}
                                                </div>
                                            )}
                                            {deal.company.contactNumber && (
                                                <div className="text-slate-300">
                                                    <span className="text-slate-500 mr-2">Phone:</span>
                                                    {deal.company.contactNumber}
                                                </div>
                                            )}
                                            {deal.company.website && (
                                                <div className="text-slate-300">
                                                    <span className="text-slate-500 mr-2">Website:</span>
                                                    <a href={deal.company.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                                        {deal.company.website}
                                                    </a>
                                                </div>
                                            )}
                                            {deal.company.budgetRange && (
                                                <div className="text-slate-300">
                                                    <span className="text-slate-500 mr-2">Budget Range:</span>
                                                    {deal.company.budgetRange}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col items-end gap-3 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t border-white/5 md:border-t-0">
                                {deal.status === 'PENDING' && (
                                    <div className="flex gap-2 w-full justify-end">
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
                                    </div>
                                )}
                                {deal.status === 'ACCEPTED' && (
                                    <div className="flex items-center p-1 bg-slate-950/50 rounded-xl border border-white/10 mt-2">
                                        <input
                                            type="text"
                                            placeholder="Enter 6-char PIN"
                                            maxLength={6}
                                            value={pinInput[deal.id] || ''}
                                            onChange={(e) => setPinInput({ ...pinInput, [deal.id]: e.target.value.toUpperCase() })}
                                            className="bg-transparent text-white px-3 py-2 w-32 outline-none uppercase font-mono tracking-widest text-sm"
                                        />
                                        <button
                                            onClick={() => handleVerifyPin(deal.id)}
                                            disabled={verifying[deal.id]}
                                            className="px-3 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center"
                                        >
                                            {verifying[deal.id] ? (
                                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-1" />
                                            ) : (
                                                <ShieldCheck className="w-4 h-4 mr-1" />
                                            )}
                                            Verify
                                        </button>
                                    </div>
                                )}
                                {deal.status === 'ACCEPTED' && (
                                    <p className="text-[11px] text-slate-500 mt-2">
                                        Ask the sponsoring company for their 6-character Deal PIN to verify and complete this sponsorship.
                                    </p>
                                )}
                                {deal.status === 'COMPLETED' && (
                                    <div className="text-right">
                                        <p className="text-emerald-400 font-medium text-sm flex items-center justify-end">
                                            <CheckCircle className="w-4 h-4 mr-1" /> Deal Completed
                                        </p>
                                        <p className="text-slate-500 text-xs mt-1">Amount received: ₹{deal.tier.amount}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
