'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { Calendar, Users, MapPin, Tag, Plus, Sparkles, ChevronRight } from 'lucide-react';

export default function ClubEventsPage() {
    const [events, setEvents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchClubEvents = async () => {
            try {
                const profile = await fetchApi('/clubs/profile');
                if (profile && profile.events) {
                    setEvents(profile.events);
                }
            } catch (error) {
                console.error("Failed to fetch club events", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchClubEvents();
    }, []);

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">My Events</h1>
                    <p className="text-slate-400">Manage your created events and track sponsorships.</p>
                </div>
                <Link
                    href="/club/events/new"
                    className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition-all inline-flex items-center shadow-lg shadow-indigo-500/25 shrink-0"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Create New Event
                </Link>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-80 bg-slate-900 rounded-3xl" />
                    ))}
                </div>
            ) : events.length === 0 ? (
                <div className="text-center py-20 bg-slate-900 border border-dashed border-white/10 rounded-3xl">
                    <Sparkles className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-white mb-2">No Events Created Yet</h3>
                    <p className="text-slate-400 max-w-sm mx-auto mb-6">
                        Start hosting events to attract sponsorships from top companies.
                    </p>
                    <Link
                        href="/club/events/new"
                        className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-500/25 inline-block"
                    >
                        Create Your First Event
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <div
                            key={event.id}
                            className="bg-slate-900 border border-white/5 rounded-3xl overflow-hidden hover:border-indigo-500/50 hover:shadow-[0_0_30px_-5px_var(--color-indigo-500)] hover:shadow-indigo-500/20 transition-all duration-300 flex flex-col group"
                        >
                            <div className="h-32 bg-gradient-to-br from-indigo-900/50 to-slate-900 p-6 relative">
                                <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-medium text-indigo-300 flex items-center">
                                    <Tag className="w-3 h-3 mr-1" /> {event.eventType}
                                </div>
                                <h3 className="text-xl font-bold text-white leading-tight mt-4 group-hover:text-indigo-400 transition-colors">{event.name}</h3>
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <p className="text-slate-400 text-sm line-clamp-2 mb-6">
                                    {event.description}
                                </p>

                                <div className="grid grid-cols-2 gap-4 mt-auto mb-6">
                                    <div className="flex items-center text-sm text-slate-300">
                                        <Users className="w-4 h-4 mr-2 text-indigo-400" />
                                        {event.footfall.toLocaleString()} reach
                                    </div>
                                    <div className="flex items-center text-sm text-slate-300">
                                        <Calendar className="w-4 h-4 mr-2 text-indigo-400" />
                                        {new Date(event.date).toLocaleDateString()}
                                    </div>
                                    <div className="col-span-2 flex items-center text-sm text-slate-300">
                                        <MapPin className="w-4 h-4 mr-2 text-indigo-400 shrink-0" />
                                        <span className="truncate">{event.location}</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
                                    <Link href={`/club/events/${event.id}`} className="text-indigo-400 font-medium text-sm flex items-center hover:text-indigo-300 transition-colors group-hover:translate-x-1 duration-300">
                                        Manage Event <ChevronRight className="w-4 h-4 ml-1" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
