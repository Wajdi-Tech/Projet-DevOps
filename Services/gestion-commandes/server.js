import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

// MongoDB connection to the main database (gestion-commandes)
console.log('Mongo URI:', process.env.MON_URI);
mongoose.connect(process.env.MON_URI || 'mongodb://localhost:27017/gestion-commandes')
  .then(() => console.log('Connected to gestion-commandes MongoDB'))
  .catch(err => console.log('MongoDB connection error: ', err));

// Start the server
const PORT = process.env.PORT || 5100;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
