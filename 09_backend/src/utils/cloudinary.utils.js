import dotenv from 'dotenv';
dotenv.config({
  path: './.env'
});
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// ================================
// Cloudinary Configuration Debug
// ================================
/* console.log("📌 Checking Cloudinary ENV Variables:");
console.log({
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? "Loaded" : "Missing"
});
console.log("--------------------------------------------------");

*/

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


// ================================
// Upload File to Cloudinary
// ================================
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return null;
    }

// Upload file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto'
    });

// File has been uploaded successfully
    // console.log("✅ File uploaded successfully!");
    // console.log("🌐 Cloudinary URL:", response.secure_url);

    return response;

  } catch (error) {

    // Remove local temp file
    fs.unlinkSync(localFilePath);// remove the locally saved temporary file as the upload operation got failed

    return null;
  }
};

export { uploadOnCloudinary };