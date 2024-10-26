import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from 'cloudinary';

cloudinary.config({
  cloud_name: 'your_cloud_name',
  api_key: 'your_api_key',
  api_secret: 'your_api_secret',
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'avatars',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage: storage });

export default upload;
