import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middlewares/auth';



export const createEvent = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;
        const { name, description, eventType, footfall, location, date, tiers } = req.body;

        if (!name || !description || !eventType || !location || !date) {
            return res.status(400).json({ message: 'Missing required event fields' });
        }

        // Get the ClubProfile for the user
        const profile = await prisma.clubProfile.findUnique({ where: { userId } });

        if (!profile) {
            return res.status(400).json({ message: 'Club profile must be created before adding events' });
        }

        const event = await prisma.event.create({
            data: {
                clubId: profile.id,
                name,
                description,
                eventType,
                footfall: footfall ? parseInt(footfall) : 0,
                location,
                date: new Date(date),
                tiers: tiers && Array.isArray(tiers) ? {
                    create: tiers.map((t: any) => ({
                        name: t.name,
                        amount: parseFloat(t.amount),
                        benefits: t.benefits ? JSON.stringify(t.benefits) : '[]',
                    }))
                } : undefined
            },
            include: { tiers: true }
        });

        res.status(201).json(event);
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ message: 'Server error creating event' });
    }
};

export const getEvents = async (req: Request, res: Response) => {
    try {
        const { eventType, location, footfallMin, clubId } = req.query;

        // Build query
        const whereClause: any = {};
        if (eventType) whereClause.eventType = { contains: String(eventType), mode: 'insensitive' };
        if (location) whereClause.location = { contains: String(location), mode: 'insensitive' };
        if (footfallMin) whereClause.footfall = { gte: parseInt(String(footfallMin)) };
        if (clubId) whereClause.clubId = String(clubId);

        const events = await prisma.event.findMany({
            where: whereClause,
            include: {
                club: {
                    select: { collegeName: true, reach: true, description: true, pastEvents: true, socialLinks: true, profilePhoto: true, user: { select: { name: true } } }
                },
                tiers: true
            },
            orderBy: { date: 'asc' }
        });

        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Server error fetching events' });
    }
};

export const getEventById = async (req: Request, res: Response) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const event = await prisma.event.findUnique({
            where: { id: id as string },
            include: {
                club: {
                    include: { user: { select: { name: true } } }
                },
                tiers: true
            }
        });

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json(event);
    } catch (error) {
        console.error('Error fetching event by ID:', error);
        res.status(500).json({ message: 'Server error retrieving event' });
    }
};

export const updateEvent = async (req: AuthRequest, res: Response) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const userId = req.user.id;
        const { name, description, eventType, footfall, location, date } = req.body;

        const profile = await prisma.clubProfile.findUnique({ where: { userId } });
        if (!profile) return res.status(403).json({ message: 'Unauthorized' });

        const event = await prisma.event.findUnique({ where: { id: id as string } });
        if (!event || event.clubId !== profile.id) {
            return res.status(404).json({ message: 'Event not found or unauthorized' });
        }

        const updatedEvent = await prisma.event.update({
            where: { id: id as string },
            data: {
                name: name || event.name,
                description: description || event.description,
                eventType: eventType || event.eventType,
                footfall: footfall ? parseInt(footfall) : event.footfall,
                location: location || event.location,
                date: date ? new Date(date) : event.date,
            }
        });

        res.status(200).json(updatedEvent);
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ message: 'Server error updating event' });
    }
};

export const deleteEvent = async (req: AuthRequest, res: Response) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const userId = req.user.id;

        const profile = await prisma.clubProfile.findUnique({ where: { userId } });
        if (!profile) return res.status(403).json({ message: 'Unauthorized' });

        const event = await prisma.event.findUnique({ where: { id: id as string } });
        if (!event || event.clubId !== profile.id) {
            return res.status(404).json({ message: 'Event not found or unauthorized' });
        }

        // Transaction to safely delete deals, tiers, and the event
        await prisma.$transaction([
            prisma.sponsorshipDeal.deleteMany({ where: { eventId: id as string } }),
            prisma.sponsorshipTier.deleteMany({ where: { eventId: id as string } }),
            prisma.event.delete({ where: { id: id as string } })
        ]);

        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: 'Server error deleting event' });
    }
};
