import React, { useState } from 'react';
import axios from 'axios';
import './FileUpload.css';

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [fileCode, setFileCode] = useState('');
    const [downloadCode, setDownloadCode] = useState(''); // New state for download code

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

            const uploadedFileCode = response.data.code;

            setFileCode(uploadedFileCode);
            setMessage('File uploaded successfully!');
        } catch (error) {
            setMessage('Error uploading file');
            console.error(error);
        }
    };

    const handleDownload = async () => {
        if (!downloadCode) {
            setMessage('Please enter a download code');
            return;
        }
    
        try {
            const response = await fetch(`https://linkvault-35mf.onrender.com/api/files/download/${downloadCode}`, {
                method: 'GET',
            });
    
            if (!response.ok) {
                throw new Error('Failed to download file');
            }
    
            const blob = await response.blob(); // Convert response to a Blob
            const contentDisposition = response.headers.get('Content-Disposition');
            const filename = contentDisposition
                ? contentDisposition.split('filename=')[1].replace(/"/g, '')
                : 'downloaded-file';
    
            // Create a download link and trigger it
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
    
            // Clean up
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading file:', error);
            setMessage('Error downloading file');
        }
    };
    
    
    

    return (
        <div className="upload-container">
            <h1 className="title">Secure File Sharing</h1>

            {/* File Upload Box */}
            <div className="operation-box">
                <h2>Upload Your File</h2>
                <input type="file" onChange={handleFileChange} />
                <button className="upload-btn" onClick={handleUpload}>
                    Upload File
                </button>
            </div>

            {/* File Code Box */}
            {fileCode && (
                <div className="operation-box">
                    <h2>Generated File Code</h2>
                    <h3>Use this 4-digit code to verify and download your file.</h3>
                    <p>Code: {fileCode}</p>
                    <button className="copy-btn" onClick={() => navigator.clipboard.writeText(fileCode)}>
                        Copy Code
                    </button>
                </div>
            )}

            {/* File Download Box */}
            <div className="operation-box">
                <h2>Download File</h2>
                <h3>Enter the 4-digit code to securely access your file.</h3>
                <input
                    type="text"
                    placeholder="Enter code to download"
                    value={downloadCode}
                    onChange={(e) => setDownloadCode(e.target.value)} // Update downloadCode state
                />
                <button className="download-btn" onClick={handleDownload}>
                    Download File
                </button>
            </div>

            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default FileUpload;
