'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, MapPin, Phone, CheckCircle2 } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function ContactPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            await fetchApi('/public/contact', {
                method: 'POST',
                body: JSON.stringify({ name, email, message })
            });
            setSuccessMessage('Thank you for reaching out! Your message has been sent successfully.');
            setName('');
            setEmail('');
            setMessage('');
        } catch (error: any) {
            setErrorMessage(error.message || 'Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

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
                        {successMessage && (
                            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 flex items-center mb-6">
                                <CheckCircle2 className="w-5 h-5 mr-3 shrink-0" />
                                {successMessage}
                            </div>
                        )}
                        {errorMessage && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 mb-6">
                                {errorMessage}
                            </div>
                        )}
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Message</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    rows={4}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                                    placeholder="How can we help you?"
                                    required
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-800 disabled:text-slate-500 text-white font-medium py-3 rounded-xl transition-colors shadow-lg shadow-indigo-500/25 mt-2"
                            >
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
