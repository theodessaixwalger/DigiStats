import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import ForecastChart from '../components/charts/ForecastChart';
import { fetchSales } from '../api/sales';
import { TrendingUp, Calendar, Target, Zap } from 'lucide-react';

const Forecast = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSales = async () => {
            try {
                const data = await fetchSales();
                setSales(data);
            } catch (error) {
                console.error("Failed to load sales", error);
            } finally {
                setLoading(false);
            }
        };
        loadSales();
    }, []);

    // Calculate forecast metrics
    const calculateMetrics = () => {
        if (sales.length === 0) {
            return {
                avgDailyRevenue: 0,
                projectedMonthly: 0,
                growthRate: 0,
                confidence: 0
            };
        }

        // Get current month data
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const currentMonthSales = sales.filter(s => {
            const date = new Date(s.date);
            return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        });

        const currentMonthRevenue = currentMonthSales.reduce((sum, s) => sum + s.price, 0);
        const currentDay = new Date().getDate();
        const avgDailyRevenue = currentDay > 0 ? currentMonthRevenue / currentDay : 0;

        // Calculate days in month
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const projectedMonthly = avgDailyRevenue * daysInMonth;

        // Calculate growth rate (compare to last month)
        const lastMonth = currentMonth - 1;
        const lastMonthSales = sales.filter(s => {
            const date = new Date(s.date);
            return date.getMonth() === lastMonth && date.getFullYear() === currentYear;
        });
        const lastMonthRevenue = lastMonthSales.reduce((sum, s) => sum + s.price, 0);
        const growthRate = lastMonthRevenue > 0 
            ? ((projectedMonthly - lastMonthRevenue) / lastMonthRevenue) * 100 
            : 0;

        // Calculate confidence based on data consistency
        const confidence = Math.min(95, 60 + (currentMonthSales.length * 2));

        return {
            avgDailyRevenue,
            projectedMonthly,
            growthRate,
            confidence
        };
    };

    const metrics = calculateMetrics();

    const StatCard = ({ title, value, subtitle, icon: Icon, color }) => (
        <div className={`bg-gradient-to-br ${color} rounded-xl p-6 border border-opacity-20`}>
            <div className="flex items-start justify-between mb-3">
                <div className="p-3 rounded-lg bg-white/20 backdrop-blur-sm">
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
            <p className="text-sm text-white/80 mb-1">{title}</p>
            <p className="text-2xl font-bold text-white mb-1">{value}</p>
            <p className="text-xs text-white/70">{subtitle}</p>
        </div>
    );

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-64">
                    <p className="text-[#6B6B6B] dark:text-[#A3A3A3]">Chargement des prévisions...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
                    Prévisions Offensives
                </h1>
                <p className="text-sm text-[#6B6B6B] dark:text-[#A3A3A3]">
                    Projections basées sur vos performances actuelles
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <StatCard
                    title="Moyenne Journalière"
                    value={`${metrics.avgDailyRevenue.toFixed(2)}€`}
                    subtitle="Revenu par jour"
                    icon={Calendar}
                    color="from-indigo-500 to-purple-500"
                />
                <StatCard
                    title="Projection Mensuelle"
                    value={`${metrics.projectedMonthly.toFixed(2)}€`}
                    subtitle="Fin de mois estimée"
                    icon={Target}
                    color="from-amber-500 to-orange-500"
                />
                <StatCard
                    title="Taux de Croissance"
                    value={`${metrics.growthRate >= 0 ? '+' : ''}${metrics.growthRate.toFixed(1)}%`}
                    subtitle="vs mois dernier"
                    icon={TrendingUp}
                    color={metrics.growthRate >= 0 ? "from-emerald-500 to-teal-500" : "from-red-500 to-pink-500"}
                />
                <StatCard
                    title="Confiance"
                    value={`${metrics.confidence.toFixed(0)}%`}
                    subtitle="Fiabilité prévision"
                    icon={Zap}
                    color="from-blue-500 to-cyan-500"
                />
            </div>

            {/* Forecast Chart */}
            <Card title="Projection sur 30 Jours" icon={TrendingUp}>
                {sales.length > 0 ? (
                    <ForecastChart sales={sales} />
                ) : (
                    <div className="h-96 flex items-center justify-center">
                        <p className="text-[#6B6B6B] dark:text-[#A3A3A3]">
                            Aucune donnée disponible pour générer des prévisions
                        </p>
                    </div>
                )}
            </Card>

            {/* Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <Card title="Insights & Recommandations">
                    <div className="space-y-4">
                        <div className="flex items-start gap-3 p-3 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg border border-indigo-100 dark:border-indigo-900/30">
                            <div className="text-2xl">📊</div>
                            <div>
                                <p className="text-sm font-semibold text-[#1A1A1A] dark:text-[#F5F5F5] mb-1">
                                    Tendance Actuelle
                                </p>
                                <p className="text-xs text-[#6B6B6B] dark:text-[#A3A3A3]">
                                    {metrics.growthRate >= 0 
                                        ? "Vos ventes sont en croissance. Continuez sur cette lancée !" 
                                        : "Vos ventes sont en baisse. Analysez vos stratégies marketing."}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-100 dark:border-amber-900/30">
                            <div className="text-2xl">🎯</div>
                            <div>
                                <p className="text-sm font-semibold text-[#1A1A1A] dark:text-[#F5F5F5] mb-1">
                                    Objectif Recommandé
                                </p>
                                <p className="text-xs text-[#6B6B6B] dark:text-[#A3A3A3]">
                                    Visez {(metrics.projectedMonthly * 1.15).toFixed(2)}€ pour une croissance de 15%
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                            <div className="text-2xl">💡</div>
                            <div>
                                <p className="text-sm font-semibold text-[#1A1A1A] dark:text-[#F5F5F5] mb-1">
                                    Opportunité
                                </p>
                                <p className="text-xs text-[#6B6B6B] dark:text-[#A3A3A3]">
                                    Avec une moyenne de {metrics.avgDailyRevenue.toFixed(2)}€/jour, optimisez vos meilleurs produits
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card title="Méthodologie">
                    <div className="space-y-3">
                        <div>
                            <p className="text-sm font-semibold text-[#1A1A1A] dark:text-[#F5F5F5] mb-2">
                                Comment sont calculées les prévisions ?
                            </p>
                            <ul className="space-y-2 text-xs text-[#6B6B6B] dark:text-[#A3A3A3]">
                                <li className="flex items-start gap-2">
                                    <span className="text-indigo-500">•</span>
                                    <span>Analyse de vos ventes historiques</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-indigo-500">•</span>
                                    <span>Calcul de la moyenne journalière</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-indigo-500">•</span>
                                    <span>Projection sur 30 jours avec variance réaliste</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-indigo-500">•</span>
                                    <span>Comparaison avec le mois précédent</span>
                                </li>
                            </ul>
                        </div>
                        <div className="pt-3 border-t border-[#D2D4D6] dark:border-[#262626]">
                            <p className="text-xs text-[#9E9E9E] dark:text-[#737373] italic">
                                Note: Les prévisions sont indicatives et basées sur vos données actuelles. 
                                Les résultats réels peuvent varier.
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </Layout>
    );
};

export default Forecast;
