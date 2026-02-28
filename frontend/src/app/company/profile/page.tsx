'use client';

import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';
import { Building2, Save, Target, DollarSign, Users, Globe, Phone, User, Link as LinkIcon, Info } from 'lucide-react';

export default function CompanyProfilePage() {
    const [formData, setFormData] = useState({
        industry: 'Technology',
        customIndustry: '',
        about: '',
        budgetRange: '',
        targetAudience: '',
        companySize: '',
        website: '',
        contactPerson: '',
        contactNumber: '',
        socialLinks: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const profile = await fetchApi('/companies/profile');
                if (profile) {
                    const knownIndustries = ['Technology', 'Finance', 'FMCG', 'EdTech', 'Retail'];
                    const savedIndustry = profile.industry || 'Technology';
                    const isOther = !knownIndustries.includes(savedIndustry);

                    setFormData({
                        industry: isOther ? 'Other' : savedIndustry,
                        customIndustry: isOther ? savedIndustry : '',
                        about: profile.about || '',
                        budgetRange: profile.budgetRange || '',
                        targetAudience: profile.targetAudience || '',
                        companySize: profile.companySize || '',
                        website: profile.website || '',
                        contactPerson: profile.contactPerson || '',
                        contactNumber: profile.contactNumber || '',
                        socialLinks: profile.socialLinks || '',
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
            const payload = {
                ...formData,
                industry: formData.industry === 'Other' ? formData.customIndustry : formData.industry,
            };
            // Remove customIndustry from payload — it's a UI-only field
            const { customIndustry, ...submitData } = payload;

            await fetchApi('/companies/profile', {
                method: 'POST',
                body: JSON.stringify(submitData),
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
                            onChange={(e) => setFormData({ ...formData, industry: e.target.value, customIndustry: e.target.value !== 'Other' ? '' : formData.customIndustry })}
                            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
                        >
                            <option className="bg-slate-900">Technology</option>
                            <option className="bg-slate-900">Finance</option>
                            <option className="bg-slate-900">FMCG</option>
                            <option className="bg-slate-900">EdTech</option>
                            <option className="bg-slate-900">Retail</option>
                            <option className="bg-slate-900">Other</option>
                        </select>
                        {formData.industry === 'Other' && (
                            <input
                                type="text"
                                value={formData.customIndustry}
                                onChange={(e) => setFormData({ ...formData, customIndustry: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all mt-2"
                                placeholder="Enter your industry"
                                required
                            />
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 flex items-center">
                            <Info className="w-4 h-4 mr-2 text-indigo-400" />
                            About Company
                        </label>
                        <textarea
                            value={formData.about}
                            onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                            rows={4}
                            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                            placeholder="Tell clubs about your company's mission and goals..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 flex items-center">
                            <DollarSign className="w-4 h-4 mr-2 text-indigo-400" />
                            Sponsorship Budget Range
                        </label>
                        <select
                            value={formData.budgetRange}
                            onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
                        >
                            <option value="" className="bg-slate-900">Select a range</option>
                            <option value="₹10k - ₹50k" className="bg-slate-900">₹10,000 - ₹50,000</option>
                            <option value="₹50k - ₹2L" className="bg-slate-900">₹50,000 - ₹2,00,000</option>
                            <option value="₹2L+" className="bg-slate-900">₹2,00,000+</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 flex items-center">
                            <Target className="w-4 h-4 mr-2 text-indigo-400" />
                            Target Audience
                        </label>
                        <select
                            value={formData.targetAudience}
                            onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
                        >
                            <option value="" className="bg-slate-900">Select target audience</option>
                            <option value="Tech Fest" className="bg-slate-900">Tech Fest</option>
                            <option value="Hackathon" className="bg-slate-900">Hackathon</option>
                            <option value="Cultural Fest" className="bg-slate-900">Cultural Fest</option>
                            <option value="Workshop" className="bg-slate-900">Workshop</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 flex items-center">
                            <Users className="w-4 h-4 mr-2 text-indigo-400" />
                            Company Size
                        </label>
                        <select
                            value={formData.companySize}
                            onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
                        >
                            <option value="" className="bg-slate-900">Select size</option>
                            <option value="1-10" className="bg-slate-900">1-10 Employees</option>
                            <option value="11-50" className="bg-slate-900">11-50 Employees</option>
                            <option value="51-200" className="bg-slate-900">51-200 Employees</option>
                            <option value="201-1000" className="bg-slate-900">201-1000 Employees</option>
                            <option value="1000+" className="bg-slate-900">1000+ Employees</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 flex items-center">
                            <Globe className="w-4 h-4 mr-2 text-indigo-400" />
                            Company Website
                        </label>
                        <input
                            type="url"
                            value={formData.website}
                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            placeholder="https://yourcompany.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 flex items-center">
                            <User className="w-4 h-4 mr-2 text-indigo-400" />
                            Contact Person Name
                        </label>
                        <input
                            type="text"
                            value={formData.contactPerson}
                            onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            placeholder="John Doe"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 flex items-center">
                            <Phone className="w-4 h-4 mr-2 text-indigo-400" />
                            Contact Number
                        </label>
                        <input
                            type="tel"
                            value={formData.contactNumber}
                            onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            placeholder="+91 9876543210"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 flex items-center">
                            <LinkIcon className="w-4 h-4 mr-2 text-indigo-400" />
                            Social Media Links / LinkedIn
                        </label>
                        <input
                            type="text"
                            value={formData.socialLinks}
                            onChange={(e) => setFormData({ ...formData, socialLinks: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            placeholder="https://linkedin.com/company/..."
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
