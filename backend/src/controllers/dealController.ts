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
            }
        });

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

        res.status(200).json(deals);
    } catch (error) {
        console.error('Error fetching deals:', error);
        res.status(500).json({ message: 'Server error fetching deals' });
    }
};

export const updateDealStatus = async (req: AuthRequest, res: Response) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const { status } = req.body; // ACCEPTED, REJECTED, COMPLETED

        if (!['ACCEPTED', 'REJECTED', 'COMPLETED'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        // A club can only update deals for their own events
        const userId = req.user.id;
        const clubProfile = await prisma.clubProfile.findUnique({ where: { userId } });

        if (!clubProfile) return res.status(403).json({ message: 'Unauthorized' });

        const deal = await prisma.sponsorshipDeal.findUnique({
            where: { id: id as string },
            include: { event: true }
        });

        if (!deal || deal.event.clubId !== clubProfile.id) {
            return res.status(404).json({ message: 'Deal not found or unauthorized' });
        }

        const updatedDeal = await prisma.sponsorshipDeal.update({
            where: { id: id as string },
            data: { status }
        });

        res.status(200).json(updatedDeal);
    } catch (error) {
        console.error('Error updating deal:', error);
        res.status(500).json({ message: 'Server error updating deal' });
    }
};
