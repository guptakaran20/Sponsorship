'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { Building2, Users, ArrowLeft, Calendar, Link as LinkIcon, Phone, Mail, User } from 'lucide-react';
import Link from 'next/link';

export default function PublicClubProfilePage() {
    const params = useParams();
    const router = useRouter();
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await fetchApi(`/public/club/${params.id}`);
                setProfile(data);
            } catch (err: any) {
                console.error("Failed to fetch club profile", err);
                setError(err.message || 'Failed to load profile');
            } finally {
                setIsLoading(false);
            }
        };

        if (params.id) {
            fetchProfile();
        }
    }, [params.id]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 p-8 flex justify-center items-center">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen bg-slate-950 p-8">
                <button onClick={() => router.back()} className="text-slate-400 hover:text-white flex items-center mb-8">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Go Back
                </button>
                <div className="text-center py-20 bg-slate-900 border border-dashed border-white/10 rounded-3xl max-w-2xl mx-auto">
                    <h3 className="text-xl font-medium text-white mb-2">{error || 'Profile Not Found'}</h3>
                    <p className="text-slate-400">You might not have permission to view this profile, or it doesn't exist.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 p-4 lg:p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <button onClick={() => router.back()} className="text-slate-400 hover:text-white flex items-center transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </button>

                <div className="bg-slate-900 border border-white/5 rounded-3xl overflow-hidden shadow-xl">
                    <div className="h-32 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 px-8 flex items-end pb-6">
                        <div className="w-24 h-24 bg-indigo-500 rounded-2xl flex items-center justify-center text-4xl font-bold text-white shadow-lg translate-y-12 border-4 border-slate-900 overflow-hidden">
                            {profile.profilePhoto ? (
                                <img src={profile.profilePhoto} alt={profile.collegeName} className="w-full h-full object-cover" />
                            ) : (
                                profile.collegeName.charAt(0)
                            )}
                        </div>
                    </div>

                    <div className="pt-16 pb-8 px-8 border-b border-white/5">
                        <h1 className="text-3xl font-bold text-white mb-2">{profile.name || profile.collegeName}</h1>
                        <p className="text-slate-400 max-w-2xl">{profile.description || 'No description provided.'}</p>
                        {profile.about && (
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold text-white mb-2">About Us</h3>
                                <p className="text-slate-300 max-w-3xl leading-relaxed whitespace-pre-wrap">{profile.about}</p>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                    <Building2 className="w-5 h-5 mr-2 text-indigo-400" />
                                    Club Details
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center text-slate-300">
                                        <Building2 className="w-4 h-4 mr-3 text-slate-500" />
                                        <span>College: <strong className="text-white">{profile.collegeName}</strong></span>
                                    </div>
                                    <div className="flex items-center text-slate-300">
                                        <Users className="w-4 h-4 mr-3 text-slate-500" />
                                        <span>Total Reach: <strong className="text-white">{profile.reach.toLocaleString()}</strong></span>
                                    </div>
                                    <div className="flex items-center text-slate-300">
                                        <Calendar className="w-4 h-4 mr-3 text-slate-500" />
                                        <span>Past Events: <strong className="text-white">{profile.pastEvents || 'None listed'}</strong></span>
                                    </div>
                                </div>
                            </div>

                            {profile.contactPerson && (
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                        <Phone className="w-5 h-5 mr-2 text-emerald-400" />
                                        Contact Information
                                    </h3>
                                    <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 space-y-3">
                                        <div className="flex items-center text-slate-300">
                                            <User className="w-4 h-4 mr-3 text-emerald-500/70" />
                                            <span>{profile.contactPerson}</span>
                                        </div>
                                        <div className="flex items-center text-slate-300">
                                            <Phone className="w-4 h-4 mr-3 text-emerald-500/70" />
                                            <span>{profile.contactNumber}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-6">
                            {(profile.website || profile.socialLinks) && (
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                        <LinkIcon className="w-5 h-5 mr-2 text-indigo-400" />
                                        Links
                                    </h3>
                                    <div className="space-y-3">
                                        {profile.website && (
                                            <a href={profile.website} target="_blank" rel="noreferrer" className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors">
                                                <LinkIcon className="w-4 h-4 mr-3" />
                                                Website
                                            </a>
                                        )}
                                        {profile.socialLinks && (
                                            <p className="text-slate-300 text-sm">{profile.socialLinks}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                    <Calendar className="w-5 h-5 mr-2 text-indigo-400" />
                                    Active Events
                                </h3>
                                {profile.events && profile.events.length > 0 ? (
                                    <div className="space-y-3">
                                        {profile.events.map((event: any) => (
                                            <div key={event.id} className="bg-white/5 border border-white/5 rounded-xl p-4 hover:border-indigo-500/30 transition-colors">
                                                <h4 className="font-medium text-white">{event.name}</h4>
                                                <p className="text-sm text-slate-400 mt-1">{new Date(event.date).toLocaleDateString()}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-slate-500 text-sm">No active events hosted directly by this club.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
