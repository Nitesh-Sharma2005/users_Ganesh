import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/Button';
import { Heart, ShoppingBag } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';

export function Wishlist() {
  const { wishlistItems } = useStore();

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-500 p-6 rounded-full mb-6 relative">
          <Heart size={48} />
          <div className="absolute top-0 right-0 animate-ping">
             <Heart size={20} className="fill-red-400 text-red-400" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your wishlist is empty</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm">
          Save items you like to your wishlist. They will be waiting for you when you're ready to buy!
        </p>
        <Link to="/">
          <Button size="lg"><ShoppingBag size={18} className="mr-2"/> Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-4 md:py-8 px-4 md:px-0">
      <div className="flex items-center gap-3 mb-6">
        <Heart size={28} className="text-red-500 fill-red-500" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Wishlist</h1>
        <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-sm font-medium transition-colors">
          {wishlistItems.length} items
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {wishlistItems.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
