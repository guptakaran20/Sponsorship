"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const adminController_1 = require("../controllers/adminController");
const router = express_1.default.Router();
// All routes require authentication and ADMIN role
router.use(auth_1.authenticateRequest);
router.use((0, auth_1.authorizeRole)(['ADMIN']));
// Admin endpoints
router.get('/stats', adminController_1.getStats);
router.get('/users', adminController_1.getAllUsers);
router.get('/events', adminController_1.getAllEvents);
router.get('/deals', adminController_1.getAllDeals);
exports.default = router;
