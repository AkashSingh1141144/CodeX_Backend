import multer from "multer";

// ========================================
// Multer Disk Storage Configuration
// ========================================
// This decides:
// 1) Uploaded file kis folder me save hogi
// 2) File ka naam kya hoga
const storage = multer.diskStorage({

  // Where to store uploaded files (temporary storage)
  destination: function (req, file, cb) {
    // "./public/temp" means file will be saved inside public/temp folder
    cb(null, "./public/temp");
  },

  // What the uploaded file's name will be
  filename: function (req, file, cb) {
    // We use original file name (you can customize if needed)
    cb(null, file.originalname);
  }
});

// ========================================
// Multer Upload Middleware
// ========================================
// storage: defines where & how file is stored
// Limits & file filters can also be added here
export const upload = multer({
  storage,
}) 