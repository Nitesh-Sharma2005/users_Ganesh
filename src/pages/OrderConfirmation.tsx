import { useParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { CheckCircle2, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

export function OrderConfirmation() {
  const { orderId } = useParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults, particleCount,
        origin: { x: Math.random(), y: Math.random() - 0.2 }
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
      <div className={`transform transition-all duration-700 ${mounted ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={48} />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Order Confirmed!</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-2">Thank you for shopping! Check in the order section for updates.</p>
        
        <div className="bg-white dark:bg-gray-800 px-6 py-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm inline-block mb-8 mt-4 transition-colors">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Your Order ID</p>
          <p className="font-mono text-xl font-bold text-emerald-600 dark:text-emerald-400">#{orderId}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/orders">
            <Button variant="outline" className="w-full sm:w-auto dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">View Order Status</Button>
          </Link>
          <Link to="/">
            <Button className="w-full sm:w-auto"><ShoppingBag size={18} className="mr-2"/> Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
