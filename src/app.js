import express from 'express';
import authRoutes from './routes/auth.js';

const app = express();

//middleware to parse json request bodies
app.use(express.json());

//mount auth routes
app.use('/api/auth', authRoutes);

//health check endpoint
app.get('/health', (req, res) => {
    res.ststus(200).json({ status: 'OK', timestamp: new Date().toISOStrinng()   });
});

export default app;