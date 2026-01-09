require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Sale = require('./models/Sale');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB');
    })
    .catch((error) => {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    });

// Routes

// GET /api/sales - Retrieve all sales
app.get('/api/sales', async (req, res) => {
    try {
        const sales = await Sale.find().sort({ date: -1 });
        res.json(sales);
    } catch (error) {
        console.error('Error fetching sales:', error);
        res.status(500).json({ error: 'Failed to fetch sales' });
    }
});

// POST /api/sales - Add a new sale
app.post('/api/sales', async (req, res) => {
    try {
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
        res.status(201).json(newSale);
    } catch (error) {
        console.error('Error creating sale:', error);
        res.status(500).json({ error: 'Failed to create sale' });
    }
});

// DELETE /api/sales/:id - Delete a sale by ID
app.delete('/api/sales/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedSale = await Sale.findByIdAndDelete(id);

        if (!deletedSale) {
            return res.status(404).json({ error: 'Sale not found' });
        }

        res.status(200).json({ message: 'Sale deleted successfully' });
    } catch (error) {
        console.error('Error deleting sale:', error);
        res.status(500).json({ error: 'Failed to delete sale' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' 
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
});
