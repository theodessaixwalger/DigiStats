// Use relative URL for production (Vercel) and proxy for development
const API_URL = import.meta.env.VITE_API_URL || '/api/sales';

export const fetchSales = async () => {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error('Failed to fetch sales');
    }
    return response.json();
};

export const createSale = async (sale) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(sale),
    });
    if (!response.ok) {
        throw new Error('Failed to create sale');
    }
    return response.json();
};

export const deleteSale = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error('Failed to delete sale');
    }
    return response.json();
};

export const calculateGrowth = (currentMonthStats, lastMonthStats) => {
    if (lastMonthStats === 0) return 100; // Assuming 100% growth if started from 0
    return ((currentMonthStats - lastMonthStats) / lastMonthStats) * 100;
};
