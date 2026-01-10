import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-[#ededed] dark:bg-[#0A0A0A]">
            <Sidebar />
            <main className="lg:ml-64 p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
                {children}
            </main>
        </div>
    );
};

export default Layout;
