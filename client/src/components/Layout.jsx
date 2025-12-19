import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-[#F7F7F8] dark:bg-[#0A0A0A] font-sans text-[#1A1A1A] dark:text-[#F5F5F5] transition-colors duration-200">
            <Sidebar />
            <div className="ml-64 p-8">
                {children}
            </div>
        </div>
    );
};

export default Layout;
