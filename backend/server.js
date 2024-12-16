// /server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config();

const propertyRoutes = require('./routes/propertyRoutes');
const userRoutes = require('./routes/userRoutes');
const calculationRoutes = require('./routes/calculationRoutes');
const stripeRoutes = require('./routes/stripeRoutes');

const app = express();

app.use(cors({
  origin: [process.env.FRONTEND_URL, 'https://caprateio.vercel.app', 'http://localhost:3000'],
  credentials: true,
}));

app.use(morgan('dev'));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => res.json({ message: 'Welcome to the CapRate API' }));

app.use('/api/properties', propertyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/calculations', calculationRoutes);
app.use('/api/stripe', stripeRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'An internal server error occurred' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
