import React from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';

const Settings = () => {
    return (
        <Layout>
             <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-6">Paramètres</h1>
             <Card title="Préférences Générales">
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[#6B6B6B] dark:text-[#A3A3A3]">Devise</label>
                        <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-[#E5E5E7] dark:border-[#262626] bg-[#FCFCFD] dark:bg-[#121212] text-[#1A1A1A] dark:text-[#F5F5F5] focus:outline-none focus:border-[#1A1A1A] dark:focus:border-[#F5F5F5] sm:text-sm rounded-md border transition-colors duration-150">
                            <option>EUR (€)</option>
                            <option>USD ($)</option>
                        </select>
                    </div>
                </form>
             </Card>
        </Layout>
    );
};

export default Settings;
