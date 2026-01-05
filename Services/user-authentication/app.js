const express = require('express');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

app.get('/health', (req, res) => res.status(200).json({ status: 'UP' }));

module.exports = app;
