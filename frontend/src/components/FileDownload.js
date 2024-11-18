import React, { useState } from 'react';
import axios from 'axios';
import './FileUpload.css'; // Custom CSS file for styling

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [fileId, setFileId] = useState('');
    const [fileUrl, setFileUrl] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Please select a file');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:5000/api/files/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const uploadedFileId = response.data.fileId;
            const generatedUrl = `http://localhost:5000/api/files/${uploadedFileId}`;

            setFileId(uploadedFileId);
            setFileUrl(generatedUrl);
            setMessage('File uploaded successfully!');
        } catch (error) {
            setMessage('Error uploading file');
            console.error(error);
        }
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            setMessage('Copied to clipboard!');
        });
    };

    return (
        <div className="upload-container">
            <h1>File Upload</h1>
            <div className="file-upload">
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleUpload}>Upload</button>
            </div>
            {message && <p className="message">{message}</p>}
            {fileId && (
                <div className="file-info">
                    <div className="url-box">
                        <p>File ID:</p>
                        <span>{fileId}</span>
                        <button onClick={() => handleCopy(fileId)}>Copy ID</button>
                    </div>
                    <div className="url-box">
                        <p>File URL:</p>
                        <span>{fileUrl}</span>
                        <button onClick={() => handleCopy(fileUrl)}>Copy URL</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileUpload;
