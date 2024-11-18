const express = require('express');
const multer = require('multer');
const path = require('path');
const { uploadFile, downloadFile } = require('../controllers/fileController');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Define the folder where files will be stored
    },
    filename: (req, file, cb) => {
        // Ensure the file extension is preserved
        const ext = path.extname(file.originalname); // Get the file extension (e.g., .png, .jpg)
        cb(null, `${Date.now()}${ext}`); // Save the file with its original extension
    },
});

// Initialize Multer with storage configuration, file filter, and size limit
const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        // Specify allowed MIME types (PNG, JPEG, JPG)
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (!allowedTypes.includes(file.mimetype)) {
            // If file type is not allowed, reject it
            return cb(new Error('Invalid file type. Only PNG, JPEG, JPG are allowed.'));
        }
        // Proceed if file type is allowed
        cb(null, true);
    },
    limits: { fileSize: 50 * 1024 * 1024 },  // Limit file size to 50 MB
}).single('file');  // Expecting a file field named 'file' in the form data

// Routes
router.post('/upload', upload, uploadFile);  // Handle file upload
router.get('/:id', downloadFile);  // Handle file download by ID

module.exports = router;
