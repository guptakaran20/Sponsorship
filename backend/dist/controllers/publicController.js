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
exports.getContactMessages = exports.createContactMessage = exports.getLeaderboard = exports.getCompanyProfileView = exports.getClubProfileView = void 0;
const prisma_1 = require("../lib/prisma");
const getClubProfileView = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const viewerRole = req.user.role;
        const viewerId = req.user.id;
        const club = yield prisma_1.prisma.clubProfile.findUnique({
            where: { id: id },
            include: { user: { select: { name: true } }, events: true }
        });
        if (!club)
            return res.status(404).json({ message: 'Club not found' });
        // Privacy rules: default to hidden contact details
        let showContact = false;
        // If the viewer is the same club, show details
        if (viewerRole === 'CLUB' && club.userId === viewerId) {
            showContact = true;
        }
        else if (viewerRole === 'COMPANY') {
            const company = yield prisma_1.prisma.companyProfile.findUnique({ where: { userId: viewerId } });
            if (company) {
                // Check if they have a COMPLETED deal together
                const hasValidDeal = yield prisma_1.prisma.sponsorshipDeal.findFirst({
                    where: {
                        companyId: company.id,
                        event: { clubId: club.id },
                        status: 'COMPLETED'
                    }
                });
                if (hasValidDeal)
                    showContact = true;
            }
        }
        const profileData = Object.assign({ id: club.id, collegeName: club.collegeName, description: club.description, reach: club.reach, pastEvents: club.pastEvents, events: club.events, totalAmountRaised: club.totalAmountRaised }, (showContact && {
            contactPerson: club.contactPerson,
            contactNumber: club.contactNumber,
            socialLinks: club.socialLinks,
            website: club.website
        }));
        res.status(200).json(profileData);
    }
    catch (error) {
        console.error('Error fetching club public profile:', error);
        res.status(500).json({ message: 'Server error retrieving profile' });
    }
});
exports.getClubProfileView = getClubProfileView;
const getCompanyProfileView = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const viewerRole = req.user.role;
        const viewerId = req.user.id;
        const company = yield prisma_1.prisma.companyProfile.findUnique({
            where: { id: id },
            include: { user: { select: { name: true } } }
        });
        if (!company)
            return res.status(404).json({ message: 'Company not found' });
        let isVisible = false;
        let showContact = false;
        if (viewerRole === 'COMPANY' && company.userId === viewerId) {
            isVisible = true;
            showContact = true;
        }
        else if (viewerRole === 'CLUB') {
            isVisible = true; // Clubs can always see company basic details
            const club = yield prisma_1.prisma.clubProfile.findUnique({ where: { userId: viewerId } });
            if (club) {
                // To see contact details, there must be a completed deal
                const dealContext = yield prisma_1.prisma.sponsorshipDeal.findFirst({
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
        const profileData = Object.assign({ id: company.id, userName: (_a = company.user) === null || _a === void 0 ? void 0 : _a.name, industry: company.industry, companySize: company.companySize, targetAudience: company.targetAudience, budgetRange: company.budgetRange, totalAmountSpent: company.totalAmountSpent }, (showContact && {
            contactPerson: company.contactPerson,
            contactNumber: company.contactNumber,
            socialLinks: company.socialLinks,
            website: company.website
        }));
        res.status(200).json(profileData);
    }
    catch (error) {
        console.error('Error fetching company public profile:', error);
        res.status(500).json({ message: 'Server error retrieving profile' });
    }
});
exports.getCompanyProfileView = getCompanyProfileView;
// Leaderboard implementation for Homepage
const getLeaderboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const topClubs = yield prisma_1.prisma.clubProfile.findMany({
            orderBy: { totalAmountRaised: 'desc' },
            take: 3,
            select: { id: true, collegeName: true, totalAmountRaised: true, reach: true }
        });
        const topCompanies = yield prisma_1.prisma.companyProfile.findMany({
            orderBy: { totalAmountSpent: 'desc' },
            take: 3,
            select: { id: true, industry: true, totalAmountSpent: true, user: { select: { name: true } } }
        });
        res.status(200).json({ topClubs, topCompanies });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error fetching leaderboard' });
    }
});
exports.getLeaderboard = getLeaderboard;
const createContactMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Name, email, and message are required' });
        }
        yield prisma_1.prisma.contactMessage.create({
            data: { name, email, message }
        });
        res.status(201).json({ message: 'Message sent successfully' });
    }
    catch (error) {
        console.error('Error creating contact message:', error);
        res.status(500).json({ message: 'Server error saving message' });
    }
});
exports.createContactMessage = createContactMessage;
const getContactMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Enforce basic admin check if we want, but since 'ADMIN' role isn't strictly implemented for dashboard yet, 
        // we check if they are logged in at least, or ideally restrict by req.user.role === 'ADMIN'
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Unauthorized access' });
        }
        const messages = yield prisma_1.prisma.contactMessage.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json(messages);
    }
    catch (error) {
        console.error('Error fetching contact messages:', error);
        res.status(500).json({ message: 'Server error retrieving messages' });
    }
});
exports.getContactMessages = getContactMessages;
