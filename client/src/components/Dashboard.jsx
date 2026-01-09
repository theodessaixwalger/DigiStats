import React, { useEffect, useState } from 'react';
import { fetchSales, calculateGrowth } from '../api/sales';
import SaleForm from './SaleForm';
import RevenueChart from './charts/RevenueChart';
import CategoryChart from './charts/CategoryChart';
import GoalChart from './charts/GoalChart';
import Layout from './Layout';
import Card from './Card';
import { TrendingUp, DollarSign, Wallet, ArrowUpRight, ArrowDownRight, Calendar, Edit3 } from 'lucide-react';

const Dashboard = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [goal, setGoal] = useState(() => {
        const savedGoal = localStorage.getItem('revenueGoal');
        return savedGoal ? parseFloat(savedGoal) : 5000;
    });
    const [isEditingGoal, setIsEditingGoal] = useState(false);
    const [tempGoal, setTempGoal] = useState(goal);

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

    useEffect(() => {
        loadSales();
    }, []);

    const handleSaveGoal = () => {
        const newGoal = parseFloat(tempGoal);
        if (newGoal > 0) {
            setGoal(newGoal);
            localStorage.setItem('revenueGoal', newGoal.toString());
            setIsEditingGoal(false);
        }
    };

    const handleCancelGoal = () => {
        setTempGoal(goal);
        setIsEditingGoal(false);
    };

    const totalRevenue = sales.reduce((acc, sale) => acc + sale.price, 0);
    const totalCost = sales.reduce((acc, sale) => acc + sale.cost, 0);
    const netProfit = totalRevenue - totalCost;

    const currentMonth = new Date().getMonth();
    const currentMonthSales = sales.filter(s => new Date(s.date).getMonth() === currentMonth);
    const lastMonthSales = sales.filter(s => new Date(s.date).getMonth() === currentMonth - 1);
    
    const currentMonthRevenue = currentMonthSales.reduce((acc, s) => acc + s.price, 0);
    const lastMonthRevenue = lastMonthSales.reduce((acc, s) => acc + s.price, 0);
    
    const growth = calculateGrowth(currentMonthRevenue, lastMonthRevenue);

    const currentDay = new Date().getDate();
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const averageDailyRevenue = currentDay > 0 ? currentMonthRevenue / currentDay : 0;
    const projectedRevenue = averageDailyRevenue * daysInMonth;

    const KpiCard = ({ title, value, subtext, icon: Icon, trend, color = 'primary' }) => {
        const colorClasses = {
            primary: 'from-indigo-500 to-purple-500',
            success: 'from-emerald-500 to-teal-500',
            warning: 'from-amber-500 to-orange-500'
        };
        
        return (
            <div className="bg-[#FCFCFD] dark:bg-[#121212] border border-[#E5E5E7] dark:border-[#262626] rounded-xl p-6 relative overflow-hidden group hover:shadow-lg transition-shadow duration-300">
                {/* Gradient accent bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colorClasses[color]}`}></div>
                
                <div className="flex items-start justify-between mb-4">
                    <p className="text-xs uppercase tracking-wide text-[#9E9E9E] dark:text-[#737373]">{title}</p>
                    {Icon && (
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${colorClasses[color]} bg-opacity-10`}>
                            <Icon className="w-5 h-5 text-white" />
                        </div>
                    )}
                </div>
                <h3 className="text-2xl font-semibold text-[#1A1A1A] dark:text-[#F5F5F5] mb-2">{value}</h3>
                <div className="flex items-center gap-2 text-xs text-[#6B6B6B] dark:text-[#A3A3A3]">
                    {trend !== undefined && (
                        <span className={`font-medium ${trend >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}%
                        </span>
                    )}
                    <span>{subtext}</span>
                </div>
            </div>
        );
    };

    return (
        <Layout>
            <div className="mb-8">
                <h1 className="text-2xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-1">Tableau de Bord</h1>
                <p className="text-sm text-[#6B6B6B] dark:text-[#A3A3A3]">
                    {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                </p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <KpiCard 
                    title="Chiffre d'Affaires" 
                    value={`${totalRevenue.toFixed(2)}€`} 
                    trend={growth}
                    subtext="vs mois dernier"
                    icon={DollarSign}
                    color="primary"
                />
                <KpiCard 
                    title="Bénéfice Net" 
                    value={`${netProfit.toFixed(2)}€`} 
                    subtext={`Marge: ${totalRevenue > 0 ? ((netProfit/totalRevenue)*100).toFixed(1) : 0}%`}
                    icon={Wallet}
                    color="success"
                />
                <KpiCard 
                    title="Prévision" 
                    value={`${projectedRevenue.toFixed(2)}€`} 
                    subtext="Fin de mois"
                    icon={TrendingUp}
                    color="warning"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                {/* Main Column */}
                <div className="lg:col-span-2 space-y-4 lg:space-y-6 flex flex-col">
                    <div className="order-2 lg:order-1">
                        <Card title="Nouvelle Transaction" icon={DollarSign}>
                            <SaleForm onSaleAdded={loadSales} />
                        </Card>
                    </div>
                    <div className="order-1 lg:order-2">
                        <Card title="Évolution du Chiffre d'Affaires">
                            <RevenueChart sales={sales} />
                        </Card>
                    </div>
                </div>

                {/* Sidebar Content */}
                <div className="space-y-4 lg:space-y-6">
                    <Card title="Répartition">
                         <CategoryChart sales={sales} />
                    </Card>
                    <Card 
                        title="Objectifs" 
                        action={
                            <button
                                onClick={() => {
                                    setTempGoal(goal);
                                    setIsEditingGoal(true);
                                }}
                                className="p-1.5 rounded-lg hover:bg-[#F0F0F1] dark:hover:bg-[#1A1A1A] transition-colors duration-150"
                                title="Modifier l'objectif"
                            >
                                <Edit3 className="w-4 h-4 text-[#6B6B6B] dark:text-[#A3A3A3]" />
                            </button>
                        }
                    >
                         <GoalChart currentRevenue={currentMonthRevenue} goal={goal} />
                    </Card>
                </div>
            </div>

            {/* Goal Edit Modal */}
            {isEditingGoal && (
                <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50" onClick={handleCancelGoal}>
                    <div className="bg-[#FCFCFD] dark:bg-[#121212] rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl border border-[#E5E5E7] dark:border-[#262626]" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-lg font-semibold text-[#1A1A1A] dark:text-[#F5F5F5] mb-4">
                            Modifier l'Objectif Mensuel
                        </h3>
                        <div className="mb-6">
                            <label htmlFor="goal-input" className="block text-sm font-medium text-[#6B6B6B] dark:text-[#A3A3A3] mb-2">
                                Objectif de Revenu (€)
                            </label>
                            <input
                                id="goal-input"
                                type="number"
                                value={tempGoal}
                                onChange={(e) => setTempGoal(e.target.value)}
                                className="w-full px-4 py-2 border border-[#E5E5E7] dark:border-[#262626] bg-[#FCFCFD] dark:bg-[#121212] text-[#1A1A1A] dark:text-[#F5F5F5] rounded-lg focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 transition-all duration-150"
                                placeholder="5000"
                                min="0"
                                step="100"
                                autoFocus
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleCancelGoal}
                                className="flex-1 px-4 py-2 border border-[#E5E5E7] dark:border-[#262626] text-[#6B6B6B] dark:text-[#A3A3A3] rounded-lg hover:bg-[#F0F0F1] dark:hover:bg-[#1A1A1A] transition-colors duration-150"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleSaveGoal}
                                className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-150 shadow-lg shadow-indigo-500/20"
                            >
                                Enregistrer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default Dashboard;
