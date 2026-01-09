import React, { useState } from 'react';
import { LayoutDashboard, Wallet, TrendingUp, Settings, Menu, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const linkClasses = ({ isActive }) =>
        `flex items-center px-4 py-3 text-sm transition-all duration-150 relative mx-2 rounded-lg ${
            isActive
                ? 'text-[#1A1A1A] dark:text-[#F5F5F5] bg-[#F0F0F1] dark:bg-[#1A1A1A] border-l-4 border-indigo-500'
                : 'text-[#6B6B6B] dark:text-[#A3A3A3] hover:text-[#1A1A1A] dark:hover:text-[#F5F5F5] hover:bg-[#F7F7F8] dark:hover:bg-[#1A1A1A]/50 border-l-4 border-transparent'
        }`;

    const closeMobileMenu = () => {
        if (window.innerWidth < 1024) {
            setIsOpen(false);
        }
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-[#FCFCFD] dark:bg-[#121212] border border-[#E5E5E7] dark:border-[#262626] rounded-lg shadow-lg"
            >
                {isOpen ? (
                    <X className="w-6 h-6 text-[#1A1A1A] dark:text-[#F5F5F5]" />
                ) : (
                    <Menu className="w-6 h-6 text-[#1A1A1A] dark:text-[#F5F5F5]" />
                )}
            </button>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                w-64 bg-[#FCFCFD] dark:bg-[#121212] h-screen fixed left-0 top-0 
                border-r border-[#E5E5E7] dark:border-[#262626] flex flex-col z-40
                transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-6 border-b border-[#E5E5E7] dark:border-[#262626] flex justify-between items-center">
                    <h1 className="text-xl font-semibold text-[#1A1A1A] dark:text-[#F5F5F5]">
                        DigiStats
                    </h1>
                    <ThemeToggle />
                </div>

                <nav className="flex-1 py-4" aria-label="Navigation principale">
                    <NavLink to="/" className={linkClasses} end onClick={closeMobileMenu}>
                        <LayoutDashboard className="w-5 h-5 mr-3" />
                        Tableau de Bord
                    </NavLink>
                    <NavLink to="/transactions" className={linkClasses} onClick={closeMobileMenu}>
                        <Wallet className="w-5 h-5 mr-3" />
                        Transactions
                    </NavLink>
                    <NavLink to="/forecast" className={linkClasses} onClick={closeMobileMenu}>
                        <TrendingUp className="w-5 h-5 mr-3" />
                        Prévisions
                    </NavLink>
                </nav>

                <div className="border-t border-[#E5E5E7] dark:border-[#262626]">
                    <NavLink to="/settings" className={linkClasses} onClick={closeMobileMenu}>
                        <Settings className="w-5 h-5 mr-3" />
                        Paramètres
                    </NavLink>
                    <div className="px-4 py-4 text-xs text-[#9E9E9E] dark:text-[#737373]">
                        Théo D. · Admin
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
