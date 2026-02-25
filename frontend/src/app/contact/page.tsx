'use client';

import Link from 'next/link';
import { ArrowLeft, Mail, MapPin, Phone } from 'lucide-react';

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-slate-950 p-4 lg:p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="py-4">
                    <Link href="/" className="text-slate-400 hover:text-white flex items-center transition-colors w-fit">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-8 lg:pr-8">
                        <div>
                            <h1 className="text-4xl font-bold text-white tracking-tight mb-4">Get in Touch</h1>
                            <p className="text-slate-400 text-lg leading-relaxed">
                                Whether you're a club looking to onboard, a brand wanting a custom enterprise plan, or just saying hi—we'd love to hear from you.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start">
                                <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center shrink-0 mr-4">
                                    <Mail className="w-5 h-5 text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold text-lg">Email Us</h3>
                                    <p className="text-slate-400">Our team will respond within 24 hours.</p>
                                    <a href="mailto:hello@sponsorbridge.com" className="text-indigo-400 hover:text-indigo-300 font-medium mt-1 inline-block">hello@sponsorbridge.com</a>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center shrink-0 mr-4">
                                    <Phone className="w-5 h-5 text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold text-lg">Call Us</h3>
                                    <p className="text-slate-400">Mon-Fri from 9am to 6pm IST.</p>
                                    <p className="text-indigo-400 font-medium mt-1">+91 (123) 456-7890</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center shrink-0 mr-4">
                                    <MapPin className="w-5 h-5 text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold text-lg">Office</h3>
                                    <p className="text-slate-400">Come say hello at our HQ.</p>
                                    <p className="text-slate-300 mt-1">
                                        Innovation Hub, Plot No. 42<br />
                                        Tech Park, Bengaluru, India 560001
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-white/5 rounded-3xl p-8 shadow-xl">
                        <h2 className="text-2xl font-bold text-white mb-6">Send a Message</h2>
                        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Thanks for reaching out! This forms is for demo purposes."); }}>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Name</label>
                                <input type="text" className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-indigo-500 transition-colors" placeholder="John Doe" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Email</label>
                                <input type="email" className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-indigo-500 transition-colors" placeholder="john@example.com" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Message</label>
                                <textarea rows={4} className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none" placeholder="How can we help you?" required></textarea>
                            </div>
                            <button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-3 rounded-xl transition-colors shadow-lg shadow-indigo-500/25 mt-2">
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
