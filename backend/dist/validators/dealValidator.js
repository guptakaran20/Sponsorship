"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyDealPinSchema = exports.updateDealStatusSchema = exports.createDealSchema = void 0;
const zod_1 = require("zod");
exports.createDealSchema = zod_1.z.object({
    body: zod_1.z.object({
        eventId: zod_1.z.string().uuid('Invalid event ID'),
        tierId: zod_1.z.string().uuid('Invalid tier ID'),
    }),
});
exports.updateDealStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(['ACCEPTED', 'REJECTED', 'NEGOTIATING'], { error: () => ({ message: 'Invalid status' }) }),
    }),
    params: zod_1.z.object({ id: zod_1.z.string().uuid('Invalid deal ID') }),
});
exports.verifyDealPinSchema = zod_1.z.object({
    body: zod_1.z.object({
        pin: zod_1.z.string().length(6, 'PIN must be 6 characters'),
    }),
    params: zod_1.z.object({ id: zod_1.z.string().uuid('Invalid deal ID') }),
});
