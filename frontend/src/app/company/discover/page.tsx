'use client';

import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';
import { Calendar, Users, MapPin, Tag, Sparkles, Handshake, Filter, ChevronDown, CheckCircle2, ChevronRight, Search } from 'lucide-react';

export default function DiscoverEventsPage() {
    const [events, setEvents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
    const [isApplying, setIsApplying] = useState(false);
    const [applySuccess, setApplySuccess] = useState('');
    const [applyError, setApplyError] = useState('');

    // Filters
    const [eventTypeFilter, setEventTypeFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [companyProfile, setCompanyProfile] = useState<any>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profile = await fetchApi('/companies/profile');
                if (profile) setCompanyProfile(profile);
            } catch (error) {
                console.error("Failed to load profile", error);
            }
        };
        fetchProfile();
    }, []);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                let url = '/events';
                if (eventTypeFilter) {
                    url += `?eventType=${encodeURIComponent(eventTypeFilter)}`;
                }
                const data = await fetchApi(url);
                setEvents(data);
            } catch (error) {
                console.error("Failed to fetch events", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvents();
    }, [eventTypeFilter]);

    const handleSponsorClick = async (tierId: string) => {
        if (!selectedEvent) return;
        setIsApplying(true);
        setApplyError('');
        setApplySuccess('');

        try {
            await fetchApi('/deals', {
                method: 'POST',
                body: JSON.stringify({
                    eventId: selectedEvent.id,
                    tierId: tierId
                })
            });
            setApplySuccess('Sponsorship request sent successfully! The club will review your proposal.');
        } catch (error: any) {
            setApplyError(error.message || 'Failed to submit request');
        } finally {
            setIsApplying(false);
        }
    };

    const filteredEvents = events.filter(event =>
    (event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.club?.collegeName?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Event Marketplace</h1>
                    <p className="text-slate-400">Discover and sponsor premium campus events across the country.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {companyProfile?.targetAudience && (
                        <button
                            onClick={() => {
                                setEventTypeFilter(companyProfile.targetAudience);
                                setSearchQuery('');
                            }}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center border ${eventTypeFilter === companyProfile.targetAudience
                                ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400'
                                : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
                                }`}
                        >
                            <Sparkles className="w-4 h-4 mr-2 text-amber-400" />
                            Related to you
                        </button>
                    )}

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search events or colleges..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-slate-900 border border-white/10 text-white rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-sm w-full md:w-64"
                        />
                    </div>

                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select
                            value={eventTypeFilter}
                            onChange={(e) => setEventTypeFilter(e.target.value)}
                            className="bg-slate-900 border border-white/10 text-white rounded-xl py-2 pl-10 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-sm"
                        >
                            <option value="">All Event Types</option>
                            <option value="Tech Fest">Tech Fest</option>
                            <option value="Hackathon">Hackathon</option>
                            <option value="Cultural Fest">Cultural Fest</option>
                            <option value="Workshop">Workshop</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-80 bg-slate-900 rounded-3xl" />
                    ))}
                </div>
            ) : filteredEvents.length === 0 ? (
                <div className="text-center py-20 bg-slate-900 border border-dashed border-white/10 rounded-3xl">
                    <Sparkles className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-white mb-2">No Events Found</h3>
                    <p className="text-slate-400 max-w-sm mx-auto">
                        There are currently no events matching your criteria. Check back later!
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event) => (
                        <div
                            key={event.id}
                            className="bg-slate-900 border border-white/5 rounded-3xl overflow-hidden hover:border-indigo-500/50 hover:shadow-[0_0_30px_-5px_var(--color-indigo-500)] hover:shadow-indigo-500/20 transition-all duration-300 group flex flex-col cursor-pointer"
                            onClick={() => setSelectedEvent(event)}
                        >
                            <div className="h-32 bg-gradient-to-br from-indigo-900/50 to-slate-900 p-6 relative">
                                <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-medium text-indigo-300 flex items-center">
                                    <Tag className="w-3 h-3 mr-1" /> {event.eventType}
                                </div>
                                <h3 className="text-xl font-bold text-white leading-tight mt-4 group-hover:text-indigo-400 transition-colors">{event.name}</h3>
                                <p className="text-sm text-slate-300 font-medium mt-1">{event.club?.collegeName || 'Unknown College'}</p>
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <p className="text-slate-400 text-sm line-clamp-2 mb-6">
                                    {event.description}
                                </p>

                                <div className="grid grid-cols-2 gap-4 mt-auto">
                                    <div className="flex items-center text-sm text-slate-300">
                                        <Users className="w-4 h-4 mr-2 text-indigo-400" />
                                        {event.footfall.toLocaleString()}+ reach
                                    </div>
                                    <div className="flex items-center text-sm text-slate-300">
                                        <Calendar className="w-4 h-4 mr-2 text-indigo-400" />
                                        {new Date(event.date).toLocaleDateString()}
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-400">
                                        {event.tiers?.length || 0} Sponsor Tiers
                                    </span>
                                    <button className="text-indigo-400 font-medium text-sm flex items-center group-hover:text-indigo-300 transition-colors">
                                        View Details <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Event Details Modal */}
            {selectedEvent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setSelectedEvent(null); setApplySuccess(''); setApplyError(''); }}></div>
                    <div className="relative w-full max-w-3xl bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
                        <div className="p-8 overflow-y-auto">
                            {applySuccess && (
                                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 flex items-center mb-6">
                                    <CheckCircle2 className="w-5 h-5 mr-3 shrink-0" />
                                    {applySuccess}
                                </div>
                            )}
                            {applyError && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 mb-6">
                                    {applyError}
                                </div>
                            )}

                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4">
                                        {selectedEvent.eventType}
                                    </div>
                                    <h2 className="text-3xl font-bold text-white mb-2">{selectedEvent.name}</h2>
                                    <p className="text-lg text-slate-300">{selectedEvent.club?.collegeName || 'Unknown College'}</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4 mb-8">
                                <div className="bg-white/5 border border-white/5 px-4 py-2 rounded-xl flex items-center text-sm text-slate-300">
                                    <Calendar className="w-4 h-4 mr-2 text-indigo-400" />
                                    {new Date(selectedEvent.date).toLocaleDateString()}
                                </div>
                                <div className="bg-white/5 border border-white/5 px-4 py-2 rounded-xl flex items-center text-sm text-slate-300">
                                    <MapPin className="w-4 h-4 mr-2 text-indigo-400" />
                                    {selectedEvent.location}
                                </div>
                                <div className="bg-white/5 border border-white/5 px-4 py-2 rounded-xl flex items-center text-sm text-slate-300">
                                    <Users className="w-4 h-4 mr-2 text-indigo-400" />
                                    {selectedEvent.footfall.toLocaleString()} Current Club Members
                                </div>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-xl font-semibold text-white mb-4">About the Event</h3>
                                <p className="text-slate-400 leading-relaxed">
                                    {selectedEvent.description}
                                </p>
                            </div>

                            {selectedEvent.club?.description && (
                                <div className="mb-8 p-6 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
                                    <h3 className="text-xl font-semibold text-white mb-3">About the Club</h3>
                                    <p className="text-slate-300 leading-relaxed mb-4">
                                        {selectedEvent.club.description}
                                    </p>

                                    {selectedEvent.club.pastEvents && JSON.parse(selectedEvent.club.pastEvents).length > 0 && (
                                        <div className="mb-4">
                                            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Past Events</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {JSON.parse(selectedEvent.club.pastEvents).map((event: string, i: number) => (
                                                    <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-slate-300">
                                                        {event}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {selectedEvent.club.socialLinks && (
                                        <div>
                                            {(() => {
                                                try {
                                                    const socials = JSON.parse(selectedEvent.club.socialLinks);
                                                    if (!socials.instagram && !socials.website) return null;
                                                    return (
                                                        <div className="flex gap-4">
                                                            {socials.instagram && (
                                                                <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-pink-400 hover:text-pink-300 hover:underline">
                                                                    Instagram
                                                                </a>
                                                            )}
                                                            {socials.website && (
                                                                <a href={socials.website} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-400 hover:text-blue-300 hover:underline">
                                                                    Website
                                                                </a>
                                                            )}
                                                        </div>
                                                    );
                                                } catch (e) { return null; }
                                            })()}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div>
                                <h3 className="text-xl font-semibold text-white mb-4">Available Sponsorship Tiers</h3>
                                {selectedEvent.tiers && selectedEvent.tiers.length > 0 ? (
                                    <div className="space-y-4">
                                        {selectedEvent.tiers.map((tier: any) => (
                                            <div key={tier.id} className="bg-black/30 border border-white/5 p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-indigo-500/30 transition-colors">
                                                <div className="flex-1">
                                                    <div className="flex items-end gap-3 mb-2">
                                                        <h4 className="text-xl font-bold text-white">{tier.name}</h4>
                                                        <span className="text-2xl font-black text-emerald-400 mb-0.5">₹{tier.amount}</span>
                                                    </div>

                                                    <div className="mt-3">
                                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Included Benefits</p>
                                                        <ul className="space-y-1">
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
                                                </div>
                                                <button
                                                    onClick={() => handleSponsorClick(tier.id)}
                                                    disabled={isApplying || applySuccess !== ''}
                                                    className="shrink-0 w-full sm:w-auto px-6 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-800 disabled:text-slate-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-500/25 flex justify-center items-center"
                                                >
                                                    {isApplying ? 'Processing...' : 'Sponsor this tier'}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-slate-500">No sponsorship tiers have been defined for this event.</p>
                                )}
                            </div>
                        </div>

                        <div className="p-4 border-t border-white/10 bg-black/20 flex justify-end">
                            <button
                                onClick={() => { setSelectedEvent(null); setApplySuccess(''); setApplyError(''); }}
                                className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
