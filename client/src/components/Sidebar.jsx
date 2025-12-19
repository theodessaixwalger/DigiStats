import React from 'react';
import { LayoutDashboard, Wallet, TrendingUp, Settings, PieChart } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const Sidebar = () => {
    const linkClasses = ({ isActive }) =>
        `flex items-center px-4 py-3 text-sm transition-all duration-150 relative mx-2 rounded-lg ${
            isActive
                ? 'text-[#1A1A1A] dark:text-[#F5F5F5] bg-[#F0F0F1] dark:bg-[#1A1A1A] border-l-4 border-indigo-500'
                : 'text-[#6B6B6B] dark:text-[#A3A3A3] hover:text-[#1A1A1A] dark:hover:text-[#F5F5F5] hover:bg-[#F7F7F8] dark:hover:bg-[#1A1A1A]/50 border-l-4 border-transparent'
        }`;

    return (
        <div className="w-64 bg-[#FCFCFD] dark:bg-[#121212] h-screen fixed left-0 top-0 border-r border-[#E5E5E7] dark:border-[#262626] flex flex-col">
            <div className="p-6 border-b border-[#E5E5E7] dark:border-[#262626] flex justify-between items-center">
                <h1 className="text-xl font-semibold text-[#1A1A1A] dark:text-[#F5F5F5]">
                    DigiStats
                </h1>
                <ThemeToggle />
            </div>

            <nav className="flex-1 py-4">
                <NavLink to="/" className={linkClasses} end>
                    <LayoutDashboard className="w-5 h-5 mr-3" />
                    Tableau de Bord
                </NavLink>
                <NavLink to="/analytics" className={linkClasses}>
                    <PieChart className="w-5 h-5 mr-3" />
                    Analyses
                </NavLink>
                <NavLink to="/transactions" className={linkClasses}>
                    <Wallet className="w-5 h-5 mr-3" />
                    Transactions
                </NavLink>
                <NavLink to="/forecast" className={linkClasses}>
                    <TrendingUp className="w-5 h-5 mr-3" />
                    Prévisions
                </NavLink>
            </nav>

            <div className="border-t border-[#E5E5E7] dark:border-[#262626]">
                <NavLink to="/settings" className={linkClasses}>
                    <Settings className="w-5 h-5 mr-3" />
                    Paramètres
                </NavLink>
                <div className="px-4 py-4 text-xs text-[#9E9E9E] dark:text-[#737373]">
                    Théo D. · Admin
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
