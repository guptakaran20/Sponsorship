import { z } from 'zod';

export const createEventSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Event name is required'),
    description: z.string().min(1, 'Description is required'),
    eventType: z.string().min(1, 'Event type is required'),
    footfall: z.number().int().nonnegative().optional(),
    location: z.string().min(1, 'Location is required'),
    date: z.string().refine((v) => !isNaN(Date.parse(v)), 'Invalid date'),
  }),
});

export const updateEventSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    eventType: z.string().min(1).optional(),
    footfall: z.number().int().nonnegative().optional(),
    location: z.string().min(1).optional(),
    date: z.string().refine((v) => !isNaN(Date.parse(v)), 'Invalid date').optional(),
  }),
  params: z.object({ id: z.string().uuid('Invalid event ID') }),
});
