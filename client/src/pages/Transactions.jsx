import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import { fetchSales, deleteSale } from '../api/sales';
import { Search, Trash2 } from 'lucide-react';

const Transactions = () => {
    const [sales, setSales] = useState([]);
    const [filter, setFilter] = useState('');

    const loadSales = async () => {
        const data = await fetchSales();
        setSales(data.sort((a,b) => new Date(b.date) - new Date(a.date)));
    };

    useEffect(() => {
        loadSales();
    }, []);

    const handleDelete = async (id, productName) => {
        if (window.confirm(`Supprimer "${productName}" ?`)) {
            try {
                await deleteSale(id);
                loadSales();
            } catch (error) {
                alert('Erreur lors de la suppression');
            }
        }
    };

    const filteredSales = sales.filter(s => 
        s.productName.toLowerCase().includes(filter.toLowerCase()) || 
        s.category.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <Layout>
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">Historique des Transactions</h1>
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Rechercher..." 
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-[#E5E5E7] dark:border-[#262626] bg-[#FCFCFD] dark:bg-[#121212] text-[#1A1A1A] dark:text-[#F5F5F5] text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 transition-all duration-150 rounded-md"
                    />
                    <Search className="w-4 h-4 text-[#9E9E9E] dark:text-[#737373] absolute left-3 top-3" />
                </div>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[#E5E5E7] dark:divide-[#262626]">
                        <thead className="bg-[#F0F0F1] dark:bg-[#1A1A1A]">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[#9E9E9E] dark:text-[#737373] uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[#9E9E9E] dark:text-[#737373] uppercase tracking-wider">Produit</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[#9E9E9E] dark:text-[#737373] uppercase tracking-wider">Catégorie</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-[#9E9E9E] dark:text-[#737373] uppercase tracking-wider">Prix</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-[#9E9E9E] dark:text-[#737373] uppercase tracking-wider">Coût</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-[#9E9E9E] dark:text-[#737373] uppercase tracking-wider">Marge</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-[#9E9E9E] dark:text-[#737373] uppercase tracking-wider"></th>
                            </tr>
                        </thead>
                        <tbody className="bg-[#FCFCFD] dark:bg-[#121212] divide-y divide-[#E5E5E7] dark:divide-[#262626]">
                            {filteredSales.map((sale) => (
                                <tr key={sale.id} className="hover:bg-[#F7F7F8] dark:hover:bg-[#1A1A1A] transition-colors duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B6B6B] dark:text-[#A3A3A3]">
                                        {new Date(sale.date).toLocaleDateString('fr-FR')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#1A1A1A] dark:text-[#F5F5F5]">
                                        {sale.productName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B6B6B] dark:text-[#A3A3A3]">
                                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            sale.category === 'Formation' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' :
                                            sale.category === 'Ebook' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' :
                                            sale.category === 'Coaching' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' :
                                            'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                                        }`}>
                                            {sale.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1A1A1A] dark:text-[#F5F5F5] text-right">
                                        {sale.price.toFixed(2)}€
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B6B6B] dark:text-[#A3A3A3] text-right">
                                        {sale.cost.toFixed(2)}€
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1A1A1A] dark:text-[#F5F5F5] font-medium text-right">
                                        {(sale.price - sale.cost).toFixed(2)}€
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                        <button
                                            onClick={() => handleDelete(sale.id, sale.productName)}
                                            className="p-2 rounded-lg text-[#9E9E9E] hover:text-red-600 hover:bg-red-50 dark:text-[#737373] dark:hover:text-red-400 dark:hover:bg-red-950/20 transition-all duration-150"
                                            title="Supprimer"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredSales.length === 0 && (
                        <div className="p-8 text-center text-[#6B6B6B] dark:text-[#A3A3A3]">
                            Aucune transaction trouvée.
                        </div>
                    )}
                </div>
            </Card>
        </Layout>
    );
};

export default Transactions;
