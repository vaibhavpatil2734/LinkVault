import React from 'react';
import FileUpload from './components/FileUpload';
import FileDownload from './components/FileDownload';

const App = () => {
    return (
        <div className="container">
            <h1>File Sharing App</h1>
            <FileUpload />
            <FileDownload />
        </div>
    );
};

export default App;
