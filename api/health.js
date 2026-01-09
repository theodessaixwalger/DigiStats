require('dotenv').config({ path: '../server/.env' });
const mongoose = require('mongoose');

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
        return res.status(200).json({ 
            status: 'ok', 
            database: dbStatus,
            timestamp: new Date().toISOString()
        });
    }

    return res.status(405).json({ error: 'Method not allowed' });
};
