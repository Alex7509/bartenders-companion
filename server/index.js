import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cocktailRoutes from './routes/cocktails.js';
import authRoutes from './routes/auth.js';
import favoriteRoutes from './routes/favorites.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/cocktails', cocktailRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoriteRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => console.error('DB connection error:', err));