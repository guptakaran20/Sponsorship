import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middlewares/auth';



export const createDeal = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;
        const { eventId, tierId } = req.body;

        if (!eventId || !tierId) {
            return res.status(400).json({ message: 'Event ID and Tier ID are required' });
        }

        const companyProfile = await prisma.companyProfile.findUnique({
            where: { userId }
        });

        if (!companyProfile) {
            return res.status(400).json({ message: 'Company profile must be created to send requests' });
        }

        // Check if event and tier exist
        const tier = await prisma.sponsorshipTier.findUnique({ where: { id: tierId } });
        if (!tier || tier.eventId !== eventId) {
            return res.status(400).json({ message: 'Invalid tier or event' });
        }

        // Check if already applied
        const existingDeal = await prisma.sponsorshipDeal.findFirst({
            where: { companyId: companyProfile.id, eventId, tierId }
        });

        if (existingDeal) {
            return res.status(400).json({ message: 'You have already applied for this tier' });
        }

        const deal = await prisma.sponsorshipDeal.create({
            data: {
                eventId,
                companyId: companyProfile.id,
                tierId,
                status: 'PENDING',
                paymentStatus: 'UNPAID'
            },
            include: { event: { include: { club: true } } }
        });

        // Notify the Club
        if (deal.event.club.userId) {
            await prisma.notification.create({
                data: {
                    userId: deal.event.club.userId,
                    title: 'New Sponsorship Request',
                    message: `${companyProfile.industry || 'A company'} wants to sponsor ${deal.event.name} for ₹${tier.amount}.`
                }
            });
        }

        res.status(201).json(deal);
    } catch (error) {
        console.error('Error creating deal:', error);
        res.status(500).json({ message: 'Server error creating sponsorship deal' });
    }
};

export const getDeals = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;

        let deals: any[] = [];

        if (role === 'COMPANY') {
            const companyProfile = await prisma.companyProfile.findUnique({ where: { userId } });
            if (companyProfile) {
                deals = await prisma.sponsorshipDeal.findMany({
                    where: { companyId: companyProfile.id },
                    include: {
                        event: { include: { club: true } },
                        tier: true
                    },
                    orderBy: { createdAt: 'desc' }
                });
            }
        } else if (role === 'CLUB') {
            const clubProfile = await prisma.clubProfile.findUnique({ where: { userId } });
            if (clubProfile) {
                // Find all events for this club
                const events = await prisma.event.findMany({ where: { clubId: clubProfile.id } });
                const eventIds = events.map((e: any) => e.id);

                deals = await prisma.sponsorshipDeal.findMany({
                    where: { eventId: { in: eventIds } },
                    include: {
                        company: true,
                        event: true,
                        tier: true
                    },
                    orderBy: { createdAt: 'desc' }
                });
            }
        }

        const sanitizedDeals = deals.map((deal: any) => {
            const isContactVisibleForCompany = ['ACCEPTED', 'COMPLETED'].includes(deal.status);
            const isContactVisibleForClub = ['PENDING', 'ACCEPTED', 'COMPLETED'].includes(deal.status);

            if (role === 'COMPANY' && !isContactVisibleForCompany && deal.event?.club) {
                deal.event.club.contactPerson = null;
                deal.event.club.contactNumber = null;
                deal.event.club.website = null;
                deal.event.club.socialLinks = null;
            }
            if (role === 'CLUB' && !isContactVisibleForClub && deal.company) {
                deal.company.contactPerson = null;
                deal.company.contactNumber = null;
                deal.company.website = null;
                deal.company.socialLinks = null;
            }
            if (role === 'CLUB') {
                deal.dealPin = null;
            }

            return deal;
        });

        res.status(200).json(sanitizedDeals);
    } catch (error) {
        console.error('Error fetching deals:', error);
        res.status(500).json({ message: 'Server error fetching deals' });
    }
};

export const updateDealStatus = async (req: AuthRequest, res: Response) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const { status } = req.body; // ACCEPTED, REJECTED

        if (!['ACCEPTED', 'REJECTED'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        // A club can only update deals for their own events
        const userId = req.user.id;
        const clubProfile = await prisma.clubProfile.findUnique({ where: { userId } });

        if (!clubProfile) return res.status(403).json({ message: 'Unauthorized' });

        const deal = await prisma.sponsorshipDeal.findUnique({
            where: { id: id as string },
            include: { event: true, company: true, tier: true }
        });

        if (!deal || deal.event.clubId !== clubProfile.id) {
            return res.status(404).json({ message: 'Deal not found or unauthorized' });
        }

        let dealPin = null;
        if (status === 'ACCEPTED') {
            // Generate a 6 character alphanumeric PIN reliably
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            dealPin = Array.from({ length: 6 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
        }

        const updatedDeal = await prisma.sponsorshipDeal.update({
            where: { id: id as string },
            data: {
                status: status as any,
                ...(dealPin && { dealPin })
            }
        });

        // Notify the Company
        if (status === 'ACCEPTED' || status === 'REJECTED') {
            await prisma.notification.create({
                data: {
                    userId: deal.company.userId,
                    title: `Sponsorship Request ${status === 'ACCEPTED' ? 'Accepted' : 'Declined'}`,
                    message: `Your request to sponsor ${deal.event.name} has been ${status.toLowerCase()}. ${status === 'ACCEPTED' ? 'Check your sponsorships tab for the Deal PIN.' : ''}`
                }
            });
        }

        res.status(200).json(updatedDeal);
    } catch (error) {
        console.error('Error updating deal:', error);
        res.status(500).json({ message: 'Server error updating deal' });
    }
};

export const verifyDealPin = async (req: AuthRequest, res: Response) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const { pin } = req.body;

        const userId = req.user.id;
        const clubProfile = await prisma.clubProfile.findUnique({ where: { userId } });

        if (!clubProfile) return res.status(403).json({ message: 'Unauthorized' });

        const deal = await prisma.sponsorshipDeal.findUnique({
            where: { id: id as string },
            include: { event: true, company: true, tier: true }
        });

        if (!deal || deal.event.clubId !== clubProfile.id) {
            return res.status(404).json({ message: 'Deal not found' });
        }

        if (deal.status !== 'ACCEPTED') {
            return res.status(400).json({ message: 'Deal is not accepted yet' });
        }

        if (!pin || deal.dealPin !== pin.trim().toUpperCase()) {
            return res.status(400).json({ message: 'Invalid PIN' });
        }

        // Transaction to complete deal and update totals safely
        const updatedDeal = await prisma.$transaction(async (tx: any) => {
            const completed = await tx.sponsorshipDeal.update({
                where: { id: id as string },
                data: { status: 'COMPLETED', paymentStatus: 'PAID' }
            });

            await tx.clubProfile.update({
                where: { id: clubProfile.id },
                data: { totalAmountRaised: { increment: deal.tier.amount } }
            });

            await tx.companyProfile.update({
                where: { id: deal.companyId },
                data: { totalAmountSpent: { increment: deal.tier.amount } }
            });

            await tx.notification.create({
                data: {
                    userId: deal.company.userId,
                    title: 'Deal Completed 🎉',
                    message: `The club has verified your PIN. Your sponsorship for ${deal.event.name} is now complete!`
                }
            });

            return completed;
        });

        res.status(200).json(updatedDeal);
    } catch (error) {
        console.error('Error verifying PIN:', error);
        res.status(500).json({ message: 'Server error verifying PIN' });
    }
};
