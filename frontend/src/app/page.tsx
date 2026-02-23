import Link from 'next/link';
import { ArrowRight, Sparkles, Handshake, Target, Rocket } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />

      <main className="w-full max-w-6xl mx-auto relative z-10 flex flex-col items-center text-center py-20">
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
          Stop relying on cold emails. SponsorBridge connects ambitious college clubs with top-tier brands looking for their next audience.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-24">
          <Link
            href="/register"
            className="group px-8 py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl text-lg font-semibold transition-all shadow-[0_0_40px_-10px_var(--color-indigo-500)] flex items-center"
          >
            Get Started Free
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl text-lg font-semibold transition-all backdrop-blur-md"
          >
            Sign In to Dashboard
          </Link>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full z-10">
          <div className="bg-slate-900 border border-white/5 rounded-3xl p-8 hover:border-indigo-500/50 transition-colors group">
            <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Rocket className="w-7 h-7 text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 text-left">For College Clubs</h3>
            <p className="text-slate-400 text-left leading-relaxed">
              Create beautiful event pages, define sponsorship tiers, and let the brands come to you. Manage all interactions in one dashboard.
            </p>
          </div>

          <div className="bg-slate-900 border border-white/5 rounded-3xl p-8 hover:border-blue-500/50 transition-colors group">
            <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Target className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 text-left">For Companies</h3>
            <p className="text-slate-400 text-left leading-relaxed">
              Filter events by footfall, location, and industry. Seamlessly sponsor the right audiences and track your campus marketing ROI.
            </p>
          </div>

          <div className="bg-slate-900 border border-white/5 rounded-3xl p-8 hover:border-emerald-500/50 transition-colors group">
            <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Handshake className="w-7 h-7 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 text-left">Deal Negotiation</h3>
            <p className="text-slate-400 text-left leading-relaxed">
              Use our built-in messenger to clarify deliverables, adjust sponsorship tiers, and finalize logistics with ease.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
