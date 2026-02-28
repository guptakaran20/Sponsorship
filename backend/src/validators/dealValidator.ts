import { z } from 'zod';

export const createDealSchema = z.object({
  body: z.object({
    eventId: z.string().uuid('Invalid event ID'),
    tierId: z.string().uuid('Invalid tier ID'),
  }),
});

export const updateDealStatusSchema = z.object({
  body: z.object({
    status: z.enum(['ACCEPTED', 'REJECTED', 'NEGOTIATING'], { errorMap: () => ({ message: 'Invalid status' }) }),
  }),
  params: z.object({ id: z.string().uuid('Invalid deal ID') }),
});

export const verifyDealPinSchema = z.object({
  body: z.object({
    pin: z.string().length(6, 'PIN must be 6 characters'),
  }),
  params: z.object({ id: z.string().uuid('Invalid deal ID') }),
});
