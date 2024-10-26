import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'node:fs/promises';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const saveFileToCloudinary = async (file, folder) => {
    const response = await cloudinary.uploader.upload(file.path, { folder });
    await fs.unlink(file.path);
    return response.secure_url;
};

export default saveFileToCloudinary;
