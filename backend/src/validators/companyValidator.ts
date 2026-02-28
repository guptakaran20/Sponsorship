import { z } from 'zod';

export const updateCompanyProfileSchema = z.object({
  body: z.object({
    industry: z.string().optional(),
    about: z.string().optional(),
    budgetRange: z.string().optional(),
    targetAudience: z.string().optional(),
    companySize: z.string().optional(),
    website: z.string().url().optional().or(z.literal('')),
    contactPerson: z.string().optional(),
    contactNumber: z.string().optional(),
  }),
});
