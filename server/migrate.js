require('dotenv').config();
const mongoose = require('mongoose');
const Sale = require('./models/Sale');
const fs = require('fs');
const path = require('path');

const migrate = async () => {
    try {
        console.log('🔄 Starting migration...');
        
        // Connexion à MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Lire le fichier db.json
        const dbFile = path.join(__dirname, 'db.json');
        
        if (!fs.existsSync(dbFile)) {
            console.log('⚠️  No db.json file found. Nothing to migrate.');
            await mongoose.disconnect();
            return;
        }

        const data = JSON.parse(fs.readFileSync(dbFile, 'utf-8'));
        
        if (!data.sales || data.sales.length === 0) {
            console.log('⚠️  No sales data found in db.json');
            await mongoose.disconnect();
            return;
        }

        // Supprimer les anciennes données (optionnel)
        await Sale.deleteMany({});
        console.log('🗑️  Cleared existing data in MongoDB');

        // Insérer les données
        const sales = data.sales.map(sale => ({
            ...sale,
            date: new Date(sale.date)
        }));
        
        await Sale.insertMany(sales);
        console.log(`✅ Successfully migrated ${sales.length} sales to MongoDB`);

        await mongoose.disconnect();
        console.log('✅ Migration complete!');
        
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
};

migrate();
