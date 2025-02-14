require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// Configure CORS to allow requests from multiple origins
const allowedOrigins = [
  'https://dancbsabao.github.io', // GitHub Pages
  'http://127.0.0.1:5500',        // Local development (file server)
  'http://localhost:3000',        // Localhost (adjust port if needed)
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json());

// ✅ **New API to Serve Configurations Securely**
app.get('/config', (req, res) => {
    res.json({
        apiKey: process.env.GOOGLE_API_KEY,
        spreadsheetId: process.env.SPREADSHEET_ID,
        range: 'Sheet1!A:F'
    });
});

// ✅ **Secure API Endpoint to Fetch Google Sheets Data**
app.get('/api/data', async (req, res) => {
    try {
        const apiKey = process.env.GOOGLE_API_KEY;
        const spreadsheetId = process.env.SPREADSHEET_ID;
        const range = 'Sheet1!A:F';

        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data' });
    }
});

// Handle 404 errors for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Use the port assigned by Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
