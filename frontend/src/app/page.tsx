'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Target, Rocket, Trophy, Building2, ShieldCheck } from 'lucide-react';
import { Analytics } from "@vercel/analytics/next"

export default function Home() {
  const [topClubs, setTopClubs] = useState<any[]>([]);
  const [topCompanies, setTopCompanies] = useState<any[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/public/leaderboard`);
        if (res.ok) {
          const data = await res.json();
          setTopClubs(data.topClubs || []);
          setTopCompanies(data.topCompanies || []);
        }
      } catch (err) {
        console.error("Failed to fetch leaderboard", err);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-start overflow-x-hidden relative">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />

      <main className="w-full max-w-6xl mx-auto relative z-10 flex flex-col items-center text-center py-20 px-4">
        {/* Badge */}
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-indigo-400 mr-2" />
          <span className="text-sm font-medium text-slate-300">Connecting Campus Innovation with Industry</span>
        </div>

        {/* Hero Section */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white via-indigo-200 to-indigo-600 tracking-tight mb-8 leading-tight">
          The Two-Sided Marketplace <br className="hidden md:block" /> for College Sponsorships
        </h1>

        <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mb-12 font-light">
          Stop relying on cold emails. SponsorGrid connects ambitious college clubs with top-tier brands looking for their next audience.
        </p>

        {/* Value Proposition */}
        <p className="text-base text-indigo-400 font-medium mb-12 tracking-wide">
          The smartest way for college clubs to find brand sponsors — and for brands to reach Gen-Z.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-16">
          <Link
            href="/register"
            className="group px-8 py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl text-lg font-semibold transition-all shadow-[0_0_40px_-10px_var(--color-indigo-500)] flex items-center"
          >
            List Your Event
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/register"
            className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl text-lg font-semibold transition-all backdrop-blur-md"
          >
            Find Events to Sponsor
          </Link>
        </div>

        <button
          onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
          className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center gap-2 mb-24 transition-colors cursor-pointer"
        >
          See How It Works
          <ArrowRight className="w-4 h-4 rotate-90" />
        </button>

        {/* Social Proof Stats */}
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full mb-24">
          <div className="text-center p-6 bg-white/5 border border-white/5 rounded-2xl backdrop-blur-md">
            <p className="text-3xl font-bold text-white">500+</p>
            <p className="text-sm text-slate-400 mt-1">Clubs Connected</p>
          </div>
          <div className="text-center p-6 bg-white/5 border border-white/5 rounded-2xl backdrop-blur-md">
            <p className="text-3xl font-bold text-white">₹2Cr+</p>
            <p className="text-sm text-slate-400 mt-1">Sponsorships Facilitated</p>
          </div>
          <div className="text-center p-6 bg-white/5 border border-white/5 rounded-2xl backdrop-blur-md">
            <p className="text-3xl font-bold text-white">50+</p>
            <p className="text-sm text-slate-400 mt-1">Brand Partners</p>
          </div>
          <div className="text-center p-6 bg-white/5 border border-white/5 rounded-2xl backdrop-blur-md">
            <p className="text-3xl font-bold text-white">95%</p>
            <p className="text-sm text-slate-400 mt-1">Deal Success Rate</p>
          </div>
        </div> */}

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full z-10 mb-24">
          <div className="bg-slate-900 border border-white/5 rounded-3xl p-8 hover:border-indigo-500/50 transition-colors group">
            <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Rocket className="w-7 h-7 text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 text-left">Attract Top Sponsors</h3>
            <p className="text-slate-400 text-left leading-relaxed">
              Stop chasing cold emails. Create beautiful event pages, define sponsorship tiers, and let brands come to you — all from one dashboard.
            </p>
          </div>

          <div className="bg-slate-900 border border-white/5 rounded-3xl p-8 hover:border-blue-500/50 transition-colors group">
            <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Target className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 text-left">Reach Gen-Z Audiences</h3>
            <p className="text-slate-400 text-left leading-relaxed">
              Discover high-impact campus events filtered by footfall, location, and industry. Sponsor the right audiences and track your campus marketing ROI.
            </p>
          </div>

          <div className="bg-slate-900 border border-white/5 rounded-3xl p-8 hover:border-emerald-500/50 transition-colors group">
            <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-7 h-7 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 text-left">Fraud-Free Deals</h3>
            <p className="text-slate-400 text-left leading-relaxed">
              Every deal is secured with PIN verification. Both parties get exactly what they agreed upon in a transparent, trustworthy environment.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div id="how-it-works" className="w-full max-w-5xl text-center mb-24 scroll-mt-24">
          <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-slate-400 mb-12">Get started in three simple steps</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-indigo-500/30">
                <span className="text-2xl font-bold text-indigo-400">1</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Create Profile</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Sign up as a club or company. Set up your profile to showcase your brand and goals.
              </p>
            </div>
            <div className="relative">
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-500/30">
                <span className="text-2xl font-bold text-blue-400">2</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Discover Matches</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Clubs post events with sponsorship tiers. Companies browse, filter, and find perfect opportunities.
              </p>
            </div>
            <div className="relative">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
                <span className="text-2xl font-bold text-emerald-400">3</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Close the Deal</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Accept proposals, verify with a secure PIN, and complete the sponsorship. It&apos;s that simple.
              </p>
            </div>
          </div>
        </div>

        {/* Leaderboards */}
        <div className="w-full max-w-5xl text-left mb-24 space-y-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">SponsorGrid Leaderboard</h2>
            <p className="text-slate-400">Recognizing the most active clubs and brands on our platform.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Top Clubs */}
            <div className="bg-slate-900 border border-indigo-500/20 rounded-3xl p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
              <div className="flex items-center mb-6 relative z-10">
                <Trophy className="w-6 h-6 text-yellow-400 mr-3" />
                <h3 className="text-2xl font-bold text-white">Top Sponsored Clubs</h3>
              </div>
              <div className="space-y-4 relative z-10">
                {topClubs.length > 0 ? topClubs.map((club, idx) => (
                  <div key={club.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold mr-4 border border-indigo-500/30">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="text-white font-semibold">{club.collegeName}</p>
                        <p className="text-xs text-slate-400">{club.reach.toLocaleString()} members</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-400 font-bold">₹{club.totalAmountRaised.toLocaleString()}</p>
                      <p className="text-xs text-slate-500">Raised</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-slate-500 text-sm text-center py-8">No club data available yet.</p>
                )}
              </div>
            </div>

            {/* Top Companies */}
            <div className="bg-slate-900 border border-blue-500/20 rounded-3xl p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
              <div className="flex items-center mb-6 relative z-10">
                <Building2 className="w-6 h-6 text-blue-400 mr-3" />
                <h3 className="text-2xl font-bold text-white">Top Sponsoring Brands</h3>
              </div>
              <div className="space-y-4 relative z-10">
                {topCompanies.length > 0 ? topCompanies.map((company, idx) => (
                  <div key={company.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold mr-4 border border-blue-500/30">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="text-white font-semibold">{company.user?.name || 'Company'}</p>
                        <p className="text-xs text-slate-400">{company.industry || 'General'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-400 font-bold">₹{company.totalAmountSpent.toLocaleString()}</p>
                      <p className="text-xs text-slate-500">Invested</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-slate-500 text-sm text-center py-8">No brand data available yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 bg-slate-950/80 backdrop-blur-lg py-8 z-20">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <span className="text-xl font-bold text-white tracking-tight">SponsorGrid</span>
          </div>
          <div className="flex flex-wrap items-center gap-6 justify-center">
            <Analytics />
            <Link href="/about" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">About Us</Link>
            <Link href="/contact" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Contact Us</Link>
            <a href="https://instagram.com/sponsor.grid" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-pink-500 transition-colors" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
