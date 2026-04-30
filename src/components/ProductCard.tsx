import { Link, useNavigate } from 'react-router-dom';
import * as React from 'react';
import { Product } from '../data/mockData';
import { formatPrice } from '../lib/utils';
import { Button } from './ui/Button';
import { Heart, Plus } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

export function ProductCard({ product }: { product: Product }) {
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist, addToCart, isLoggedIn } = useStore();
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    if (product.stock <= 0) return;
    addToCart(product, 1);
    toast.success('Added to cart');
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error('Please login to modify wishlist');
      navigate('/login');
      return;
    }
    toggleWishlist(product);
    toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-lg border border-[#E5E7EB] dark:border-gray-700 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col p-3">
      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-[#F9FAFB] dark:bg-gray-800/50 rounded-md">
        {product.originalPrice && product.originalPrice > product.price && (
          <div className="absolute top-2 left-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-[11px] font-bold px-2 py-1 rounded-[4px] uppercase z-10">
            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
          </div>
        )}
        {product.stock > 0 && product.stock <= 5 && (
          <div className="absolute top-2 right-2 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 text-[11px] font-bold px-2 py-1 rounded-[4px] uppercase z-10">
            Only {product.stock} left
          </div>
        )}
        {product.stock <= 0 && (
          <div className="absolute top-2 right-2 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 text-[11px] font-bold px-2 py-1 rounded-[4px] uppercase z-10">
            Out of Stock
          </div>
        )}
        <button
          onClick={handleWishlist}
          className="absolute bottom-2 right-2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 z-10 backdrop-blur-sm transition-colors"
        >
          <Heart size={18} className={cn(inWishlist && "fill-red-500 text-red-500")} />
        </button>
        <div className="absolute inset-0 p-2 flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className={cn(
              "w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal transition-transform duration-300 group-hover:scale-105",
              product.stock <= 0 && "opacity-50 grayscale"
            )}
          />
        </div>
      </Link>
      
      <div className="pt-3 flex flex-col flex-grow">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{product.category}</p>
        <Link to={`/product/${product.id}`} className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm mb-2 line-clamp-2 min-h-[40px]">
            {product.name}
          </h3>
        </Link>
        
        <div className="mt-auto flex flex-col gap-2">
          <div>
            <span className="font-bold text-gray-900 dark:text-white">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 dark:text-gray-500 line-through ml-1.5">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          
          <Button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={cn("w-full mt-2 flex items-center justify-center py-2 rounded-md !text-sm", product.stock <= 0 && "opacity-50")}
          >
            <Plus size={16} className="mr-1" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
