'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

const pathLabels: Record<string, string> = {
  club: 'Club',
  company: 'Company',
  dashboard: 'Dashboard',
  events: 'Events',
  sponsorships: 'Sponsorships',
  profile: 'Profile',
  discover: 'Discover Events',
  new: 'New Event',
  edit: 'Edit',
};

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length <= 1) return null;

  const crumbs = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const label = pathLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    const isLast = index === segments.length - 1;
    return { href, label, isLast };
  });

  return (
    <nav className="flex items-center gap-1.5 text-sm mb-6 overflow-x-auto">
      <Link href="/" className="text-slate-500 hover:text-slate-300 transition-colors shrink-0">
        <Home className="w-3.5 h-3.5" />
      </Link>
      {crumbs.map((crumb) => (
        <span key={crumb.href} className="flex items-center gap-1.5 shrink-0">
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          {crumb.isLast ? (
            <span className="text-slate-300 font-medium">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="text-slate-500 hover:text-slate-300 transition-colors">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
