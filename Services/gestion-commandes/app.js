import express from 'express';
import orderRoutes from './routes/orderRoutes.js';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', orderRoutes);

app.get('/health', (req, res) => res.status(200).json({ status: 'UP' }));

export default app;
