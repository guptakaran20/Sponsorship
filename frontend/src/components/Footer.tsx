import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-slate-950/80 backdrop-blur-lg py-8 z-20">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center">
          <span className="text-xl font-bold text-white tracking-tight">SponsorBridge</span>
        </div>
        <div className="flex flex-wrap items-center gap-6 justify-center">
          <Link href="/about" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">
            About Us
          </Link>
          <Link href="/contact" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">
            Contact Us
          </Link>
          <a
            href="https://instagram.com/sponsorbridge"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-pink-500 transition-colors"
            aria-label="Instagram"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
          </a>
        </div>
        <p className="text-slate-500 text-xs">© {new Date().getFullYear()} SponsorBridge. All rights reserved.</p>
      </div>
    </footer>
  );
}
