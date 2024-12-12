const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./db');
const fileRoutes = require('./routes/fileRoutes');

// Load environment variables from .env file
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Middleware
app.use(express.json());

// Configure CORS to allow specific origins
const allowedOrigins = [
    'https://linkvault1.netlify.app',
    'http://localhost:5000',
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, 
}));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/files', fileRoutes);

// Root route (optional)
app.get('/', (req, res) => {
    res.send('Welcome to the File Sharing App API');
});

// Error handling middleware (optional)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Define the port, default to 5000 if not set in .env
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
