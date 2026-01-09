const mongoose = require('mongoose');
const Sale = require('./Sale');

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
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        await connectToDatabase();

        // GET /api/sales - Retrieve all sales
        if (req.method === 'GET') {
            const sales = await Sale.find().sort({ date: -1 });
            return res.status(200).json(sales);
        }

        // POST /api/sales - Add a new sale
        if (req.method === 'POST') {
            const { date, productName, category, price, cost } = req.body;

            if (!date || !productName || !category || price === undefined) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const newSale = new Sale({
                date,
                productName,
                category,
                price: parseFloat(price),
                cost: cost !== undefined ? parseFloat(cost) : 0
            });

            await newSale.save();
            return res.status(201).json(newSale);
        }

        // DELETE /api/sales/:id - Delete a sale by ID
        if (req.method === 'DELETE') {
            // Extract ID from URL path (e.g., /api/sales/123 -> 123)
            const urlParts = req.url.split('/');
            const id = urlParts[urlParts.length - 1].split('?')[0]; // Remove query params if any
            
            if (!id || id === 'sales') {
                return res.status(400).json({ error: 'Sale ID is required' });
            }
            
            const deletedSale = await Sale.findByIdAndDelete(id);

            if (!deletedSale) {
                return res.status(404).json({ error: 'Sale not found' });
            }

            return res.status(200).json({ message: 'Sale deleted successfully' });
        }

        return res.status(405).json({ error: 'Method not allowed' });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
