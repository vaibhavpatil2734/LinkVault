const express = require('express');
const multer = require('multer');
const path = require('path');
const { uploadFile, downloadFile } = require('../controllers/fileController');

const router = express.Router();


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
       
        const ext = path.extname(file.originalname); 
        cb(null, `${Date.now()}${ext}`); 
    },
});


const allowedMimeTypes = [
    'image/png', 'image/jpeg', 'image/jpg',      
    'application/pdf',                          
    'application/msword',                     
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',  
    'text/plain',                            
    'application/zip',                         
    'application/json'                        
];


const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return cb(new Error('Invalid file type. Only PNG, JPEG, PDF, DOC, TXT, ZIP, and more are allowed.'));
        }
        cb(null, true);
    },
    limits: { fileSize: 100 * 1024 * 1024 }  
}).single('file');  

router.post('/upload', upload, uploadFile);  
router.get('/:id', downloadFile);  

module.exports = router;
