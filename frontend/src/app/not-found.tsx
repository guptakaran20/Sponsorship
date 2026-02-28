import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px]" />

      <div className="relative z-10 text-center max-w-lg">
        <h1 className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-purple-400 mb-4">
          404
        </h1>
        <h2 className="text-2xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-slate-400 mb-8 text-lg">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/25 inline-flex items-center"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-medium transition-all inline-flex items-center"
          >
            Contact Support
          </Link>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-sm">
          <Link href="/about" className="text-slate-400 hover:text-white transition-colors">About Us</Link>
          <span className="text-slate-700">•</span>
          <Link href="/login" className="text-slate-400 hover:text-white transition-colors">Sign In</Link>
          <span className="text-slate-700">•</span>
          <Link href="/register" className="text-slate-400 hover:text-white transition-colors">Get Started</Link>
        </div>
      </div>
    </div>
  );
}
