import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Match the category colors from Transactions page
const CATEGORY_COLORS = {
    'Formation': '#6366F1',    // Indigo
    'Ebook': '#A855F7',        // Purple
    'Coaching': '#10B981',     // Emerald
    'Service': '#F59E0B'       // Amber
};

const CategoryChart = ({ sales }) => {
    const dataMap = sales.reduce((acc, sale) => {
        if (!acc[sale.category]) {
            acc[sale.category] = 0;
        }
        acc[sale.category] += sale.price; // Use revenue instead of count
        return acc;
    }, {});

    const data = Object.keys(dataMap).map(key => ({
        name: key,
        value: dataMap[key]
    }));

    // Custom tooltip
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const total = data.reduce((sum, item) => sum + item.value, 0);
            const percentage = ((payload[0].value / total) * 100).toFixed(1);
            return (
                <div className="bg-[#FCFCFD] dark:bg-[#1A1A1A] border border-[#E5E5E7] dark:border-[#262626] p-3 rounded-lg shadow-lg">
                    <p className="text-sm font-semibold text-[#1A1A1A] dark:text-[#F5F5F5] mb-1">
                        {payload[0].name}
                    </p>
                    <p className="text-xs text-[#6B6B6B] dark:text-[#A3A3A3]">
                        {payload[0].value.toFixed(2)}€ ({percentage}%)
                    </p>
                </div>
            );
        }
        return null;
    };

    // Custom label
    const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        if (percent < 0.05) return null; // Don't show label if too small

        return (
            <text 
                x={x} 
                y={y} 
                fill="white" 
                textAnchor={x > cx ? 'start' : 'end'} 
                dominantBaseline="central"
                className="text-xs font-bold"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <defs>
                        {Object.entries(CATEGORY_COLORS).map(([category, color]) => (
                            <linearGradient key={category} id={`gradient-${category}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={color} stopOpacity={0.9}/>
                                <stop offset="100%" stopColor={color} stopOpacity={0.7}/>
                            </linearGradient>
                        ))}
                    </defs>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={110}
                        paddingAngle={3}
                        dataKey="value"
                        label={renderCustomLabel}
                        labelLine={false}
                        animationDuration={1000}
                        animationBegin={0}
                    >
                        {data.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={`url(#gradient-${entry.name})`}
                                stroke="white"
                                strokeWidth={2}
                            />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        iconType="circle"
                        formatter={(value, entry) => (
                            <span className="text-sm text-[#6B6B6B] dark:text-[#A3A3A3]">{value}</span>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CategoryChart;
