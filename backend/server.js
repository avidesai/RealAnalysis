const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan'); // For logging HTTP requests
const dotenv = require('dotenv');
dotenv.config();

const propertyRoutes = require('./routes/propertyRoutes');
const userRoutes = require('./routes/userRoutes');
const calculationRoutes = require('./routes/calculationRoutes');
const stripeRoutes = require('./routes/stripeRoutes'); // Import the new stripeRoutes

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Use frontend URL in production
  credentials: true
}));
app.use(morgan('dev')); // Log all HTTP requests
app.use(express.json()); // Parse JSON bodies

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Use Routes
app.use('/api/properties', propertyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/calculations', calculationRoutes);
app.use('/api/stripe', stripeRoutes); // Use the Stripe routes

// Centralized error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'An internal server error occurred' });
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
