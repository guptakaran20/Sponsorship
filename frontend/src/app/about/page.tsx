import Link from 'next/link';
import { ArrowLeft, Building2, Users, ShieldCheck, Zap } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-slate-950 p-4 lg:p-8">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="py-4">
                    <Link href="/" className="text-slate-400 hover:text-white flex items-center transition-colors w-fit">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                </div>

                <div className="text-center space-y-6 pb-8 border-b border-white/10">
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">About SponsorBridge</h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        We are building the future of campus sponsorships by connecting innovative college clubs with industry-leading brands.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-8">
                    <div className="space-y-6">
                        <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                            <Zap className="w-6 h-6 text-indigo-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Our Mission</h2>
                        <p className="text-slate-400 leading-relaxed text-lg">
                            To decentralize and democratize college marketing. We believe that every driven student organization deserves the funding to execute their vision, and every brand deserves direct access to the most passionate innovators on campuses nationwide.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                            <ShieldCheck className="w-6 h-6 text-emerald-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Trust & Security</h2>
                        <p className="text-slate-400 leading-relaxed text-lg">
                            Transparency is at our core. With secure deal PIN verifications, clear terms, and direct communication channels, we ensure that both clubs and companies get exactly what they agreed upon in a completely fraud-free environment.
                        </p>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-slate-900 to-indigo-950/30 border border-white/5 rounded-3xl p-8 lg:p-12 text-center mt-12">
                    <h2 className="text-3xl font-bold text-white mb-6">Ready to transform your events?</h2>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/register" className="px-8 py-4 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-500/25">
                            Join SponsorBridge Today
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
