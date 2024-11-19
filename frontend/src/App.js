import React from 'react';
import FileUpload from './components/FileUpload';
import Navbar from './components/Navbar';

const App = () => {
    return (
        <div className="container">
            <Navbar/>
            <FileUpload />
        </div>
    );
};

export default App;
