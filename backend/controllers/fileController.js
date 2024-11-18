const File = require('../models/fileModel');
const path = require('path');

// Handle file upload
const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            console.log('No file uploaded');
            return res.status(400).json({ message: 'No file uploaded' });
        }

        console.log('Uploading file:', req.file);

        const file = new File({
            filename: req.file.originalname,
            path: req.file.path,
            size: req.file.size,
        });

        await file.save();
        console.log('File saved to the database:', file);

        res.status(201).json({
            message: 'File uploaded successfully',
            fileId: file._id,
        });
    } catch (error) {
        console.log('Error during file upload:', error);
        res.status(500).json({ message: error.message });
    }
};

// Download file
const downloadFile = async (req, res) => {
    try {
        // Find the file in the database
        const file = await File.findById(req.params.id);
        if (!file) {
            console.log('File not found in database');
            return res.status(404).json({ message: 'File not found' });
        }

        console.log('File found:', file);

        const filePath = path.resolve(file.path);
        console.log('Resolved file path:', filePath);

        const fileExtension = path.extname(file.filename).toLowerCase();
        console.log('File extension:', fileExtension);

        // Set the MIME type based on the file extension
        let mimeType;
        switch (fileExtension) {
            case '.png':
                mimeType = 'image/png';
                break;
            case '.jpg':
            case '.jpeg':
                mimeType = 'image/jpeg';
                break;
            case '.gif':
                mimeType = 'image/gif';
                break;
            case '.pdf':
                mimeType = 'application/pdf';
                break;
            default:
                mimeType = 'application/octet-stream'; // Fallback for unknown file types
        }

        console.log('MIME type set to:', mimeType);

        // Set the appropriate headers for the download
        res.setHeader('Content-Type', mimeType);
        res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);

        // Send the file as a download using sendFile instead of download
        res.sendFile(filePath, (err) => {
            if (err) {
                console.log('Error during file download:', err);
                return res.status(500).json({ message: err.message });
            }
            console.log('File download started successfully');
        });
    } catch (error) {
        console.log('Error in downloadFile:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { uploadFile, downloadFile };
