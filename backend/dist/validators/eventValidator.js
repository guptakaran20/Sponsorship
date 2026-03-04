"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEventSchema = exports.createEventSchema = void 0;
const zod_1 = require("zod");
exports.createEventSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Event name is required'),
        description: zod_1.z.string().min(1, 'Description is required'),
        eventType: zod_1.z.string().min(1, 'Event type is required'),
        footfall: zod_1.z.number().int().nonnegative().optional(),
        location: zod_1.z.string().min(1, 'Location is required'),
        date: zod_1.z.string().refine((v) => !isNaN(Date.parse(v)), 'Invalid date'),
    }),
});
exports.updateEventSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).optional(),
        description: zod_1.z.string().min(1).optional(),
        eventType: zod_1.z.string().min(1).optional(),
        footfall: zod_1.z.number().int().nonnegative().optional(),
        location: zod_1.z.string().min(1).optional(),
        date: zod_1.z.string().refine((v) => !isNaN(Date.parse(v)), 'Invalid date').optional(),
    }),
    params: zod_1.z.object({ id: zod_1.z.string().uuid('Invalid event ID') }),
});
