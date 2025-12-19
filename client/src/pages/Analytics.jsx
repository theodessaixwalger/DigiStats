import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import RevenueChart from '../components/charts/RevenueChart';
import CategoryChart from '../components/charts/CategoryChart';
import { fetchSales } from '../api/sales';

const Analytics = () => {
    const [sales, setSales] = useState([]);

    useEffect(() => {
        fetchSales().then(setSales);
    }, []);

    return (
        <Layout>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-6">Analyses Détaillées</h1>
            <div className="grid grid-cols-1 gap-8">
                <Card title="Performance Financière">
                    <RevenueChart sales={sales} />
                </Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card title="Répartition des Ventes">
                        <CategoryChart sales={sales} />
                    </Card>
                    <Card title="Insights">
                        <div className="p-4 text-[#6B6B6B] dark:text-[#A3A3A3]">
                            <p className="mb-2">💡 <strong>Conseil :</strong> Vos ventes de "Formation" surforment ce mois-ci.</p>
                            <p>📈 La croissance est stable.</p>
                        </div>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default Analytics;
