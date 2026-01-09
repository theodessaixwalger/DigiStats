import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import { fetchSales, deleteSale } from '../api/sales';
import { Search, Trash2 } from 'lucide-react';

const Transactions = () => {
    const [sales, setSales] = useState([]);
    const [filters, setFilters] = useState({
        search: '',
        startDate: '',
        endDate: '',
        categories: [],
        minPrice: '',
        maxPrice: ''
    });
    const [showFilters, setShowFilters] = useState(true);

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

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleCategoryToggle = (category) => {
        setFilters(prev => ({
            ...prev,
            categories: prev.categories.includes(category)
                ? prev.categories.filter(c => c !== category)
                : [...prev.categories, category]
        }));
    };

    const resetFilters = () => {
        setFilters({
            search: '',
            startDate: '',
            endDate: '',
            categories: [],
            minPrice: '',
            maxPrice: ''
        });
    };

    const filteredSales = sales.filter(sale => {
        // Search filter
        if (filters.search && 
            !sale.productName.toLowerCase().includes(filters.search.toLowerCase()) && 
            !sale.category.toLowerCase().includes(filters.search.toLowerCase())) {
            return false;
        }

        // Date range filter
        const saleDate = new Date(sale.date);
        if (filters.startDate && saleDate < new Date(filters.startDate)) {
            return false;
        }
        if (filters.endDate && saleDate > new Date(filters.endDate)) {
            return false;
        }

        // Category filter
        if (filters.categories.length > 0 && !filters.categories.includes(sale.category)) {
            return false;
        }

        // Price range filter
        if (filters.minPrice && sale.price < parseFloat(filters.minPrice)) {
            return false;
        }
        if (filters.maxPrice && sale.price > parseFloat(filters.maxPrice)) {
            return false;
        }

        return true;
    });

    return (
        <Layout>
            <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">Historique des Transactions</h1>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="text-sm text-[#6B6B6B] dark:text-[#A3A3A3] hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-150"
                    >
                        {showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}
                    </button>
                </div>

                {showFilters && (
                    <Card>
                        <div className="space-y-4">
                            {/* Search Bar */}
                            <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder="Rechercher par nom de produit ou catégorie..." 
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-[#E5E5E7] dark:border-[#262626] bg-[#FCFCFD] dark:bg-[#121212] text-[#1A1A1A] dark:text-[#F5F5F5] text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 transition-all duration-150 rounded-md"
                                />
                                <Search className="w-4 h-4 text-[#9E9E9E] dark:text-[#737373] absolute left-3 top-3" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Date Range */}
                                <div>
                                    <label className="block text-xs font-medium text-[#6B6B6B] dark:text-[#A3A3A3] mb-2">Date de début</label>
                                    <input
                                        type="date"
                                        value={filters.startDate}
                                        onChange={(e) => handleFilterChange('startDate', e.target.value)}
                                        className="w-full px-3 py-2 border border-[#E5E5E7] dark:border-[#262626] bg-[#FCFCFD] dark:bg-[#121212] text-[#1A1A1A] dark:text-[#F5F5F5] text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 transition-all duration-150 rounded-md dark:[color-scheme:dark]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#6B6B6B] dark:text-[#A3A3A3] mb-2">Date de fin</label>
                                    <input
                                        type="date"
                                        value={filters.endDate}
                                        onChange={(e) => handleFilterChange('endDate', e.target.value)}
                                        className="w-full px-3 py-2 border border-[#E5E5E7] dark:border-[#262626] bg-[#FCFCFD] dark:bg-[#121212] text-[#1A1A1A] dark:text-[#F5F5F5] text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 transition-all duration-150 rounded-md dark:[color-scheme:dark]"
                                    />
                                </div>

                                {/* Price Range */}
                                <div>
                                    <label className="block text-xs font-medium text-[#6B6B6B] dark:text-[#A3A3A3] mb-2">Prix min (€)</label>
                                    <input
                                        type="number"
                                        value={filters.minPrice}
                                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                        placeholder="0"
                                        min="0"
                                        step="0.01"
                                        className="w-full px-3 py-2 border border-[#E5E5E7] dark:border-[#262626] bg-[#FCFCFD] dark:bg-[#121212] text-[#1A1A1A] dark:text-[#F5F5F5] text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 transition-all duration-150 rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#6B6B6B] dark:text-[#A3A3A3] mb-2">Prix max (€)</label>
                                    <input
                                        type="number"
                                        value={filters.maxPrice}
                                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                        placeholder="∞"
                                        min="0"
                                        step="0.01"
                                        className="w-full px-3 py-2 border border-[#E5E5E7] dark:border-[#262626] bg-[#FCFCFD] dark:bg-[#121212] text-[#1A1A1A] dark:text-[#F5F5F5] text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 transition-all duration-150 rounded-md"
                                    />
                                </div>
                            </div>

                            {/* Categories */}
                            <div>
                                <label className="block text-xs font-medium text-[#6B6B6B] dark:text-[#A3A3A3] mb-2">Catégories</label>
                                <div className="flex flex-wrap gap-3">
                                    {['Service', 'Ebook', 'Vinted'].map(category => (
                                        <label key={category} className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={filters.categories.includes(category)}
                                                onChange={() => handleCategoryToggle(category)}
                                                className="w-4 h-4 text-indigo-600 border-[#E5E5E7] dark:border-[#262626] rounded focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 cursor-pointer"
                                            />
                                            <span className={`text-sm px-2.5 py-1 rounded-full transition-all duration-150 ${
                                                filters.categories.includes(category)
                                                    ? category === 'Service' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' :
                                                      category === 'Ebook' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' :
                                                      'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                                                    : 'bg-[#F0F0F1] dark:bg-[#1A1A1A] text-[#6B6B6B] dark:text-[#A3A3A3] group-hover:bg-[#E5E5E7] dark:group-hover:bg-[#262626]'
                                            }`}>
                                                {category}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Reset Button */}
                            <div className="flex justify-between items-center pt-2 border-t border-[#E5E5E7] dark:border-[#262626]">
                                <p className="text-sm text-[#6B6B6B] dark:text-[#A3A3A3]">
                                    <span className="font-medium text-[#1A1A1A] dark:text-[#F5F5F5]">{filteredSales.length}</span> transaction{filteredSales.length > 1 ? 's' : ''} trouvée{filteredSales.length > 1 ? 's' : ''}
                                </p>
                                <button
                                    onClick={resetFilters}
                                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors duration-150"
                                >
                                    Réinitialiser les filtres
                                </button>
                            </div>
                        </div>
                    </Card>
                )}
            </div>

            <Card>
                <div className="overflow-x-auto -mx-6 sm:mx-0">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden">
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
                                <tr key={sale._id} className="hover:bg-[#F7F7F8] dark:hover:bg-[#1A1A1A] transition-colors duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B6B6B] dark:text-[#A3A3A3]">
                                        {new Date(sale.date).toLocaleDateString('fr-FR')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#1A1A1A] dark:text-[#F5F5F5]">
                                        {sale.productName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B6B6B] dark:text-[#A3A3A3]">
                                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            sale.category === 'Service' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' :
                                            sale.category === 'Ebook' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' :
                                            'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
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
                                            onClick={() => handleDelete(sale._id, sale.productName)}
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
                    </div>
                </div>
            </Card>
        </Layout>
    );
};

export default Transactions;
