const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 5000;
const DB_FILE = path.join(__dirname, 'db.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Helper to read DB
const readDb = () => {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify({ sales: [] }, null, 2));
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
};

// Helper to write DB
const writeDb = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// Ensure DB exists
readDb();

// Routes

// GET /api/sales - Retrieve all sales
app.get('/api/sales', (req, res) => {
    try {
        const db = readDb();
        res.json(db.sales);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read database' });
    }
});

// POST /api/sales - Add a new sale
app.post('/api/sales', (req, res) => {
  try {
      const { date, productName, category, price, cost } = req.body;

      if (!date || !productName || !category || price === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const db = readDb();
      
      const newSale = {
        id: uuidv4(),
        date,
        productName,
        category,
        price: parseFloat(price),
        cost: cost !== undefined ? parseFloat(cost) : 0
      };

      db.sales.push(newSale);
      writeDb(db);

      res.status(201).json(newSale);
  } catch (error) {
      res.status(500).json({ error: 'Failed to save sale' });
  }
});

// DELETE /api/sales/:id - Delete a sale by ID
app.delete('/api/sales/:id', (req, res) => {
    try {
        const { id } = req.params;
        const db = readDb();
        
        const initialLength = db.sales.length;
        db.sales = db.sales.filter(sale => sale.id !== id);
        
        if (db.sales.length === initialLength) {
            return res.status(404).json({ error: 'Sale not found' });
        }
        
        writeDb(db);
        res.status(200).json({ message: 'Sale deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete sale' });
    }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
