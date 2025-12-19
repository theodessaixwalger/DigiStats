import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-[#9E9E9E] hover:text-[#1A1A1A] hover:bg-[#F0F0F1] dark:text-[#737373] dark:hover:text-[#F5F5F5] dark:hover:bg-[#1A1A1A] transition-all duration-150"
            aria-label="Toggle Dark Mode"
        >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
    );
};

export default ThemeToggle;
