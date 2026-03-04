"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.createOrUpdateProfile = void 0;
const prisma_1 = require("../lib/prisma");
const createOrUpdateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const { collegeName, description, profilePhoto, about, pastEvents, reach, socialLinks, contactPerson, contactNumber, website } = req.body;
        if (!collegeName) {
            return res.status(400).json({ message: 'College name is required' });
        }
        const existingProfile = yield prisma_1.prisma.clubProfile.findUnique({
            where: { userId },
        });
        if (existingProfile) {
            const updatedProfile = yield prisma_1.prisma.clubProfile.update({
                where: { userId },
                data: {
                    collegeName,
                    description,
                    profilePhoto,
                    about,
                    pastEvents: pastEvents ? JSON.stringify(pastEvents) : undefined,
                    reach: reach ? parseInt(reach) : existingProfile.reach,
                    socialLinks: socialLinks ? JSON.stringify(socialLinks) : undefined,
                    contactPerson,
                    contactNumber,
                    website,
                },
            });
            return res.status(200).json(updatedProfile);
        }
        const newProfile = yield prisma_1.prisma.clubProfile.create({
            data: {
                userId,
                collegeName,
                description,
                profilePhoto,
                about,
                pastEvents: pastEvents ? JSON.stringify(pastEvents) : undefined,
                reach: reach ? parseInt(reach) : 0,
                socialLinks: socialLinks ? JSON.stringify(socialLinks) : undefined,
                contactPerson,
                contactNumber,
                website,
            },
        });
        res.status(201).json(newProfile);
    }
    catch (error) {
        console.error('Error creating/updating club profile:', error);
        res.status(500).json({ message: 'Server error dealing with profile' });
    }
});
exports.createOrUpdateProfile = createOrUpdateProfile;
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const profile = yield prisma_1.prisma.clubProfile.findUnique({
            where: { userId },
            include: { events: true },
        });
        if (!profile) {
            return res.status(200).json(null);
        }
        res.status(200).json(profile);
    }
    catch (error) {
        console.error('Error getting club profile:', error);
        res.status(500).json({ message: 'Server error retrieving profile' });
    }
});
exports.getProfile = getProfile;
