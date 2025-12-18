const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const leavesRoutes = require('./routes/leaves');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error('Error middleware:', err.message);
  if (err.type === 'entity.parse.failed') {
    res.status(400).json({ message: 'Invalid JSON format' });
  } else {
    res.status(500).json({ message: 'Something went wrong!' });
  }
});

// Add request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Test route to check JSON parsing
app.post('/test-json', (req, res) => {
  console.log('Received body:', req.body);
  res.json({ received: req.body, type: typeof req.body });
});

app.use('/auth', authRoutes);
app.use('/leaves', leavesRoutes);

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

connectDB();

module.exports = app;