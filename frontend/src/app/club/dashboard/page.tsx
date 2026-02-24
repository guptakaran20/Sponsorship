'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { Calendar, Users, Briefcase, ChevronRight, TrendingUp } from 'lucide-react';

export default function ClubDashboardPage() {
    const [profile, setProfile] = useState<any>(null);
    const [events, setEvents] = useState<any[]>([]);
    const [deals, setDeals] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const [profData, eventsData, dealsData] = await Promise.all([
                    fetchApi('/clubs/profile').catch(() => null),
                    fetchApi('/events'), // Need to filter by club actually
                    fetchApi('/deals')
                ]);

                setProfile(profData);
                if (profData && profData.events) {
                    setEvents(profData.events);
                }
                const myDeals = dealsData || [];
                setDeals(myDeals);
            } catch (error) {
                console.error("Error loading dashboard", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadDashboardData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col gap-6 animate-pulse">
                <div className="h-32 bg-slate-900 rounded-3xl" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="h-40 bg-slate-900 rounded-3xl" />
                    <div className="h-40 bg-slate-900 rounded-3xl" />
                    <div className="h-40 bg-slate-900 rounded-3xl" />
                </div>
            </div>
        );
    }

    // Calculate metrics
    const activeSponsors = deals.filter(d => d.status === 'ACCEPTED').length;
    const pendingRequests = deals.filter(d => d.status === 'PENDING').length;
    const totalRevenue = profile?.totalAmountRaised || 0;

    return (
        <div className="space-y-8 pb-12">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-white/5 rounded-3xl p-8 lg:p-10 shadow-xl">
                <div className="absolute top-0 right-0 p-8 opacity-20 hidden md:block">
                    <Briefcase className="w-32 h-32 text-white" />
                </div>
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
                        Welcome back, {profile?.collegeName || 'Club Champion'}!
                    </h1>
                    <p className="text-indigo-200 max-w-xl text-lg">
                        Here's what's happening with your sponsorship campaigns today.
                    </p>
                    {!profile && (
                        <div className="mt-6 flex items-center">
                            <span className="text-amber-400 bg-amber-400/10 px-4 py-2 rounded-xl text-sm border border-amber-400/20 font-medium mr-4">
                                Action Required: Compete your Profile Setup
                            </span>
                            <Link href="/club/profile" className="text-indigo-400 hover:text-indigo-300 font-medium underline">
                                Go to Settings
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-slate-400 mb-1">Active Sponsors</p>
                            <h3 className="text-4xl font-bold text-white">{activeSponsors}</h3>
                        </div>
                        <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400">
                            <Users className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="flex items-center text-sm">
                        <TrendingUp className="w-4 h-4 text-emerald-400 mr-1" />
                        <span className="text-emerald-400 font-medium">+2 this month</span>
                    </div>
                </div>

                <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-slate-400 mb-1">Total Sponsored</p>
                            <h3 className="text-4xl font-bold text-white">₹{totalRevenue}</h3>
                        </div>
                        <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400">
                            <Briefcase className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="flex items-center text-sm">
                        <span className="text-slate-500">From accepted deals</span>
                    </div>
                </div>

                <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-slate-400 mb-1">Pending Requests</p>
                            <h3 className="text-4xl font-bold text-white">{pendingRequests}</h3>
                        </div>
                        <div className="p-3 bg-amber-500/20 rounded-2xl text-amber-400">
                            <Calendar className="w-6 h-6" />
                        </div>
                    </div>
                    <Link href="/club/sponsorships" className="inline-flex items-center text-sm text-indigo-400 hover:text-indigo-300">
                        Review requests <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-900 border border-white/5 rounded-3xl p-8 shadow-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Your Events</h2>
                    <Link
                        href="/club/events/new"
                        className="mt-4 sm:mt-0 px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition-all inline-flex items-center shadow-lg shadow-indigo-500/25"
                    >
                        Create New Event
                    </Link>
                </div>

                {events.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl bg-white/5">
                        <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">No Active Events Found</h3>
                        <p className="text-slate-400 mb-6 max-w-md mx-auto">You haven't posted any events yet. Post an event to start receiving sponsorship offers from companies.</p>
                        <Link
                            href="/club/events/new"
                            className="px-6 py-2 text-indigo-400 hover:text-white bg-indigo-500/10 hover:bg-indigo-500 border border-indigo-500/20 hover:border-transparent rounded-xl transition-all inline-block font-medium"
                        >
                            Create Your First Event
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.slice(0, 3).map(event => (
                            <Link href={`/club/events/${event.id}`} key={event.id} className="block bg-black/20 border border-white/5 rounded-2xl p-6 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all group">
                                <span className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-400 text-xs font-medium rounded-full mb-4">
                                    {event.eventType}
                                </span>
                                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                                    {event.name}
                                </h3>
                                <div className="text-sm text-slate-400 flex items-center mb-1">
                                    <Calendar className="w-4 h-4 mr-2 opacity-70" /> {new Date(event.date).toLocaleDateString()}
                                </div>
                                <div className="text-sm text-slate-400 flex items-center">
                                    <Users className="w-4 h-4 mr-2 opacity-70" /> {event.footfall} reach
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
