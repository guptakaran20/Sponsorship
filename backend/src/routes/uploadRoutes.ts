import express from 'express';
import multer from 'multer';
import path from 'path';
import { authenticateRequest } from '../middlewares/auth';
import { uploadToCloudinary, isCloudinaryConfigured } from '../config/cloudinary';

const router = express.Router();

// Use memory storage when Cloudinary is configured, disk storage as fallback
const memoryStorage = multer.memoryStorage();

const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', '..', 'uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: isCloudinaryConfigured() ? memoryStorage : diskStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
    fileFilter: (req, file, cb) => {
        // Accept images only
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed!'));
        }
        cb(null, true);
    }
});

// @route   POST /api/upload
// @desc    Upload an image file and return its public URL
// @access  Private
router.post('/', authenticateRequest, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // If Cloudinary is configured, upload to cloud
        if (isCloudinaryConfigured() && req.file.buffer) {
            const result = await uploadToCloudinary(req.file.buffer, 'sponsorbridge/profiles');
            return res.status(200).json({ url: result.url });
        }

        // Fallback to local disk storage
        const protocol = req.protocol;
        const host = req.get('host');
        const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

        res.status(200).json({ url: fileUrl });
    } catch (error) {
        console.error('File upload error:', error);
        res.status(500).json({ message: 'Server error during file upload' });
    }
});

export default router;
