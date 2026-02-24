import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

// Get overall platform statistics
export const getStats = async (req: Request, res: Response) => {
    try {
        const totalUsers = await prisma.user.count();
        const totalClubs = await prisma.user.count({ where: { role: 'CLUB' } });
        const totalCompanies = await prisma.user.count({ where: { role: 'COMPANY' } });
        const totalEvents = await prisma.event.count();
        const totalDeals = await prisma.sponsorshipDeal.count();

        // Get deals by status
        const dealsByStatus = await prisma.sponsorshipDeal.groupBy({
            by: ['status'],
            _count: {
                id: true
            }
        });

        res.status(200).json({
            users: {
                total: totalUsers,
                clubs: totalClubs,
                companies: totalCompanies,
            },
            events: {
                total: totalEvents,
            },
            deals: {
                total: totalDeals,
                byStatus: dealsByStatus
            }
        });
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        res.status(500).json({ message: 'Server error fetching platform statistics.' });
    }
};

// Get all users with basic info
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isVerified: true,
                createdAt: true,
                clubProfile: {
                    select: { collegeName: true }
                },
                companyProfile: {
                    select: { industry: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error fetching users.' });
    }
};

// Get all events
export const getAllEvents = async (req: Request, res: Response) => {
    try {
        const events = await prisma.event.findMany({
            include: {
                club: {
                    select: {
                        collegeName: true,
                        user: { select: { name: true, email: true } }
                    }
                },
                _count: {
                    select: { deals: true, tiers: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Server error fetching events.' });
    }
};

// Get all deals
export const getAllDeals = async (req: Request, res: Response) => {
    try {
        const deals = await prisma.sponsorshipDeal.findMany({
            include: {
                event: { select: { name: true, date: true } },
                company: {
                    select: { user: { select: { name: true, email: true } } }
                },
                tier: { select: { name: true, amount: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json(deals);
    } catch (error) {
        console.error('Error fetching deals:', error);
        res.status(500).json({ message: 'Server error fetching deals.' });
    }
};
