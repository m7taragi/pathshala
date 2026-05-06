const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./shared/errorHandler');

// Route imports
const authRoutes = require('./modules/auth/auth.routes');
const officeRoutes = require('./modules/offices/office.routes');
const formRoutes = require('./modules/forms/form.routes');
const submissionRoutes = require('./modules/submissions/submission.routes');
const userRoutes = require('./modules/users/user.routes');
const adminRoutes = require('./modules/admin/admin.routes');



const app = express();

// --- Core Middleware ---
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Health Check ---
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'CAVE-CORE API is alive', timestamp: new Date().toISOString() });
});

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/offices', officeRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);



// --- 404 Handler ---
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.originalUrl} not found` });
});

// --- Global Error Handler ---
app.use(errorHandler);

module.exports = app;
