import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env';

export const isCloudinaryConfigured = (): boolean => {
    return !!(env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET);
};

if (isCloudinaryConfigured()) {
    cloudinary.config({
        cloud_name: env.CLOUDINARY_CLOUD_NAME,
        api_key: env.CLOUDINARY_API_KEY,
        api_secret: env.CLOUDINARY_API_SECRET,
    });
}

export const uploadToCloudinary = async (
    fileBuffer: Buffer,
    folder: string = 'sponsorgrid',
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: 'image',
                transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }],
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else if (result) {
                    resolve(result.secure_url);
                } else {
                    reject(new Error('Upload failed — no result returned'));
                }
            },
        );
        uploadStream.end(fileBuffer);
    });
};

export default cloudinary;
