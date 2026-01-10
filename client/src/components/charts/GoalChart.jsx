import React from 'react';

const GoalChart = ({ currentRevenue, goal = 5000 }) => {
    const progress = Math.min((currentRevenue / goal) * 100, 100);
    const isOverGoal = currentRevenue >= goal;

    return (
        <div className="space-y-6">
            {/* Progress Stats */}
            <div className="flex justify-between items-end">
                <div>
                    <p className="text-xs uppercase tracking-wide text-[#9E9E9E] dark:text-[#737373] mb-1">
                        Progression
                    </p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                        {progress.toFixed(1)}%
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-[#9E9E9E] dark:text-[#737373] mb-1">
                        Objectif
                    </p>
                    <p className="text-lg font-semibold text-[#1A1A1A] dark:text-[#F5F5F5]">
                        {goal.toFixed(0)}€
                    </p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="relative">
                <div className="h-8 bg-[#F0F0F1] dark:bg-[#1A1A1A] rounded-full overflow-hidden border border-[#D2D4D6] dark:border-[#262626]">
                    <div 
                        className={`h-full bg-gradient-to-r ${
                            isOverGoal 
                                ? 'from-emerald-500 to-teal-500' 
                                : 'from-indigo-500 to-purple-500'
                        } transition-all duration-1000 ease-out relative`}
                        style={{ width: `${progress}%` }}
                    >
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                    </div>
                </div>
                
                {/* Current value indicator */}
                {progress > 10 && (
                    <div 
                        className="absolute top-1/2 -translate-y-1/2 transition-all duration-1000"
                        style={{ left: `${Math.min(progress, 95)}%` }}
                    >
                        <div className="relative -translate-x-1/2">
                            <div className="bg-[#F5F5F7] dark:bg-[#121212] border-2 border-indigo-500 dark:border-indigo-400 rounded-full px-3 py-1 shadow-lg">
                                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                                    {currentRevenue.toFixed(0)}€
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-lg p-4 border border-indigo-100 dark:border-indigo-900/30">
                    <p className="text-xs text-[#6B6B6B] dark:text-[#A3A3A3] mb-1">Actuel</p>
                    <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                        {currentRevenue.toFixed(2)}€
                    </p>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-lg p-4 border border-emerald-100 dark:border-emerald-900/30">
                    <p className="text-xs text-[#6B6B6B] dark:text-[#A3A3A3] mb-1">Restant</p>
                    <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                        {Math.max(0, goal - currentRevenue).toFixed(2)}€
                    </p>
                </div>
            </div>

            {/* Status Message */}
            {isOverGoal && (
                <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-lg p-3">
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium text-center">
                        🎉 Objectif atteint ! Félicitations !
                    </p>
                </div>
            )}
        </div>
    );
};

export default GoalChart;
