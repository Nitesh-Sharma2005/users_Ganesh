import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { Sidebar } from './Sidebar';
import { useEffect } from 'react';

export function Layout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col pb-[60px] md:pb-0 transition-colors">
      <Header />
      <Sidebar />
      <main className="flex-1 w-full max-w-7xl mx-auto md:p-4">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
