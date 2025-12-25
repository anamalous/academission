require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB connected successfully!');
    } catch (error) {
        console.error(`❌ MongoDB connection failed: ${error.message}`);
        process.exit(1); 
    }
};
connectDB();

app.use(express.json());
app.get('/', (req, res) => {res.send('AcademiaLink API is running...');});

const allowedOrigins = [
    'http://localhost:3000', 
    'https://academialink.netlify.app'
];

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(express.json());

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes); 

const postRoutes = require('./routes/postRoutes');
app.use('/api/posts', postRoutes); 

const subjectRoutes = require('./routes/subjectRoutes');
app.use('/api/subjects', subjectRoutes);

const commentRoutes = require('./routes/commentRoutes');
app.use('/api/comments', commentRoutes);

const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);



app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});