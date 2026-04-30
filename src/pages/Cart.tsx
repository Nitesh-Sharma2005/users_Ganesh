import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/Button';
import { formatPrice } from '../lib/utils';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

export function Cart() {
  const { items, updateQuantity, removeFromCart, getTotal } = useStore();
  const navigate = useNavigate();
  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 p-6 rounded-full mb-6">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm">
          Looks like you haven't added anything to your cart yet. Browse our products and find something you like!
        </p>
        <Link to="/">
          <Button size="lg">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-4 md:py-8 px-4 md:px-0">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Shopping Cart ({items.length} items)</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-4">
          {items.map((item) => (
            <div key={item.product.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex gap-4 relative transition-colors">
              <img 
                src={item.product.image} 
                alt={item.product.name} 
                className="w-24 h-24 object-contain rounded-lg bg-gray-50 dark:bg-gray-900/50 p-2 mix-blend-multiply dark:mix-blend-normal"
              />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2 md:pr-8">{item.product.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.product.category}</p>
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold text-lg dark:text-white">{formatPrice(item.product.price)}</span>
                  
                  <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-1 border border-gray-200 dark:border-gray-600">
                    <button 
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="p-1 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-6 text-center font-medium text-sm dark:text-white">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.product.id, Math.min(item.product.stock, item.quantity + 1))}
                      disabled={item.quantity >= item.product.stock}
                      className="p-1 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded transition-colors disabled:opacity-50"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => removeFromCart(item.product.id)}
                className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1"
                title="Remove item"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="w-full lg:w-96">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm sticky top-24 transition-colors">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>Subtotal ({items.length} items)</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>Delivery Charges</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Calculated at next step</span>
              </div>
              <div className="border-t border-gray-100 dark:border-gray-700 pt-3 flex justify-between font-bold text-lg text-gray-900 dark:text-white">
                <span>Total Amount</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <Button 
              className="w-full py-4 text-lg bg-green-600 hover:bg-green-700" 
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout <ArrowRight size={20} className="ml-2"/>
            </Button>
            
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
              Safe and secure payments. 100% Authentic products.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
