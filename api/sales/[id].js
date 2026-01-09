const mongoose = require('mongoose');
const Sale = require('../models/Sale');

let isConnected = false;

async function connectToDatabase() {
    if (isConnected) {
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        isConnected = true;
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        throw error;
    }
}

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        await connectToDatabase();

        // Extract ID from query parameter
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ error: 'Sale ID is required' });
        }

        // DELETE /api/sales/[id] - Delete a sale by ID
        if (req.method === 'DELETE') {
            const deletedSale = await Sale.findByIdAndDelete(id);

            if (!deletedSale) {
                return res.status(404).json({ error: 'Sale not found' });
            }

            return res.status(200).json({ message: 'Sale deleted successfully' });
        }

        // GET /api/sales/[id] - Get a single sale by ID (optional)
        if (req.method === 'GET') {
            const sale = await Sale.findById(id);

            if (!sale) {
                return res.status(404).json({ error: 'Sale not found' });
            }

            return res.status(200).json(sale);
        }

        return res.status(405).json({ error: 'Method not allowed' });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};
