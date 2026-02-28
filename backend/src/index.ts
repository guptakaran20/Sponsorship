import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import cookieParser from 'cookie-parser';

dotenv.config();

// Must import env config early to validate env vars
import { env } from './config/env';
import { logger } from './utils/logger';

const app = express();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

import authRoutes from './routes/authRoutes';
import clubRoutes from './routes/clubRoutes';
import eventRoutes from './routes/eventRoutes';
import companyRoutes from './routes/companyRoutes';
import dealRoutes from './routes/dealRoutes';
import adminRoutes from './routes/adminRoutes';
import notificationRoutes from './routes/notificationRoutes';
import publicRoutes from './routes/publicRoutes';
import uploadRoutes from './routes/uploadRoutes';
import { errorHandler } from './middlewares/errorHandler';
import { generalLimiter } from './middlewares/rateLimiter';

// Security middleware
app.use(helmet());
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// Rate limiting
app.use('/api', generalLimiter);

// Expose uploads publicly
app.use('/uploads', express.static(uploadDir));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), uptime: process.uptime() });
});

app.use('/api/auth', authRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/deals', dealRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'SponsorBridge API is running!', version: '1.0.0' });
});

// Global error handler (must be last)
app.use(errorHandler);

import { prisma } from './lib/prisma';

const cleanupExpiredEvents = async () => {
  try {
    const expiredEvents = await prisma.event.findMany({
      where: { date: { lt: new Date() } }
    });

    if (expiredEvents.length > 0) {
      logger.info(`Found ${expiredEvents.length} expired events to clean up.`);
      for (const event of expiredEvents) {
        await prisma.$transaction([
          prisma.sponsorshipDeal.deleteMany({ where: { eventId: event.id } }),
          prisma.sponsorshipTier.deleteMany({ where: { eventId: event.id } }),
          prisma.event.delete({ where: { id: event.id } })
        ]);
        logger.info(`Deleted expired event: ${event.name}`);
      }
    }
  } catch (error) {
    logger.error('Error auto-cleaning expired events:', error);
  }
};

cleanupExpiredEvents();
setInterval(cleanupExpiredEvents, 24 * 60 * 60 * 1000);

app.listen(env.PORT, () => {
  logger.info(`Server is running on port ${env.PORT}`);
});
