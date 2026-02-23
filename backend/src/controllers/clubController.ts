import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middlewares/auth';



export const createOrUpdateProfile = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;
        const { collegeName, description, pastEvents, reach, socialLinks } = req.body;

        if (!collegeName) {
            return res.status(400).json({ message: 'College name is required' });
        }

        const existingProfile = await prisma.clubProfile.findUnique({
            where: { userId },
        });

        if (existingProfile) {
            const updatedProfile = await prisma.clubProfile.update({
                where: { userId },
                data: {
                    collegeName,
                    description,
                    pastEvents: pastEvents ? JSON.stringify(pastEvents) : undefined,
                    reach: reach ? parseInt(reach) : existingProfile.reach,
                    socialLinks: socialLinks ? JSON.stringify(socialLinks) : undefined,
                },
            });
            return res.status(200).json(updatedProfile);
        }

        const newProfile = await prisma.clubProfile.create({
            data: {
                userId,
                collegeName,
                description,
                pastEvents: pastEvents ? JSON.stringify(pastEvents) : undefined,
                reach: reach ? parseInt(reach) : 0,
                socialLinks: socialLinks ? JSON.stringify(socialLinks) : undefined,
            },
        });

        res.status(201).json(newProfile);
    } catch (error) {
        console.error('Error creating/updating club profile:', error);
        res.status(500).json({ message: 'Server error dealing with profile' });
    }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;
        const profile = await prisma.clubProfile.findUnique({
            where: { userId },
            include: { events: true },
        });

        if (!profile) {
            return res.status(404).json({ message: 'Club profile not found' });
        }

        res.status(200).json(profile);
    } catch (error) {
        console.error('Error getting club profile:', error);
        res.status(500).json({ message: 'Server error retrieving profile' });
    }
};
