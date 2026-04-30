import { Home, ShoppingCart, Heart, User, Clock } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useStore } from '../../store/useStore';

export function BottomNav() {
  const { items, wishlistItems, isLoggedIn } = useStore();
  const location = useLocation();
  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/wishlist', icon: Heart, label: 'Wishlist', badge: wishlistItems.length },
    { to: '/cart', icon: ShoppingCart, label: 'Cart', badge: cartItemCount },
    { to: isLoggedIn ? '/orders' : '/login', icon: Clock, label: 'Orders' },
    { to: isLoggedIn ? '/profile' : '/login', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50 md:hidden shadow-[0_-2px_10px_rgba(0,0,0,0.05)] transition-colors">
      <div className="flex items-center justify-around h-[64px] px-1 pb-2">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 h-full space-y-0.5 relative transition-colors ${
                isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`
            }
          >
            <div className="relative">
              <item.icon size={20} />
              {item.badge && item.badge > 0 ? (
                <span className="absolute -top-1.5 -right-2 bg-emerald-600 text-white text-[9px] font-bold h-3.5 min-w-[14px] rounded-full flex items-center justify-center px-1 border border-white dark:border-gray-800">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              ) : null}
            </div>
            <span className="text-[10px] font-medium mt-0.5">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
