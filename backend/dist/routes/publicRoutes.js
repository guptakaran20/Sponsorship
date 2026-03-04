"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const publicController_1 = require("../controllers/publicController");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.get('/leaderboard', publicController_1.getLeaderboard);
router.post('/contact', publicController_1.createContactMessage);
// The view routes use authenticateRequest because they apply privacy rules based on the logged-in viewer
router.get('/club/:id', auth_1.authenticateRequest, publicController_1.getClubProfileView);
router.get('/company/:id', auth_1.authenticateRequest, publicController_1.getCompanyProfileView);
exports.default = router;
