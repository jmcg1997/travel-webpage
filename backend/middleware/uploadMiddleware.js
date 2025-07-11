import multer from 'multer';
import path from 'path';

// Configure storage engine for multer
const storage = multer.diskStorage({
  // Define destination folder for uploaded files
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  // Define custom filename with timestamp and random suffix
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// Filter to allow only specific image file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed.'));
  }
};

// Multer upload middleware configuration
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Limit: 5 MB
});

export default upload;
