import React from 'react';

const Card = ({ children, title, icon: Icon, action }) => {
    return (
        <div className="bg-[#FCFCFD] dark:bg-[#121212] border border-[#E5E5E7] dark:border-[#262626] rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300">
            {(title || Icon) && (
                <div className="px-6 py-4 border-b border-[#E5E5E7] dark:border-[#262626] flex justify-between items-center bg-gradient-to-r from-transparent via-indigo-50/30 to-purple-50/30 dark:from-transparent dark:via-indigo-950/10 dark:to-purple-950/10">
                    <div className="flex items-center gap-3">
                        {Icon && <Icon className="w-5 h-5 text-indigo-500 dark:text-indigo-400"/>}
                        <h3 className="text-sm font-medium text-[#1A1A1A] dark:text-[#F5F5F5]">{title}</h3>
                    </div>
                    {action}
                </div>
            )}
            <div className="p-6">
                {children}
            </div>
        </div>
    );
};

export default Card;
