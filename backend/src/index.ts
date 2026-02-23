import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const prisma = new PrismaClient();


import authRoutes from './routes/authRoutes';
import clubRoutes from './routes/clubRoutes';
import eventRoutes from './routes/eventRoutes';
import companyRoutes from './routes/companyRoutes';
import dealRoutes from './routes/dealRoutes';
import messageRoutes from './routes/messageRoutes';

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/deals', dealRoutes);
app.use('/api/messages', messageRoutes);

app.get('/', (req, res) => {
  res.send('SponsorBridge API Driver is running!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
