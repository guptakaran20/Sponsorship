"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateClubProfileSchema = void 0;
const zod_1 = require("zod");
exports.updateClubProfileSchema = zod_1.z.object({
    body: zod_1.z.object({
        collegeName: zod_1.z.string().min(1).optional(),
        description: zod_1.z.string().optional(),
        about: zod_1.z.string().optional(),
        reach: zod_1.z.number().int().nonnegative().optional(),
        contactPerson: zod_1.z.string().optional(),
        contactNumber: zod_1.z.string().optional(),
        website: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    }),
});
