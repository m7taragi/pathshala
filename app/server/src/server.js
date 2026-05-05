const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Secure CORS to only allow the frontend URL (GitHub Pages) or localhost
app.use(cors({
  origin: process.env.CLIENT_URL || '*', 
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Test Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, { family: 4 })
.then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});
