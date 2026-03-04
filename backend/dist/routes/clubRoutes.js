"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clubController_1 = require("../controllers/clubController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.post('/profile', auth_1.authenticateRequest, (0, auth_1.authorizeRole)(['CLUB']), clubController_1.createOrUpdateProfile);
router.get('/profile', auth_1.authenticateRequest, (0, auth_1.authorizeRole)(['CLUB']), clubController_1.getProfile);
exports.default = router;
