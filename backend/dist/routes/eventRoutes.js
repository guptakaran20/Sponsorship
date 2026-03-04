"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const eventController_1 = require("../controllers/eventController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// Publicly visible / authenticated for all
router.get('/', eventController_1.getEvents);
router.get('/:id', eventController_1.getEventById);
// Protected routes for clubs
router.post('/', auth_1.authenticateRequest, (0, auth_1.authorizeRole)(['CLUB']), eventController_1.createEvent);
router.put('/:id', auth_1.authenticateRequest, (0, auth_1.authorizeRole)(['CLUB']), eventController_1.updateEvent);
router.delete('/:id', auth_1.authenticateRequest, (0, auth_1.authorizeRole)(['CLUB']), eventController_1.deleteEvent);
exports.default = router;
