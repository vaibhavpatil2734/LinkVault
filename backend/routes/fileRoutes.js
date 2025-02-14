const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const path = require('path');
const { uploadFile, downloadFile } = require('../controllers/fileController');

const router = express.Router();

// Configure AWS SDK
const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
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

// Configure Multer to use S3 storage
const upload = multer({
    storage: multerS3({
        s3,
        bucket: process.env.AWS_BUCKET_NAME,
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            cb(null, `${Date.now()}${ext}`); // Store file with timestamp
        }
    }),
    fileFilter: (req, file, cb) => {
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return cb(new Error('Invalid file type.'));
        }
        cb(null, true);
    },
    limits: { fileSize: 100 * 1024 * 1024 } // Limit file size to 100MB
}).single('file');

// Route for uploading files
router.post('/upload', upload, uploadFile);

// Route for downloading files using a 4-digit code
router.get('/download/:code', downloadFile);

module.exports = router;
