const File = require('../models/fileModel');
const path = require('path');

// Helper function to generate a unique 4-digit code
const generateUniqueCode = async () => {
    let code;
    let exists = true;
    while (exists) {
        code = Math.floor(1000 + Math.random() * 9000).toString(); // Generate 4-digit code
        exists = await File.exists({ code }); // Check for uniqueness
    }
    return code;
};

// Handle file upload
const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            console.log('No file uploaded');
            return res.status(400).json({ message: 'No file uploaded' });
        }

        console.log('Uploading file:', req.file);

        const uniqueCode = await generateUniqueCode();

        const file = new File({
            filename: req.file.originalname,
            path: req.file.path,
            size: req.file.size,
            code: uniqueCode, // Save the generated code
        });

        await file.save();
        console.log('File saved to the database:', file);

        res.status(201).json({
            message: 'File uploaded successfully',
            code: uniqueCode, // Return the code to the client
        });
    } catch (error) {
        console.log('Error during file upload:', error);
        res.status(500).json({ message: error.message });
    }
};

// Handle file download
const downloadFile = async (req, res) => {
    try {
        // Find the file in the database by code
        const file = await File.findOne({ code: req.params.code });
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        const filePath = path.resolve(file.path); // Absolute path to the file
        const fileExtension = path.extname(file.filename); // Get the file extension
        const mimeType = getMimeType(fileExtension); // Resolve MIME type based on extension

        // Log the MIME type in the terminal
        console.log(`Preparing download for file: ${file.filename}, MIME type: ${mimeType}`);

        // Set headers for file download
        res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
        res.setHeader('Content-Type', mimeType);

        // Serve the file
        res.sendFile(filePath, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).json({ message: 'Error sending file' });
            }
        });
    } catch (error) {
        console.error('Error in downloadFile:', error);
        res.status(500).json({ message: error.message });
    }
};

// Helper function to get MIME type based on file extension
const getMimeType = (extension) => {
    const mimeTypes = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.pdf': 'application/pdf',
        '.txt': 'text/plain',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        '.zip': 'application/zip',
        '.mp4': 'video/mp4',
        '.mp3': 'audio/mpeg',
        // Add other extensions as needed
    };

    return mimeTypes[extension.toLowerCase()] || 'application/octet-stream';
};

module.exports = { uploadFile, downloadFile };
