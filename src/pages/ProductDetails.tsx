import { useParams, useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../data/mockData';
import { Button } from '../components/ui/Button';
import { useStore } from '../store/useStore';
import { formatPrice, cn } from '../lib/utils';
import { Heart, Minus, Plus, ShoppingCart, ArrowLeft, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ProductCard } from '../components/ProductCard';

export function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist, isLoggedIn } = useStore();
  const [quantity, setQuantity] = useState(1);
  
  const product = PRODUCTS.find(p => p.id === id);

  // Scroll to top when product ID changes
  useEffect(() => {
    window.scrollTo(0, 0);
    setQuantity(1);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Button onClick={() => navigate('/')}>Go Back Home</Button>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    addToCart(product, quantity);
    toast.success('Added to cart successfully');
  };

  const handleWishlist = () => {
    if (!isLoggedIn) {
      toast.error('Please login to modify wishlist');
      navigate('/login');
      return;
    }
    toggleWishlist(product);
    toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const similarProducts = PRODUCTS
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 8);

  return (
    <div className="py-4 md:py-8 px-4 md:px-0 max-w-6xl mx-auto pb-[140px] md:pb-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 font-medium transition-colors"
      >
        <ArrowLeft size={20} /> Back
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-12 transition-colors">
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="md:w-1/2 p-6 md:p-12 bg-white dark:bg-gray-800/50 flex items-center justify-center relative">
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="absolute top-4 left-4 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 font-bold px-3 py-1 rounded">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
              </div>
            )}
            <button
              onClick={handleWishlist}
              className="absolute top-4 right-4 p-3 rounded-full bg-gray-50 dark:bg-gray-700 shadow-sm hover:shadow text-gray-400 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-all"
            >
              <Heart size={24} className={cn(inWishlist && "fill-red-500 text-red-500")} />
            </button>
            <div className="w-full h-64 sm:h-80 md:h-[500px] relative flex items-center justify-center p-4">
              <img 
                src={product.image} 
                alt={product.name} 
                className={cn("max-w-full max-h-full object-contain mix-blend-multiply dark:mix-blend-normal object-center", product.stock <= 0 && "opacity-50 grayscale")}
              />
            </div>
            {product.stock <= 0 && (
              <div className="absolute inset-0 bg-white/40 dark:bg-gray-900/60 flex items-center justify-center">
                <span className="bg-white/90 dark:bg-gray-800/90 text-red-600 dark:text-red-400 px-4 py-2 rounded-full text-lg font-bold border border-red-100 dark:border-red-900/30 shadow-sm backdrop-blur-sm">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="md:w-1/2 p-6 md:p-10 flex flex-col border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-700 md:sticky md:top-24 self-start">
            <p className="text-emerald-600 dark:text-emerald-400 font-medium mb-2">{product.category}</p>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">{product.name}</h1>
            
            <div className="flex items-end gap-3 mb-6">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-lg text-gray-400 dark:text-gray-500 line-through mb-1">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {product.stock > 0 && product.stock <= 5 && (
              <div className="bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-4 py-2 rounded-lg mb-6 text-sm font-medium border border-amber-200 dark:border-amber-800/30 inline-block w-fit">
                Hurry! Only {product.stock} items left in stock.
              </div>
            )}

            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              {product.description}
            </p>

            <div className="mt-auto">
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-center bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 p-1 self-start shrink-0">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={product.stock <= 0}
                    className="p-3 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 disabled:opacity-50 transition-colors"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="w-12 text-center font-bold text-lg dark:text-white">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock || product.stock <= 0}
                    className="p-3 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 disabled:opacity-50 transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                
                <div className="hidden md:flex gap-3 w-full">
                  <Button 
                    size="lg" 
                    className="flex-1 h-14 bg-emerald-600 hover:bg-emerald-700 text-white" 
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                  >
                    <ShoppingCart size={20} className="mr-0 sm:mr-2 hidden sm:inline-block" />
                    {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="flex-1 h-14 border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30" 
                    onClick={() => {
                      handleAddToCart();
                      navigate('/checkout');
                    }}
                    disabled={product.stock <= 0}
                  >
                    Buy Now
                  </Button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 border-t border-gray-100 dark:border-gray-700 pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded-full mb-2 text-gray-600 dark:text-gray-300">
                    <ShieldCheck size={24} />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">100% Authentic</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded-full mb-2 text-gray-600 dark:text-gray-300">
                    <RotateCcw size={24} />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Easy Returns</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded-full mb-2 text-gray-600 dark:text-gray-300">
                    <Truck size={24} />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Fast Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {similarProducts.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6">Similar Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {similarProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* Mobile Fixed CTA */}
      <div className="fixed bottom-[64px] left-0 right-0 p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40 md:hidden shadow-[0_-4px_10px_rgba(0,0,0,0.05)] flex gap-3 pt-3 pb-3">
        <Button 
          className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 text-white !text-sm" 
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
        >
          <ShoppingCart size={16} className="mr-2 hidden sm:inline-block" />
          {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
        <Button 
          variant="outline"
          className="flex-1 h-12 border-emerald-600 text-emerald-600 hover:bg-emerald-50 !text-sm" 
          onClick={() => {
            handleAddToCart();
            navigate('/checkout');
          }}
          disabled={product.stock <= 0}
        >
          Buy Now
        </Button>
      </div>
    </div>
  );
}
