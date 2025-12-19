import React, { useState } from 'react';
import { createSale } from '../api/sales';
import { Plus } from 'lucide-react';

const SaleForm = ({ onSaleAdded }) => {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        productName: '',
        category: 'Formation',
        price: '',
        cost: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createSale(formData);
            if (onSaleAdded) onSaleAdded();
            
            setFormData({
                date: formData.date,
                productName: '',
                category: 'Formation',
                price: '',
                cost: ''
            });
        } catch (error) {
            console.error("Error adding sale:", error);
            alert("Erreur lors de l'ajout de la vente.");
        }
    };

    const inputClasses = "w-full px-3 py-2 bg-[#FCFCFD] dark:bg-[#121212] border border-[#E5E5E7] dark:border-[#262626] text-[#1A1A1A] dark:text-[#F5F5F5] text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 transition-all duration-150 rounded-md";
    const labelClasses = "block text-xs font-medium text-[#6B6B6B] dark:text-[#A3A3A3] mb-2";

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={labelClasses}>Date</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className={`${inputClasses} dark:[color-scheme:dark]`}
                        required
                    />
                </div>
                <div>
                    <label className={labelClasses}>Catégorie</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={inputClasses}
                    >
                        <option value="Formation">Formation</option>
                        <option value="Ebook">Ebook</option>
                        <option value="Coaching">Coaching</option>
                        <option value="Service">Service</option>
                    </select>
                </div>
            </div>

            <div>
                <label className={labelClasses}>Nom du Produit</label>
                <input
                    type="text"
                    name="productName"
                    value={formData.productName}
                    onChange={handleChange}
                    className={inputClasses}
                    placeholder="Ex: Formation React Avancée"
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={labelClasses}>Prix de Vente (€)</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className={inputClasses}
                        step="0.01"
                        min="0"
                        required
                    />
                </div>
                <div>
                    <label className={labelClasses}>Coût (€)</label>
                    <input
                        type="number"
                        name="cost"
                        value={formData.cost}
                        onChange={handleChange}
                        className={inputClasses}
                        step="0.01"
                        min="0"
                        required
                    />
                </div>
            </div>

            <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-150 text-sm shadow-md hover:shadow-lg"
            >
                Ajouter la Transaction
            </button>
        </form>
    );
};

export default SaleForm;
