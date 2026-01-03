
import React from 'react';
import { TaskCategory } from '../types';

interface CategoriesProps {
  onSelectTask: (category: TaskCategory) => void;
}

const Categories: React.FC<CategoriesProps> = ({ onSelectTask }) => {
  const categories = [
    { id: TaskCategory.TAP, icon: '⚡', color: 'bg-yellow-50 text-yellow-600', desc: 'Tap quickly to mine rewards' },
    { id: TaskCategory.ADS, icon: '📺', color: 'bg-blue-50 text-blue-600', desc: 'Earn tokens by watching ads' },
    { id: TaskCategory.QUIZ, icon: '📝', color: 'bg-purple-50 text-purple-600', desc: 'Test your knowledge & win' },
    { id: TaskCategory.GAME, icon: '🎮', color: 'bg-pink-50 text-pink-600', desc: 'Play mini games for rewards' },
    // Fix: Replaced undefined TaskCategory.DOWNLOAD with TaskCategory.MINING to match the enum definition in types.ts
    { id: TaskCategory.MINING, icon: '⛏️', color: 'bg-orange-50 text-orange-600', desc: 'Cloud mining rewards' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center">
        <h2 className="text-2xl font-black">Earning Hub</h2>
        <p className="text-gray-500 text-sm">Choose how you want to earn today</p>
      </div>

      <div className="space-y-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectTask(cat.id)}
            className="w-full flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:scale-[1.02] active:scale-[0.98] transition-all text-left"
          >
            <div className={`w-14 h-14 ${cat.color} rounded-2xl flex items-center justify-center text-2xl`}>
              {cat.icon}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-800">{cat.id}</h4>
              <p className="text-xs text-gray-400">{cat.desc}</p>
            </div>
            <div className="text-gray-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Categories;
