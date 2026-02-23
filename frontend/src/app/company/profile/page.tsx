'use client';

import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';
import { Building2, Save, Target, DollarSign } from 'lucide-react';

export default function CompanyProfilePage() {
    const [formData, setFormData] = useState({
        industry: 'Technology',
        budgetRange: '',
        targetAudience: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const profile = await fetchApi('/companies/profile');
                if (profile) {
                    setFormData({
                        industry: profile.industry || 'Technology',
                        budgetRange: profile.budgetRange || '',
                        targetAudience: profile.targetAudience || '',
                    });
                }
            } catch (error) {
                // Profile might not exist yet, that's OK
            } finally {
                setIsFetching(false);
            }
        };
        loadProfile();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await fetchApi('/companies/profile', {
                method: 'POST',
                body: JSON.stringify(formData),
            });

            setMessage({ type: 'success', text: 'Brand Profile updated successfully!' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return <div className="animate-pulse h-64 bg-slate-900 rounded-3xl" />;
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Brand Profile</h1>
                <p className="text-slate-400">Set up your preferences to find the best college events.</p>
            </div>

            <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 lg:p-8 shadow-xl">
                {message.text && (
                    <div className={`p-4 rounded-xl mb-6 border ${message.type === 'success'
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : 'bg-red-500/10 border-red-500/20 text-red-400'
                        }`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 flex items-center">
                            <Building2 className="w-4 h-4 mr-2 text-indigo-400" />
                            Industry
                        </label>
                        <select
                            value={formData.industry}
                            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
                        >
                            <option className="bg-slate-900">Technology</option>
                            <option className="bg-slate-900">Finance</option>
                            <option className="bg-slate-900">FMCG</option>
                            <option className="bg-slate-900">EdTech</option>
                            <option className="bg-slate-900">Retail</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 flex items-center">
                            <DollarSign className="w-4 h-4 mr-2 text-indigo-400" />
                            Annual Sponsorship Budget Range
                        </label>
                        <select
                            value={formData.budgetRange}
                            onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
                        >
                            <option value="" className="bg-slate-900">Select a range</option>
                            <option value="$1k - $5k" className="bg-slate-900">$1,000 - $5,000</option>
                            <option value="$5k - $20k" className="bg-slate-900">$5,000 - $20,000</option>
                            <option value="$20k+" className="bg-slate-900">$20,000+</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 flex items-center">
                            <Target className="w-4 h-4 mr-2 text-indigo-400" />
                            Target Audience
                        </label>
                        <textarea
                            value={formData.targetAudience}
                            onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                            rows={3}
                            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                            placeholder="e.g. Computer Science Undergrads, Designers..."
                        />
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-3 px-8 rounded-xl transition-all flex items-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {isLoading ? 'Saving...' : 'Save Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
