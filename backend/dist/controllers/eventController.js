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
exports.deleteEvent = exports.updateEvent = exports.getEventById = exports.getEvents = exports.createEvent = void 0;
const prisma_1 = require("../lib/prisma");
const createEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const { name, description, eventType, footfall, location, date, tiers } = req.body;
        if (!name || !description || !eventType || !location || !date) {
            return res.status(400).json({ message: 'Missing required event fields' });
        }
        // Get the ClubProfile for the user
        const profile = yield prisma_1.prisma.clubProfile.findUnique({ where: { userId } });
        if (!profile) {
            return res.status(400).json({ message: 'Club profile must be created before adding events' });
        }
        const event = yield prisma_1.prisma.event.create({
            data: {
                clubId: profile.id,
                name,
                description,
                eventType,
                footfall: footfall ? parseInt(footfall) : 0,
                location,
                date: new Date(date),
                tiers: tiers && Array.isArray(tiers) ? {
                    create: tiers.map((t) => ({
                        name: t.name,
                        amount: parseFloat(t.amount),
                        benefits: t.benefits ? JSON.stringify(t.benefits) : '[]',
                    }))
                } : undefined
            },
            include: { tiers: true }
        });
        res.status(201).json(event);
    }
    catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ message: 'Server error creating event' });
    }
});
exports.createEvent = createEvent;
const getEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { eventType, location, footfallMin, clubId } = req.query;
        // Build query
        const whereClause = {};
        if (eventType)
            whereClause.eventType = { contains: String(eventType), mode: 'insensitive' };
        if (location)
            whereClause.location = { contains: String(location), mode: 'insensitive' };
        if (footfallMin)
            whereClause.footfall = { gte: parseInt(String(footfallMin)) };
        if (clubId)
            whereClause.clubId = String(clubId);
        const events = yield prisma_1.prisma.event.findMany({
            where: whereClause,
            include: {
                club: {
                    select: { collegeName: true, reach: true, description: true, pastEvents: true, socialLinks: true, profilePhoto: true }
                },
                tiers: true
            },
            orderBy: { date: 'asc' }
        });
        res.status(200).json(events);
    }
    catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Server error fetching events' });
    }
});
exports.getEvents = getEvents;
const getEventById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const event = yield prisma_1.prisma.event.findUnique({
            where: { id: id },
            include: {
                club: true,
                tiers: true
            }
        });
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json(event);
    }
    catch (error) {
        console.error('Error fetching event by ID:', error);
        res.status(500).json({ message: 'Server error retrieving event' });
    }
});
exports.getEventById = getEventById;
const updateEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const userId = req.user.id;
        const { name, description, eventType, footfall, location, date } = req.body;
        const profile = yield prisma_1.prisma.clubProfile.findUnique({ where: { userId } });
        if (!profile)
            return res.status(403).json({ message: 'Unauthorized' });
        const event = yield prisma_1.prisma.event.findUnique({ where: { id: id } });
        if (!event || event.clubId !== profile.id) {
            return res.status(404).json({ message: 'Event not found or unauthorized' });
        }
        const updatedEvent = yield prisma_1.prisma.event.update({
            where: { id: id },
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
    }
    catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ message: 'Server error updating event' });
    }
});
exports.updateEvent = updateEvent;
const deleteEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const userId = req.user.id;
        const profile = yield prisma_1.prisma.clubProfile.findUnique({ where: { userId } });
        if (!profile)
            return res.status(403).json({ message: 'Unauthorized' });
        const event = yield prisma_1.prisma.event.findUnique({ where: { id: id } });
        if (!event || event.clubId !== profile.id) {
            return res.status(404).json({ message: 'Event not found or unauthorized' });
        }
        // Transaction to safely delete deals, tiers, and the event
        yield prisma_1.prisma.$transaction([
            prisma_1.prisma.sponsorshipDeal.deleteMany({ where: { eventId: id } }),
            prisma_1.prisma.sponsorshipTier.deleteMany({ where: { eventId: id } }),
            prisma_1.prisma.event.delete({ where: { id: id } })
        ]);
        res.status(200).json({ message: 'Event deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: 'Server error deleting event' });
    }
});
exports.deleteEvent = deleteEvent;
