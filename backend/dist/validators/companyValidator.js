"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCompanyProfileSchema = void 0;
const zod_1 = require("zod");
exports.updateCompanyProfileSchema = zod_1.z.object({
    body: zod_1.z.object({
        industry: zod_1.z.string().optional(),
        about: zod_1.z.string().optional(),
        budgetRange: zod_1.z.string().optional(),
        targetAudience: zod_1.z.string().optional(),
        companySize: zod_1.z.string().optional(),
        website: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
        contactPerson: zod_1.z.string().optional(),
        contactNumber: zod_1.z.string().optional(),
    }),
});
