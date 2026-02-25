import express from 'express';
import multer from 'multer';
import path from 'path';
import { authenticateRequest } from '../middlewares/auth';
import { v4 as uuidv4 } from 'uuid'; // Fallback if we don't have uuid installed, we can just use Date.now()

const router = express.Router();

// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', '..', 'uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
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
router.post('/', authenticateRequest, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Construct the public URL for the file
        const protocol = req.protocol;
        const host = req.get('host');
        // If file is stored as backend/uploads/123.jpg, we want http://localhost:5000/uploads/123.jpg
        const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

        res.status(200).json({ url: fileUrl });
    } catch (error) {
        console.error('File upload error:', error);
        res.status(500).json({ message: 'Server error during file upload' });
    }
});

export default router;
