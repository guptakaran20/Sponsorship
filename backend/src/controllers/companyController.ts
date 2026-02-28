import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middlewares/auth';



export const createOrUpdateProfile = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;
        const { industry, customIndustry, about, profilePhoto, budgetRange, targetAudience, companySize, website, contactPerson, contactNumber, socialLinks } = req.body;

        const existingProfile = await prisma.companyProfile.findUnique({
            where: { userId },
        });

        if (existingProfile) {
            const updatedProfile = await prisma.companyProfile.update({
                where: { userId },
                data: {
                    industry,
                    customIndustry: industry === 'Other' ? customIndustry : null,
                    about,
                    profilePhoto,
                    budgetRange,
                    targetAudience,
                    companySize,
                    website,
                    contactPerson,
                    contactNumber,
                    socialLinks,
                },
            });
            return res.status(200).json(updatedProfile);
        }

        const newProfile = await prisma.companyProfile.create({
            data: {
                userId,
                industry,
                customIndustry: industry === 'Other' ? customIndustry : null,
                about,
                profilePhoto,
                budgetRange,
                targetAudience,
                companySize,
                website,
                contactPerson,
                contactNumber,
                socialLinks,
            },
        });

        res.status(201).json(newProfile);
    } catch (error) {
        console.error('Error creating/updating company profile:', error);
        res.status(500).json({ message: 'Server error dealing with profile' });
    }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;
        const profile = await prisma.companyProfile.findUnique({
            where: { userId },
            include: { deals: true },
        });

        if (!profile) {
            return res.status(200).json(null);
        }

        res.status(200).json(profile);
    } catch (error) {
        console.error('Error getting company profile:', error);
        res.status(500).json({ message: 'Server error retrieving profile' });
    }
};
