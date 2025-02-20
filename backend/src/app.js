require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const knex = require('knex');
const knexConfig = require('../knexfile'); 
const routes = require('./routes/index');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Database connection
const db = knex(knexConfig.development);

// Routes
app.use('/api', routes);

// Serve static files from the frontend build directory
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// Catch-all handler to serve the frontend's index.html for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist', 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});