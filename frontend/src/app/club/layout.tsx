'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import {
    LayoutDashboard,
    CalendarDays,
    Handshake,
    Settings,
    LogOut,
    Bell,
    Sparkles,
    Menu,
    X
} from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function ClubLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetchApi('/auth/me');
                const u = res?.data;
                if (!u || u.role !== 'CLUB') {
                    router.push(u ? '/company/dashboard' : '/login');
                } else {
                    setUser(u);
                    fetchNotifications();
                }
            } catch (e) {
                router.push('/login');
            }
        };

        const fetchNotifications = async () => {
            try {
                const data = await fetchApi('/notifications');
                setNotifications(data || []);
            } catch (e) {
                console.error("Failed to load notifications");
            }
        };

        checkAuth();
    }, [router]);

    const handleMarkAsRead = async (id: string) => {
        try {
            await fetchApi(`/notifications/${id}/read`, { method: 'PUT' });
            setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (e) { }
    };

    const handleMarkAllRead = async () => {
        try {
            await fetchApi(`/notifications/mark-all-read`, { method: 'PUT' });
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        } catch (e) { }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const handleLogout = async () => {
        try {
            await fetchApi('/auth/logout', { method: 'POST' });
        } catch (e) { }
        router.push('/login');
    };

    const navItems = [
        { name: 'Dashboard', href: '/club/dashboard', icon: LayoutDashboard },
        { name: 'My Events', href: '/club/events', icon: CalendarDays },
        { name: 'Sponsorships', href: '/club/sponsorships', icon: Handshake },
        { name: 'Profile Setup', href: '/club/profile', icon: Settings },
    ];

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 flex">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-white/5 transform transition-transform duration-300 ease-in-out flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                <div className="h-20 flex items-center px-8 border-b border-white/5">
                    <Sparkles className="w-6 h-6 text-indigo-400 mr-3" />
                    <span className="text-xl font-bold text-white tracking-tight">SponsorBridge</span>
                </div>

                <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center px-4 py-3 rounded-xl transition-all ${isActive
                                    ? 'bg-indigo-500/10 text-indigo-400'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <div className="flex items-center px-4 py-3 mb-2 rounded-xl bg-white/5">
                        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold mr-3">
                            {user.name.charAt(0)}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium text-white truncate">{user.name}</p>
                            <p className="text-xs text-slate-500 truncate">Club Admin</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all font-medium"
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Top Header */}
                <header className="h-20 bg-slate-900/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 lg:px-8 z-30 shrink-0">
                    <button
                        className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="flex items-center ml-auto relative">
                        <button
                            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-all relative"
                        >
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full border border-slate-900"></span>
                            )}
                        </button>

                        {isNotificationsOpen && (
                            <div className="absolute top-full right-0 mt-2 w-80 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[80vh]">
                                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-800/50">
                                    <h3 className="font-semibold text-white">Notifications</h3>
                                    {unreadCount > 0 && (
                                        <button onClick={handleMarkAllRead} className="text-xs text-indigo-400 hover:text-indigo-300">
                                            Mark all read
                                        </button>
                                    )}
                                </div>
                                <div className="overflow-y-auto flex-1 p-2 space-y-1">
                                    {notifications.length === 0 ? (
                                        <div className="p-4 text-center text-slate-500 text-sm">No notifications yet</div>
                                    ) : (
                                        notifications.map(notif => (
                                            <div
                                                key={notif.id}
                                                onClick={() => !notif.isRead && handleMarkAsRead(notif.id)}
                                                className={`p-3 rounded-xl transition-colors cursor-pointer ${notif.isRead ? 'opacity-70 hover:bg-white/5' : 'bg-indigo-500/10 hover:bg-indigo-500/20'
                                                    }`}
                                            >
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className={`text-sm ${notif.isRead ? 'text-slate-300 font-medium' : 'text-indigo-300 font-semibold'}`}>
                                                        {notif.title}
                                                    </h4>
                                                    {!notif.isRead && <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-1"></span>}
                                                </div>
                                                <p className="text-xs text-slate-400 line-clamp-2">{notif.message}</p>
                                                <p className="text-[10px] text-slate-500 mt-2">
                                                    {new Date(notif.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto p-4 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        <Breadcrumbs />
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
