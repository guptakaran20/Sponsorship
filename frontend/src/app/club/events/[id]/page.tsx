'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { Calendar, Users, MapPin, Tag, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ManageEventPage() {
    const params = useParams();
    const router = useRouter();
    const [event, setEvent] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const data = await fetchApi(`/events/${params.id}`);
                setEvent(data);
            } catch (error) {
                console.error("Failed to fetch event", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (params.id) {
            fetchEventDetails();
        }
    }, [params.id]);

    if (isLoading) {
        return <div className="animate-pulse h-96 bg-slate-900 rounded-3xl" />;
    }

    if (!event) {
        return (
            <div className="text-center py-20 bg-slate-900 border border-dashed border-white/10 rounded-3xl">
                <h3 className="text-xl font-medium text-white mb-2">Event Not Found</h3>
                <button onClick={() => router.back()} className="text-indigo-400 mt-4 underline">Go Back</button>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12 max-w-5xl mx-auto">
            <button onClick={() => router.push('/club/events')} className="text-slate-400 hover:text-white flex items-center transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Events
            </button>

            <div className="bg-slate-900 border border-white/5 rounded-3xl p-8 shadow-xl">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
                    <div>
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4">
                            <Tag className="w-3 h-3 mr-1" /> {event.eventType}
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-4">{event.name}</h1>
                        <p className="text-slate-400 text-lg leading-relaxed max-w-3xl">{event.description}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6 border-y border-white/5 bg-slate-800/20 -mx-8 px-8 mb-8">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center mr-4">
                            <Calendar className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Date</p>
                            <p className="text-white font-medium">{new Date(event.date).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center mr-4">
                            <Users className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Expected Reach</p>
                            <p className="text-white font-medium">{event.footfall.toLocaleString()} attendees</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center mr-4">
                            <MapPin className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Location</p>
                            <p className="text-white font-medium">{event.location}</p>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-2xl font-semibold text-white mb-6">Sponsorship Tiers</h3>
                    {event.tiers && event.tiers.length > 0 ? (
                        <div className="grid gap-4">
                            {event.tiers.map((tier: any) => (
                                <div key={tier.id} className="bg-black/20 border border-white/5 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-indigo-500/20 transition-colors">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h4 className="text-xl font-bold text-white">{tier.name}</h4>
                                            <span className="text-xl font-black text-emerald-400 px-3 py-1 bg-emerald-500/10 rounded-lg">₹{tier.amount}</span>
                                        </div>
                                        <ul className="mt-3 space-y-2">
                                            {(() => {
                                                try {
                                                    const benefits = JSON.parse(tier.benefits);
                                                    return (Array.isArray(benefits) ? benefits : [benefits]).map((b: string, i: number) => (
                                                        <li key={i} className="flex items-start text-sm text-slate-300">
                                                            <CheckCircle2 className="w-4 h-4 text-indigo-400 mr-2 shrink-0 mt-0.5" />
                                                            {b}
                                                        </li>
                                                    ));
                                                } catch (e) {
                                                    return (
                                                        <li className="flex items-start text-sm text-slate-300">
                                                            <CheckCircle2 className="w-4 h-4 text-indigo-400 mr-2 shrink-0 mt-0.5" />
                                                            {tier.benefits}
                                                        </li>
                                                    )
                                                }
                                            })()}
                                        </ul>
                                    </div>
                                    <div className="text-right">
                                        <Link href="/club/sponsorships" className="text-sm text-slate-400 hover:text-white underline">
                                            View Active Requests
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-400">No sponsorship tiers configured.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
