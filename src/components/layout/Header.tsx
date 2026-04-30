import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Heart, LogOut, Menu } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Button } from '../ui/Button';

export function Header() {
  const { items, wishlistItems, isLoggedIn, name, logout, setSidebarOpen } = useStore();
  const navigate = useNavigate();
  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3 md:gap-4">
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={() => setSidebarOpen(true)} 
            className="p-1 -ml-1 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors focus:outline-none"
          >
            <Menu size={24} />
          </button>
          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <div className="bg-emerald-600 text-white p-1.5 rounded-lg">
              <ShoppingCart size={24} />
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white hidden sm:block">Ganesh Kirana</span>
          </Link>
        </div>
        
        <div className="flex-1 max-w-xl relative">
          <input
            type="text"
            placeholder="Search groceries..."
            value={useStore((state) => state.searchQuery)}
            onChange={(e) => {
              const val = e.target.value;
              useStore.getState().setSearchQuery(val);
              if (window.location.pathname !== '/') {
                navigate('/');
              }
            }}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 dark:text-white border-transparent focus:bg-white dark:focus:bg-gray-600 focus:border-emerald-500 dark:focus:border-emerald-500 rounded-lg text-sm transition-all focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800 outline-none"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-400" size={18} />
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/wishlist" className="relative text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            <Heart size={24} />
            {wishlistItems.length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-emerald-600 text-white text-[10px] font-bold h-4 min-w-[16px] rounded-full flex items-center justify-center px-1 border-2 border-white dark:border-gray-800">
                {wishlistItems.length}
              </span>
            )}
          </Link>
          <Link to="/cart" className="relative text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            <ShoppingCart size={24} />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-emerald-600 text-white text-[10px] font-bold h-4 min-w-[16px] rounded-full flex items-center justify-center px-1 border-2 border-white dark:border-gray-800">
                {cartItemCount > 99 ? '99+' : cartItemCount}
              </span>
            )}
          </Link>
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <Link to="/orders" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Hi, {name?.split(' ')[0] || 'User'}
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                <LogOut size={18} className="mr-2"/> Logout
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button size="sm">Login</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
