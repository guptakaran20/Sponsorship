'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { Calendar, MapPin, Users, Tag, Plus, Trash2, Save, Rocket } from 'lucide-react';

export default function CreateEventPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        eventType: 'Tech Fest',
        footfall: '',
        location: '',
        date: '',
    });

    const [tiers, setTiers] = useState([{ name: '', amount: '', benefits: '' }]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const addTier = () => {
        setTiers([...tiers, { name: '', amount: '', benefits: '' }]);
    };

    const removeTier = (index: number) => {
        setTiers(tiers.filter((_, i) => i !== index));
    };

    const updateTier = (index: number, field: string, value: string) => {
        const newTiers = [...tiers];
        newTiers[index] = { ...newTiers[index], [field]: value };
        setTiers(newTiers);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const payload = {
                ...formData,
                tiers: tiers.map(t => ({
                    ...t,
                    amount: parseFloat(t.amount),
                    benefits: t.benefits.split(',').map(b => b.trim()).filter(Boolean)
                }))
            };

            await fetchApi('/events', {
                method: 'POST',
                body: JSON.stringify(payload),
            });

            router.push('/club/dashboard');
        } catch (err: any) {
            setError(err.message || 'Failed to create event. Ensure your profile is complete first.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Create New Event</h1>
                    <p className="text-slate-400">Add an event and define sponsorship tiers for companies to see.</p>
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
                        <span className="bg-indigo-500/20 text-indigo-400 p-2 rounded-lg mr-3">1</span>
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
                                    <Users className="w-4 h-4 mr-2 text-indigo-400" /> Current Club Members
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

                {/* Tiers Section */}
                <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 lg:p-8 shadow-xl space-y-6">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <h2 className="text-xl font-semibold text-white flex items-center">
                            <span className="bg-indigo-500/20 text-indigo-400 p-2 rounded-lg mr-3">2</span>
                            Sponsorship Tiers
                        </h2>
                        <button
                            type="button"
                            onClick={addTier}
                            className="px-4 py-2 bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 rounded-lg text-sm font-medium transition-all flex items-center"
                        >
                            <Plus className="w-4 h-4 mr-2" /> Add Tier
                        </button>
                    </div>

                    <div className="space-y-6">
                        {tiers.map((tier, index) => (
                            <div key={index} className="relative bg-black/20 border border-white/5 p-5 rounded-2xl group transition-all hover:border-white/10">
                                <button
                                    type="button"
                                    onClick={() => removeTier(index)}
                                    className="absolute top-4 right-4 p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-12">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-400">Tier Name</label>
                                        <input
                                            type="text"
                                            value={tier.name}
                                            onChange={(e) => updateTier(index, 'name', e.target.value)}
                                            className="w-full bg-white/5 border border-white/5 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                            placeholder="e.g. Title Sponsor"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-400">Amount (INR)</label>
                                        <input
                                            type="number"
                                            value={tier.amount}
                                            onChange={(e) => updateTier(index, 'amount', e.target.value)}
                                            className="w-full bg-white/5 border border-white/5 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                            placeholder="e.g. 5000"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-xs font-medium text-slate-400">Benefits (Comma separated)</label>
                                        <input
                                            type="text"
                                            value={tier.benefits}
                                            onChange={(e) => updateTier(index, 'benefits', e.target.value)}
                                            className="w-full bg-white/5 border border-white/5 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                            placeholder="e.g. Logo on banner, Keynote speech slot, Stalls"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        {tiers.length === 0 && (
                            <div className="text-center py-8 bg-white/5 border border-dashed border-white/10 rounded-2xl">
                                <p className="text-slate-400 mb-4">No tiers defined yet.</p>
                                <button
                                    type="button"
                                    onClick={addTier}
                                    className="px-4 py-2 bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 rounded-lg text-sm font-medium transition-all inline-flex items-center"
                                >
                                    <Plus className="w-4 h-4 mr-2" /> Create First Tier
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-3 px-8 rounded-xl transition-all flex items-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25"
                    >
                        {isLoading ? 'Publishing Event...' : 'Publish Event'}
                        {!isLoading && <Save className="ml-2 w-5 h-5" />}
                    </button>
                </div>
            </form>
        </div>
    );
}
