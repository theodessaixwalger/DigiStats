import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

const ForecastChart = ({ sales }) => {
    // Calculate historical data and forecast
    const calculateForecast = () => {
        // Group sales by date
        const dataMap = sales.reduce((acc, sale) => {
            const date = sale.date;
            if (!acc[date]) {
                acc[date] = { date, revenue: 0 };
            }
            acc[date].revenue += sale.price;
            return acc;
        }, {});

        const historicalData = Object.values(dataMap)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map(item => ({
                date: item.date,
                actual: item.revenue,
                forecast: null
            }));

        if (historicalData.length === 0) {
            return [];
        }

        // Calculate average daily revenue
        const totalRevenue = historicalData.reduce((sum, item) => sum + item.actual, 0);
        const avgDailyRevenue = totalRevenue / historicalData.length;

        // Generate forecast for next 30 days
        const lastDate = new Date(historicalData[historicalData.length - 1].date);
        const forecastData = [];

        for (let i = 1; i <= 30; i++) {
            const forecastDate = new Date(lastDate);
            forecastDate.setDate(lastDate.getDate() + i);
            
            // Add some variance to make it more realistic (±15%)
            const variance = 0.85 + Math.random() * 0.3;
            const forecastValue = avgDailyRevenue * variance;

            forecastData.push({
                date: forecastDate.toISOString().split('T')[0],
                actual: null,
                forecast: forecastValue
            });
        }

        return [...historicalData, ...forecastData];
    };

    const data = calculateForecast();

    // Custom tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#FCFCFD] dark:bg-[#1A1A1A] border border-[#E5E5E7] dark:border-[#262626] p-3 rounded-lg shadow-lg">
                    <p className="text-xs font-medium text-[#6B6B6B] dark:text-[#A3A3A3] mb-2">
                        {new Date(label).toLocaleDateString('fr-FR')}
                    </p>
                    {payload.map((entry, index) => (
                        entry.value && (
                            <p key={index} className="text-sm font-semibold" style={{ color: entry.color }}>
                                {entry.name}: {entry.value.toFixed(2)}€
                            </p>
                        )
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <defs>
                        <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E7" className="dark:stroke-[#262626]" opacity={0.3} />
                    <XAxis 
                        dataKey="date" 
                        tick={{ fill: '#9E9E9E', fontSize: 12 }}
                        tickFormatter={(value) => new Date(value).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}
                        stroke="#E5E5E7"
                        className="dark:stroke-[#262626]"
                    />
                    <YAxis 
                        tick={{ fill: '#9E9E9E', fontSize: 12 }}
                        stroke="#E5E5E7"
                        className="dark:stroke-[#262626]"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                        wrapperStyle={{ paddingTop: '20px' }}
                        iconType="circle"
                    />
                    <Area
                        type="monotone"
                        dataKey="actual"
                        name="Réel"
                        stroke="#6366F1"
                        strokeWidth={3}
                        fill="url(#colorActual)"
                        dot={{ fill: '#6366F1', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, strokeWidth: 2 }}
                        animationDuration={1000}
                    />
                    <Area
                        type="monotone"
                        dataKey="forecast"
                        name="Prévision"
                        stroke="#F59E0B"
                        strokeWidth={3}
                        strokeDasharray="5 5"
                        fill="url(#colorForecast)"
                        dot={{ fill: '#F59E0B', strokeWidth: 2, r: 3 }}
                        activeDot={{ r: 5, strokeWidth: 2 }}
                        animationDuration={1000}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ForecastChart;
