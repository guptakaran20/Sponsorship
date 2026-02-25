import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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

app.use(cors());
app.use(express.json());

// Expose uploads publicly
app.use('/uploads', express.static(uploadDir));

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
  res.send('SponsorBridge API Driver is running!');
});

import { prisma } from './lib/prisma';

// Auto-cleanup expired events
const cleanupExpiredEvents = async () => {
  try {
    const expiredEvents = await prisma.event.findMany({
      where: { date: { lt: new Date() } }
    });

    if (expiredEvents.length > 0) {
      console.log(`Found ${expiredEvents.length} expired events to clean up.`);
      for (const event of expiredEvents) {
        // Must delete related records manually inside a transaction
        await prisma.$transaction([
          prisma.sponsorshipDeal.deleteMany({ where: { eventId: event.id } }),
          prisma.sponsorshipTier.deleteMany({ where: { eventId: event.id } }),
          prisma.event.delete({ where: { id: event.id } })
        ]);
        console.log(`Deleted expired event: ${event.name}`);
      }
    }
  } catch (error) {
    console.error('Error auto-cleaning expired events:', error);
  }
};

// Run cleanup immediately on startup, then every 24 hours
cleanupExpiredEvents();
setInterval(cleanupExpiredEvents, 24 * 60 * 60 * 1000);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
