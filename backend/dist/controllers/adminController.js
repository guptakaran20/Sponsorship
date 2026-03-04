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
exports.getAllDeals = exports.getAllEvents = exports.getAllUsers = exports.getStats = void 0;
const prisma_1 = require("../lib/prisma");
// Get overall platform statistics
const getStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalUsers = yield prisma_1.prisma.user.count();
        const totalClubs = yield prisma_1.prisma.user.count({ where: { role: 'CLUB' } });
        const totalCompanies = yield prisma_1.prisma.user.count({ where: { role: 'COMPANY' } });
        const totalEvents = yield prisma_1.prisma.event.count();
        const totalDeals = yield prisma_1.prisma.sponsorshipDeal.count();
        // Get deals by status
        const dealsByStatus = yield prisma_1.prisma.sponsorshipDeal.groupBy({
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
    }
    catch (error) {
        console.error('Error fetching admin stats:', error);
        res.status(500).json({ message: 'Server error fetching platform statistics.' });
    }
});
exports.getStats = getStats;
// Get all users with basic info
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma_1.prisma.user.findMany({
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
    }
    catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error fetching users.' });
    }
});
exports.getAllUsers = getAllUsers;
// Get all events
const getAllEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield prisma_1.prisma.event.findMany({
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
    }
    catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Server error fetching events.' });
    }
});
exports.getAllEvents = getAllEvents;
// Get all deals
const getAllDeals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deals = yield prisma_1.prisma.sponsorshipDeal.findMany({
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
    }
    catch (error) {
        console.error('Error fetching deals:', error);
        res.status(500).json({ message: 'Server error fetching deals.' });
    }
});
exports.getAllDeals = getAllDeals;
