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
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const auth_1 = require("../middlewares/auth");
const cloudinary_1 = require("../config/cloudinary");
const router = express_1.default.Router();
// Use memory storage when Cloudinary is configured, disk storage otherwise
const storage = (0, cloudinary_1.isCloudinaryConfigured)()
    ? multer_1.default.memoryStorage()
    : multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path_1.default.join(__dirname, '..', '..', 'uploads'));
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
        },
    });
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed!'));
        }
        cb(null, true);
    },
});
// @route   POST /api/upload
// @desc    Upload an image file and return its public URL
// @access  Private
router.post('/', auth_1.authenticateRequest, upload.single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        let fileUrl;
        if ((0, cloudinary_1.isCloudinaryConfigured)() && req.file.buffer) {
            // Upload to Cloudinary
            fileUrl = yield (0, cloudinary_1.uploadToCloudinary)(req.file.buffer, 'sponsorgrid/profiles');
        }
        else {
            // Fallback to local URL
            const protocol = req.protocol;
            const host = req.get('host');
            fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
        }
        res.status(200).json({ url: fileUrl });
    }
    catch (error) {
        console.error('File upload error:', error);
        res.status(500).json({ message: 'Server error during file upload' });
    }
}));
exports.default = router;
