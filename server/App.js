const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();

dotenv.config({
    path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'
});

const PORT = process.env.PORT || 5000;

const corsOptions = {
    origin: process.env.ORIGIN || "http://localhost:3000",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// Routes
app.use('/api', authRoutes);
app.use('/api', taskRoutes);

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI || "mongodb://localhost:27017/Task-Management-App", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}, Database Connected!`)))
    .catch((error) => console.log('MongoDB connection error:', error));
