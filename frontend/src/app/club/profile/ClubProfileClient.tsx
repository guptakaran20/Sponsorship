'use client';
import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';
import { Building2, Users, Link as LinkIcon, Info, Save, Phone, User } from 'lucide-react';
import { CalendarDays, Image as ImageIcon } from 'lucide-react';

export default function ClubProfilePage() {
    const [formData, setFormData] = useState({
        collegeName: '',
        description: '',
        profilePhoto: '',
        about: '',
        reach: '',
        pastEvents: '',
        contactPerson: '',
        contactNumber: '',
    });
    const [socials, setSocials] = useState({ instagram: '', website: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const profile = await fetchApi('/clubs/profile');
                if (profile) {
                    setFormData({
                        collegeName: profile.collegeName || '',
                        description: profile.description || '',
                        profilePhoto: profile.profilePhoto || '',
                        about: profile.about || '',
                        reach: profile.reach?.toString() || '',
                        pastEvents: profile.pastEvents ? JSON.parse(profile.pastEvents).join(', ') : '',
                        contactPerson: profile.contactPerson || '',
                        contactNumber: profile.contactNumber || '',
                    });
                    if (profile.socialLinks) {
                        try {
                            const parsed = JSON.parse(profile.socialLinks);
                            setSocials({
                                instagram: parsed.instagram || '',
                                website: parsed.website || ''
                            });
                        } catch (e) {
                            // ignore error
                        }
                    }
                }
            } catch (error) {
                // Profile might not exist yet, that's fine
            } finally {
                setIsFetching(false);
            }
        };
        loadProfile();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const payload = {
                ...formData,
                socialLinks: JSON.stringify(socials),
                pastEvents: formData.pastEvents.split(',').map(s => s.trim()).filter(Boolean),
            };

            await fetchApi('/clubs/profile', {
                method: 'POST',
                body: JSON.stringify(payload),
            });

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-6 py-1">
                <div className="h-4 bg-slate-800 rounded w-1/4"></div>
                <div className="space-y-3">
                    <div className="h-32 bg-slate-800 rounded"></div>
                </div>
            </div>
        </div>;
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Club Profile</h1>
                <p className="text-slate-400">Manage your club details to attract better sponsorships.</p>
            </div>

            <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 lg:p-8 shadow-xl">
                {message.text && (
                    <div className={`p-4 rounded-xl mb-6 border ${message.type === 'success'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : 'bg-red-500/10 border-red-500/20 text-red-400'
                        }`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 flex items-center">
                            <Building2 className="w-4 h-4 mr-2 text-indigo-400" />
                            College / University Name
                        </label>
                        <input
                            type="text"
                            value={formData.collegeName}
                            onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            placeholder="e.g. Stanford University"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 flex items-center">
                            <Info className="w-4 h-4 mr-2 text-indigo-400" />
                            Club Description (Short)
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={2}
                            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                            placeholder="Brief description of your club..."
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 flex items-center">
                            <Info className="w-4 h-4 mr-2 text-indigo-400" />
                            About Club (Detailed)
                        </label>
                        <textarea
                            value={formData.about}
                            onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                            rows={4}
                            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                            placeholder="Detailed information about your club's history, mission, and major achievements..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 flex items-center">
                            <ImageIcon className="w-4 h-4 mr-2 text-indigo-400" />
                            Profile Photo
                        </label>
                        <div className="flex items-center gap-4">
                            {formData.profilePhoto && (
                                <img src={formData.profilePhoto} alt="Profile Preview" className="w-16 h-16 rounded-xl object-cover border border-white/10" />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;

                                    const uploadData = new FormData();
                                    uploadData.append('image', file);

                                    try {
                                        setIsLoading(true);
                                        const token = localStorage.getItem('token');
                                        const res = await fetch('http://localhost:5000/api/upload', {
                                            method: 'POST',
                                            headers: {
                                                'Authorization': `Bearer ${token}`
                                            },
                                            body: uploadData
                                        });
                                        const data = await res.json();
                                        if (res.ok) {
                                            setFormData(prev => ({ ...prev, profilePhoto: data.url }));
                                            setMessage({ type: 'success', text: 'Image uploaded successfully. Remember to Save Profile.' });
                                        } else {
                                            throw new Error(data.message || 'Upload failed');
                                        }
                                    } catch (err: any) {
                                        setMessage({ type: 'error', text: err.message });
                                    } finally {
                                        setIsLoading(false);
                                    }
                                }}
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-500/10 file:text-indigo-400 hover:file:bg-indigo-500/20"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 flex items-center">
                                <Users className="w-4 h-4 mr-2 text-indigo-400" />
                                Current Club Members
                            </label>
                            <input
                                type="number"
                                value={formData.reach}
                                onChange={(e) => setFormData({ ...formData, reach: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                placeholder="e.g. 5000"
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 flex items-center">
                                    <LinkIcon className="w-4 h-4 mr-2 text-indigo-400" />
                                    Instagram URL
                                </label>
                                <input
                                    type="url"
                                    value={socials.instagram}
                                    onChange={(e) => setSocials({ ...socials, instagram: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                                    placeholder="https://instagram.com/yourclub"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 flex items-center">
                                    <LinkIcon className="w-4 h-4 mr-2 text-indigo-400" />
                                    Website URL
                                </label>
                                <input
                                    type="url"
                                    value={socials.website}
                                    onChange={(e) => setSocials({ ...socials, website: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                                    placeholder="https://yourclub.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 flex items-center">
                                    <User className="w-4 h-4 mr-2 text-indigo-400" />
                                    Contact Person Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.contactPerson}
                                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 flex items-center">
                                    <Phone className="w-4 h-4 mr-2 text-indigo-400" />
                                    Contact Number
                                </label>
                                <input
                                    type="tel"
                                    value={formData.contactNumber}
                                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                                    placeholder="+91 9876543210"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 flex items-center">
                            <CalendarDays className="w-4 h-4 mr-2 text-indigo-400" />
                            Past Events (Comma separated)
                        </label>
                        <input
                            type="text"
                            value={formData.pastEvents}
                            onChange={(e) => setFormData({ ...formData, pastEvents: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            placeholder="e.g. Techfest 2024, Hackathon 2025"
                        />
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-3 px-8 rounded-xl transition-all flex items-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {isLoading ? 'Saving...' : 'Save Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
