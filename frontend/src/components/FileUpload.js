import React, { useState } from 'react';
import axios from 'axios';
import './FileUpload.css';

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
            <h1 className="title">File Operations</h1>

            {/* File Upload Box */}
            <div className="operation-box">
                <h2>File Upload</h2>
                <input type="file" onChange={handleFileChange} />
                <button className="upload-btn" onClick={handleUpload}>
                    Upload
                </button>
            </div>

            {/* File Information Box */}
            {fileId && (
                <div className="operation-box">
                    <h2>File Information</h2>
                    <div className="info-row">
                        <p>File URL:</p>
                        <span className="info-text">{fileUrl}</span>
                        <button className="copy-btn" onClick={() => handleCopy(fileUrl)}>
                            Copy URL
                        </button>
                    </div>
                </div>
            )}

            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default FileUpload;
