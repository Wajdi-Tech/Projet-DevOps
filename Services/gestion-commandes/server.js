import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import orderRoutes from './routes/orderRoutes.js'; // Note the .js extension
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());

// Middleware
app.use(express.json());

// MongoDB connection to the main database (gestion-commandes)
console.log('Mongo URI:', process.env.MON_URI);
mongoose.connect(process.env.MON_URI || 'mongodb://localhost:27017/gestion-commandes')
  .then(() => console.log('Connected to gestion-commandes MongoDB'))
  .catch(err => console.log('MongoDB connection error: ', err));

// Routes
app.use('/api', orderRoutes);

// Start the server
const PORT = process.env.PORT || 5100;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
