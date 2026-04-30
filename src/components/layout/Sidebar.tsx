import { useState, useEffect } from 'react';
import { X, Search, ChevronRight } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { SIDEBAR_CATEGORIES } from '../../data/mockData';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

export function Sidebar() {
  const [searchTerm, setSearchTerm] = useState('');
  const { isSidebarOpen, setSidebarOpen, selectedCategory, setSelectedCategory } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen]);

  const filteredCategories = SIDEBAR_CATEGORIES.filter(c => 
    c.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (category: string | null) => {
    setSelectedCategory(category);
    navigate('/');
  };

  return (
    <>
      {/* Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar Panel */}
      <div 
        className={cn(
          "fixed top-0 left-0 bottom-0 w-[80%] max-w-[320px] bg-white dark:bg-gray-800 z-[70] transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Categories</h2>
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="relative">
            <input 
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 focus:border-emerald-500 rounded-lg text-sm transition-all focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800 outline-none shadow-sm"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-400" size={18} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth no-scrollbar dark:bg-gray-800">
          <button 
            onClick={() => handleSelect(null)}
            className={cn(
              "w-full text-left px-6 py-4 border-b border-gray-50 dark:border-gray-700/50 flex items-center justify-between transition-colors",
              selectedCategory === null 
                ? "text-emerald-600 font-bold bg-emerald-50/50 dark:bg-emerald-900/20" 
                : "text-gray-800 dark:text-gray-200 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700/50"
            )}
          >
            All Products
            {selectedCategory === null && <ChevronRight size={18} className="text-emerald-600" />}
          </button>

          {filteredCategories.map((category) => {
            const isSelected = selectedCategory === category;
            
            // Add some dummy badges for demonstrating the feature
            let badge = null;
            if (category === "Snacks & Namkeen" || category === "Cold Drinks") {
              badge = <span className="ml-2 text-[10px] font-bold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-1.5 py-0.5 rounded-sm uppercase tracking-widest leading-none">Popular</span>;
            } else if (category === "Household" || category === "Spices") {
              badge = <span className="ml-2 text-[10px] font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded-sm uppercase tracking-widest leading-none">Offers</span>;
            }

            return (
              <button
                key={category}
                onClick={() => handleSelect(category)}
                className={cn(
                  "w-full text-left px-6 py-3.5 border-b border-gray-50 dark:border-gray-700/50 flex items-center justify-between group transition-colors",
                  isSelected 
                    ? "text-emerald-600 font-semibold bg-emerald-50/50 dark:bg-emerald-900/20" 
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                <div className="flex items-center gap-3 w-full">
                  <span className={cn(
                    "w-1.5 h-1.5 rounded-full transition-colors flex-shrink-0", 
                    isSelected ? "bg-emerald-600" : "bg-gray-300 dark:bg-gray-600 group-hover:bg-emerald-400"
                  )} />
                  <span className="truncate">{category}</span>
                  {badge}
                </div>
                {isSelected && <ChevronRight size={18} className="text-emerald-600 flex-shrink-0" />}
              </button>
            );
          })}
          
          {filteredCategories.length === 0 && (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No categories found matching "{searchTerm}".
            </div>
          )}
        </div>
      </div>
    </>
  );
}
