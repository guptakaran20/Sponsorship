'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { Calendar, MapPin, Users, Tag, Save, Rocket, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditEventPage() {
    const router = useRouter();
    const params = useParams();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        eventType: 'Tech Fest',
        footfall: '',
        location: '',
        date: '',
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const data = await fetchApi(`/events/${params.id}`);
                // Safely format date for input type="date"
                let formattedDate = '';
                if (data.date) {
                    const d = new Date(data.date);
                    formattedDate = d.toISOString().split('T')[0];
                }

                setFormData({
                    name: data.name || '',
                    description: data.description || '',
                    eventType: data.eventType || 'Tech Fest',
                    footfall: data.footfall ? data.footfall.toString() : '',
                    location: data.location || '',
                    date: formattedDate,
                });
            } catch (err: any) {
                console.error("Failed to fetch event", err);
                setError("Failed to load event details.");
            } finally {
                setIsLoading(false);
            }
        };

        if (params.id) {
            fetchEventDetails();
        }
    }, [params.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');

        try {
            await fetchApi(`/events/${params.id}`, {
                method: 'PUT',
                body: JSON.stringify(formData),
            });

            router.push(`/club/events/${params.id}`);
        } catch (err: any) {
            setError(err.message || 'Failed to update event.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="animate-pulse h-96 bg-slate-900 rounded-3xl" />;
    }

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <button onClick={() => router.push(`/club/events/${params.id}`)} className="text-slate-400 hover:text-white flex items-center transition-colors mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Event Details
            </button>

            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Edit Event</h1>
                    <p className="text-slate-400">Update the basic details of your event.</p>
                </div>
                <div className="hidden sm:flex items-center justify-center p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                    <Rocket className="w-8 h-8 text-indigo-400" />
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                    <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
                        {error}
                    </div>
                )}

                {/* Basic Info Section */}
                <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 lg:p-8 shadow-xl space-y-6">
                    <h2 className="text-xl font-semibold text-white flex items-center border-b border-white/5 pb-4">
                        Basic Information
                    </h2>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Event Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                placeholder="e.g. HackSprint 2026"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                                placeholder="What is this event about?"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 flex items-center">
                                    <Tag className="w-4 h-4 mr-2 text-indigo-400" /> Event Type
                                </label>
                                <select
                                    value={formData.eventType}
                                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
                                >
                                    <option className="bg-slate-900 text-white">Tech Fest</option>
                                    <option className="bg-slate-900 text-white">Cultural Fest</option>
                                    <option className="bg-slate-900 text-white">Hackathon</option>
                                    <option className="bg-slate-900 text-white">Workshop</option>
                                    <option className="bg-slate-900 text-white">Sports</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 flex items-center">
                                    <Users className="w-4 h-4 mr-2 text-indigo-400" /> Expected Reach / Footfall
                                </label>
                                <input
                                    type="number"
                                    value={formData.footfall}
                                    onChange={(e) => setFormData({ ...formData, footfall: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                    placeholder="e.g. 2000"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 flex items-center">
                                    <MapPin className="w-4 h-4 mr-2 text-indigo-400" /> Location
                                </label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                    placeholder="e.g. Main Auditorium"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 flex items-center">
                                    <Calendar className="w-4 h-4 mr-2 text-indigo-400" /> Date
                                </label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all [color-scheme:dark]"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-3 px-8 rounded-xl transition-all flex items-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25"
                    >
                        {isSaving ? 'Updating Event...' : 'Update Event'}
                        {!isSaving && <Save className="ml-2 w-5 h-5" />}
                    </button>
                </div>
            </form>
        </div>
    );
}
