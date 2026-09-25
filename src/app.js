import express from 'express';
import authRoutes from './routes/auth.js';

const app = express();

//browser security permissions so front and backend can communicate smoothly
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

//middleware to parse json request bodies
app.use(express.json());

//mount auth routes
app.use('/api/auth', authRoutes);

//health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default app;
