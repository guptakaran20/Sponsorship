"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const csrf_csrf_1 = require("csrf-csrf");
dotenv_1.default.config();
// Must import env config early to validate env vars
const env_1 = require("./config/env");
const logger_1 = require("./utils/logger");
const app = (0, express_1.default)();
// Ensure uploads directory exists
const uploadDir = path_1.default.join(__dirname, '..', 'uploads');
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const clubRoutes_1 = __importDefault(require("./routes/clubRoutes"));
const eventRoutes_1 = __importDefault(require("./routes/eventRoutes"));
const companyRoutes_1 = __importDefault(require("./routes/companyRoutes"));
const dealRoutes_1 = __importDefault(require("./routes/dealRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
const publicRoutes_1 = __importDefault(require("./routes/publicRoutes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const errorHandler_1 = require("./middlewares/errorHandler");
const rateLimiter_1 = require("./middlewares/rateLimiter");
// CSRF protection using double-submit cookie pattern
const { generateCsrfToken, doubleCsrfProtection } = (0, csrf_csrf_1.doubleCsrf)({
    getSecret: () => env_1.env.CSRF_SECRET,
    getSessionIdentifier: (req) => { var _a; return ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken) || req.ip || ''; },
    cookieName: 'x-csrf-token',
    cookieOptions: {
        httpOnly: false, // must be readable by client JS for double-submit pattern
        sameSite: 'none',
        secure: true
    },
    ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
});
// Security middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: env_1.env.CORS_ORIGIN,
    credentials: true,
}));
app.use(express_1.default.json({ limit: '1mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '1mb' }));
app.use((0, cookie_parser_1.default)());
// Rate limiting
app.use('/api', rateLimiter_1.generalLimiter);
// Expose uploads publicly
app.use('/uploads', express_1.default.static(uploadDir));
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), uptime: process.uptime() });
});
// CSRF token endpoint — client calls this before making state-changing requests
app.get('/api/csrf-token', (req, res) => {
    const csrfToken = generateCsrfToken(req, res);
    res.json({ csrfToken });
});
// Apply CSRF protection to all state-changing API routes
if (env_1.env.NODE_ENV === 'production') {
    app.use('/api', doubleCsrfProtection);
}
app.use('/api/auth', authRoutes_1.default);
app.use('/api/clubs', clubRoutes_1.default);
app.use('/api/events', eventRoutes_1.default);
app.use('/api/companies', companyRoutes_1.default);
app.use('/api/deals', dealRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/notifications', notificationRoutes_1.default);
app.use('/api/public', publicRoutes_1.default);
app.use('/api/upload', uploadRoutes_1.default);
app.get('/', (req, res) => {
    res.json({ message: 'SponsorGrid API is running!', version: '1.0.0' });
});
// Global error handler (must be last)
app.use(errorHandler_1.errorHandler);
const prisma_1 = require("./lib/prisma");
const cleanupExpiredEvents = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const expiredEvents = yield prisma_1.prisma.event.findMany({
            where: { date: { lt: new Date() } }
        });
        if (expiredEvents.length > 0) {
            logger_1.logger.info(`Found ${expiredEvents.length} expired events to clean up.`);
            for (const event of expiredEvents) {
                yield prisma_1.prisma.$transaction([
                    prisma_1.prisma.sponsorshipDeal.deleteMany({ where: { eventId: event.id } }),
                    prisma_1.prisma.sponsorshipTier.deleteMany({ where: { eventId: event.id } }),
                    prisma_1.prisma.event.delete({ where: { id: event.id } })
                ]);
                logger_1.logger.info(`Deleted expired event: ${event.name}`);
            }
        }
    }
    catch (error) {
        logger_1.logger.error('Error auto-cleaning expired events:', error);
    }
});
cleanupExpiredEvents();
setInterval(cleanupExpiredEvents, 24 * 60 * 60 * 1000);
app.listen(env_1.env.PORT, () => {
    logger_1.logger.info(`Server is running on port ${env_1.env.PORT}`);
});
