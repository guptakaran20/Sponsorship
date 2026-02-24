'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { Calendar, Users, Briefcase, ChevronRight, TrendingUp, Compass, Search } from 'lucide-react';

export default function CompanyDashboardPage() {
    const [profile, setProfile] = useState<any>(null);
    const [deals, setDeals] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const [profData, dealsData] = await Promise.all([
                    fetchApi('/companies/profile').catch(() => null),
                    fetchApi('/deals')
                ]);

                setProfile(profData);
                setDeals(dealsData || []);
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
    const activeSponsorships = deals.filter(d => d.status === 'ACCEPTED').length;
    const pendingRequests = deals.filter(d => d.status === 'PENDING').length;
    const totalInvested = profile?.totalAmountSpent || 0;

    return (
        <div className="space-y-8 pb-12">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-900/50 to-indigo-900/50 border border-white/5 rounded-3xl p-8 lg:p-10 shadow-xl">
                <div className="absolute top-0 right-0 p-8 opacity-20 hidden md:block">
                    <Compass className="w-32 h-32 text-white" />
                </div>
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
                        Welcome to SponsorBridge Business
                    </h1>
                    <p className="text-blue-200 max-w-xl text-lg">
                        Monitor your campus outreach and manage active sponsorships.
                    </p>
                    {!profile && (
                        <div className="mt-6 flex items-center">
                            <span className="text-amber-400 bg-amber-400/10 px-4 py-2 rounded-xl text-sm border border-amber-400/20 font-medium mr-4">
                                Action Required: Compete your Brand Profile
                            </span>
                            <Link href="/company/profile" className="text-blue-400 hover:text-blue-300 font-medium underline">
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
                            <p className="text-sm font-medium text-slate-400 mb-1">Active Sponsorships</p>
                            <h3 className="text-4xl font-bold text-white">{activeSponsorships}</h3>
                        </div>
                        <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400">
                            <Briefcase className="w-6 h-6" />
                        </div>
                    </div>
                    <Link href="/company/sponsorships" className="inline-flex items-center text-sm text-indigo-400 hover:text-indigo-300">
                        View campaigns <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                </div>

                <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-slate-400 mb-1">Total Invested</p>
                            <h3 className="text-4xl font-bold text-white">₹{totalInvested}</h3>
                        </div>
                        <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="flex items-center text-sm">
                        <span className="text-slate-500">Across {activeSponsorships} events</span>
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
                    <div className="flex items-center text-sm">
                        <span className="text-slate-500">Awaiting club approval</span>
                    </div>
                </div>
            </div>

            {/* Discover Action */}
            <div className="bg-slate-900 border border-white/5 rounded-3xl p-8 shadow-xl">
                <div className="flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Find Your Next Campus Event</h2>
                        <p className="text-slate-400 max-w-2xl">
                            Browse top-tier college hackathons, cultural fests, and tech events looking for sponsors.
                            Filter by industry, location, and footfall to find the perfect match for your brand.
                        </p>
                    </div>
                    <Link
                        href="/company/discover"
                        className="shrink-0 px-8 py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-lg font-medium transition-all inline-flex items-center shadow-lg shadow-indigo-500/25"
                    >
                        <Search className="w-5 h-5 mr-3" />
                        Discover Events
                    </Link>
                </div>
            </div>
        </div>
    );
}
