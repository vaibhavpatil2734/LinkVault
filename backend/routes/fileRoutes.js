const express = require('express');
const multer = require('multer');
const path = require('path');
const { uploadFile, downloadFile } = require('../controllers/fileController');

const router = express.Router();

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to store uploaded files
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname); // Get file extension
        cb(null, `${Date.now()}${ext}`); // Use timestamp as the filename
    },
});

// Allowed MIME types for uploaded files
const allowedMimeTypes = [
    'image/png', 'image/jpeg', 'image/jpg',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/zip',
    'application/json'
];

// Configure multer middleware
const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return cb(new Error('Invalid file type. Only PNG, JPEG, PDF, DOC, TXT, ZIP, and more are allowed.'));
        }
        cb(null, true);
    },
    limits: { fileSize: 100 * 1024 * 1024 }  // Limit file size to 100MB
}).single('file');

// Route for uploading files
router.post('/upload', upload, uploadFile);

// Route for downloading files using a 4-digit code
router.get('/download/:code', downloadFile);

module.exports = router;