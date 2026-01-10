import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RevenueChart = ({ sales }) => {
    // Process data: aggregate by date or month
    const dataMap = sales.reduce((acc, sale) => {
        const date = sale.date; // or format to Month
        if (!acc[date]) {
            acc[date] = { date, revenue: 0, profit: 0 };
        }
        acc[date].revenue += sale.price;
        acc[date].profit += (sale.price - sale.cost);
        return acc;
    }, {});

    const data = Object.values(dataMap).sort((a, b) => new Date(a.date) - new Date(b.date));

    // Custom tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#F5F5F7] dark:bg-[#1A1A1A] border border-[#D2D4D6] dark:border-[#262626] p-3 rounded-lg shadow-lg">
                    <p className="text-xs font-medium text-[#6B6B6B] dark:text-[#A3A3A3] mb-2">
                        {new Date(label).toLocaleDateString('fr-FR')}
                    </p>
                    {payload.map((entry, index) => (
                        <p key={index} className="text-sm font-semibold" style={{ color: entry.color }}>
                            {entry.name}: {entry.value.toFixed(2)}€
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#A855F7" stopOpacity={0.8}/>
                        </linearGradient>
                        <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.8}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#D2D4D6" className="dark:stroke-[#262626]" opacity={0.3} />
                    <XAxis 
                        dataKey="date" 
                        tick={{ fill: '#9E9E9E', fontSize: 12 }}
                        tickFormatter={(value) => new Date(value).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}
                        stroke="#D2D4D6"
                        className="dark:stroke-[#262626]"
                    />
                    <YAxis 
                        tick={{ fill: '#9E9E9E', fontSize: 12 }}
                        stroke="#D2D4D6"
                        className="dark:stroke-[#262626]"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                        wrapperStyle={{ paddingTop: '20px' }}
                        iconType="circle"
                    />
                    <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        name="Chiffre d'Affaires" 
                        stroke="url(#colorRevenue)" 
                        strokeWidth={3}
                        dot={{ fill: '#6366F1', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, strokeWidth: 2 }}
                        animationDuration={1000}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="profit" 
                        name="Bénéfice Net" 
                        stroke="url(#colorProfit)" 
                        strokeWidth={3}
                        dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, strokeWidth: 2 }}
                        animationDuration={1000}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RevenueChart;
