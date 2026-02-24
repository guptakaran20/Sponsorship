import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middlewares/auth';

export const getClubProfileView = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const viewerRole = req.user.role;
        const viewerId = req.user.id;

        const club = await prisma.clubProfile.findUnique({
            where: { id: id as string },
            include: { user: { select: { name: true } }, events: true }
        });

        if (!club) return res.status(404).json({ message: 'Club not found' });

        // Privacy rules: default to hidden contact details
        let showContact = false;

        // If the viewer is the same club, show details
        if (viewerRole === 'CLUB' && club.userId === viewerId) {
            showContact = true;
        } else if (viewerRole === 'COMPANY') {
            const company = await prisma.companyProfile.findUnique({ where: { userId: viewerId } });
            if (company) {
                // Check if they have a COMPLETED deal together
                const hasValidDeal = await prisma.sponsorshipDeal.findFirst({
                    where: {
                        companyId: company.id,
                        event: { clubId: club.id },
                        status: 'COMPLETED'
                    }
                });
                if (hasValidDeal) showContact = true;
            }
        }

        const profileData = {
            id: club.id,
            collegeName: club.collegeName,
            description: club.description,
            reach: club.reach,
            pastEvents: club.pastEvents,
            events: (club as any).events,
            totalAmountRaised: club.totalAmountRaised,
            ...(showContact && {
                contactPerson: club.contactPerson,
                contactNumber: club.contactNumber,
                socialLinks: club.socialLinks,
                website: club.website
            })
        };

        res.status(200).json(profileData);
    } catch (error) {
        console.error('Error fetching club public profile:', error);
        res.status(500).json({ message: 'Server error retrieving profile' });
    }
};

export const getCompanyProfileView = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const viewerRole = req.user.role;
        const viewerId = req.user.id;

        const company = await prisma.companyProfile.findUnique({
            where: { id: id as string },
            include: { user: { select: { name: true } } }
        });

        if (!company) return res.status(404).json({ message: 'Company not found' });

        let isVisible = false;
        let showContact = false;

        if (viewerRole === 'COMPANY' && company.userId === viewerId) {
            isVisible = true;
            showContact = true;
        } else if (viewerRole === 'CLUB') {
            isVisible = true; // Clubs can always see company basic details
            const club = await prisma.clubProfile.findUnique({ where: { userId: viewerId } });
            if (club) {
                // To see contact details, there must be a completed deal
                const dealContext = await prisma.sponsorshipDeal.findFirst({
                    where: {
                        companyId: company.id,
                        event: { clubId: club.id },
                        status: 'COMPLETED'
                    }
                });

                if (dealContext) {
                    showContact = true;
                }
            }
        }

        if (!isVisible) {
            return res.status(403).json({ message: 'You do not have permission to view this profile' });
        }

        const profileData = {
            id: company.id,
            userName: (company as any).user?.name,
            industry: company.industry,
            companySize: company.companySize,
            targetAudience: company.targetAudience,
            budgetRange: company.budgetRange,
            totalAmountSpent: company.totalAmountSpent,
            ...(showContact && {
                contactPerson: company.contactPerson,
                contactNumber: company.contactNumber,
                socialLinks: company.socialLinks,
                website: company.website
            })
        };

        res.status(200).json(profileData);
    } catch (error) {
        console.error('Error fetching company public profile:', error);
        res.status(500).json({ message: 'Server error retrieving profile' });
    }
};

// Leaderboard implementation for Homepage
export const getLeaderboard = async (req: Request, res: Response) => {
    try {
        const topClubs = await prisma.clubProfile.findMany({
            orderBy: { totalAmountRaised: 'desc' },
            take: 3,
            select: { id: true, collegeName: true, totalAmountRaised: true, reach: true }
        });

        const topCompanies = await prisma.companyProfile.findMany({
            orderBy: { totalAmountSpent: 'desc' },
            take: 3,
            select: { id: true, industry: true, totalAmountSpent: true, user: { select: { name: true } } }
        });

        res.status(200).json({ topClubs, topCompanies });
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching leaderboard' });
    }
};
