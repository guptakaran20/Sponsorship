'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getAuthToken, removeAuthToken } from '../lib/api';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ name: '', role: payload.role });
      } catch {
        setUser(null);
      }
    }
  }, []);

  const handleLogout = () => {
    removeAuthToken();
    setUser(null);
    router.push('/login');
  };

  const dashboardPath =
    user?.role === 'CLUB' ? '/club/dashboard' :
    user?.role === 'COMPANY' ? '/company/dashboard' :
    '/';

  return (
    <nav className="w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-white tracking-tight">
          SponsorBridge
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                href={dashboardPath}
                className="text-sm text-slate-300 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-sm px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl transition-all"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
