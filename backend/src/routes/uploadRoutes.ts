import express from 'express';
import multer from 'multer';
import path from 'path';
import { authenticateRequest } from '../middlewares/auth';
import { isCloudinaryConfigured, uploadToCloudinary } from '../config/cloudinary';

const router = express.Router();

// Use memory storage when Cloudinary is configured, disk storage otherwise
const storage = isCloudinaryConfigured()
    ? multer.memoryStorage()
    : multer.diskStorage({
          destination: (req, file, cb) => {
              cb(null, path.join(__dirname, '..', '..', 'uploads'));
          },
          filename: (req, file, cb) => {
              const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
              cb(null, uniqueSuffix + path.extname(file.originalname));
          },
      });

const upload = multer({
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
router.post('/', authenticateRequest, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        let fileUrl: string;

        if (isCloudinaryConfigured() && req.file.buffer) {
            // Upload to Cloudinary
            fileUrl = await uploadToCloudinary(req.file.buffer, 'sponsorbridge/profiles');
        } else {
            // Fallback to local URL
            const protocol = req.protocol;
            const host = req.get('host');
            fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
        }

        res.status(200).json({ url: fileUrl });
    } catch (error) {
        console.error('File upload error:', error);
        res.status(500).json({ message: 'Server error during file upload' });
    }
});

export default router;
