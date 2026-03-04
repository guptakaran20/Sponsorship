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
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToCloudinary = exports.isCloudinaryConfigured = void 0;
const cloudinary_1 = require("cloudinary");
const env_1 = require("../config/env");
const isCloudinaryConfigured = () => {
    return !!(env_1.env.CLOUDINARY_CLOUD_NAME && env_1.env.CLOUDINARY_API_KEY && env_1.env.CLOUDINARY_API_SECRET);
};
exports.isCloudinaryConfigured = isCloudinaryConfigured;
if ((0, exports.isCloudinaryConfigured)()) {
    cloudinary_1.v2.config({
        cloud_name: env_1.env.CLOUDINARY_CLOUD_NAME,
        api_key: env_1.env.CLOUDINARY_API_KEY,
        api_secret: env_1.env.CLOUDINARY_API_SECRET,
    });
}
const uploadToCloudinary = (fileBuffer_1, ...args_1) => __awaiter(void 0, [fileBuffer_1, ...args_1], void 0, function* (fileBuffer, folder = 'sponsorgrid') {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({
            folder,
            resource_type: 'image',
            transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }],
        }, (error, result) => {
            if (error) {
                reject(error);
            }
            else if (result) {
                resolve(result.secure_url);
            }
            else {
                reject(new Error('Upload failed — no result returned'));
            }
        });
        uploadStream.end(fileBuffer);
    });
});
exports.uploadToCloudinary = uploadToCloudinary;
exports.default = cloudinary_1.v2;
