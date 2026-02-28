import { z } from 'zod';

export const updateClubProfileSchema = z.object({
  body: z.object({
    collegeName: z.string().min(1).optional(),
    description: z.string().optional(),
    about: z.string().optional(),
    reach: z.number().int().nonnegative().optional(),
    contactPerson: z.string().optional(),
    contactNumber: z.string().optional(),
    website: z.string().url().optional().or(z.literal('')),
  }),
});
