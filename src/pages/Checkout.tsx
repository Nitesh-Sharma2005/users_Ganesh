import { useState } from 'react';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/Button';
import { formatPrice, cn } from '../lib/utils';
import { Store, Truck, IndianRupee, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export function Checkout() {
  const { items, getTotal, addOrder, clearCart, name, email, isLoggedIn, address: storeAddress, setAddress: saveAddressToStore } = useStore();
  const navigate = useNavigate();
  
  const [address, setAddress] = useState(storeAddress || '');
  const [deliveryOption, setDeliveryOption] = useState<'home' | 'pickup'>('home');
  const [paymentOption] = useState<'cod'>('cod');
  const [isLoading, setIsLoading] = useState(false);
  
  React.useEffect(() => {
    if (!isLoggedIn) {
      toast.error('Please login to place an order');
      navigate('/login');
      return;
    }
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items.length, isLoggedIn, navigate]);

  const subtotal = getTotal();
  const deliveryCharge = deliveryOption === 'home' ? 20 : 0;
  const total = subtotal + deliveryCharge;

  if (items.length === 0) return null;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (deliveryOption === 'home' && !address.trim()) {
      toast.error('Please enter delivery address');
      return;
    }

    setIsLoading(true);
    try {
      if (deliveryOption === 'home') {
        saveAddressToStore(address);
      }
      
      const orderId = await addOrder({
        items,
        total,
        deliveryOption,
        paymentOption,
        address: deliveryOption === 'home' ? address : undefined
      });
      
      if (orderId) {
        clearCart();
        toast.success('Order placed successfully! Check in the order section.');
        navigate(`/order-confirmation/${orderId}`);
      } else {
        toast.error('Failed to place order. You might need to re-login.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-4 md:py-8 px-4 md:px-0">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <form id="checkout-form" onSubmit={handlePlaceOrder} className="flex-1 space-y-6">
          {/* User Details */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input type="text" value={name || ''} disabled className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                <input type="text" value={email || ''} disabled className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400" />
              </div>
            </div>
          </div>

          {/* Delivery Options */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
              Delivery Method
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <label className={cn(
                "border rounded-xl p-4 cursor-pointer transition-all flex items-start gap-4",
                deliveryOption === 'home' ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 ring-1 ring-emerald-500" : "border-gray-200 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-800"
              )}>
                <input 
                  type="radio" 
                  name="delivery" 
                  checked={deliveryOption === 'home'} 
                  onChange={() => setDeliveryOption('home')}
                  className="mt-1"
                />
                <div>
                  <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                    <Truck size={18}/> Home Delivery
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Delivery in 30-45 mins. Charge: ₹20</p>
                </div>
              </label>
              
              <label className={cn(
                "border rounded-xl p-4 cursor-pointer transition-all flex items-start gap-4",
                deliveryOption === 'pickup' ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 ring-1 ring-emerald-500" : "border-gray-200 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-800"
              )}>
                <input 
                  type="radio" 
                  name="delivery" 
                  checked={deliveryOption === 'pickup'} 
                  onChange={() => setDeliveryOption('pickup')}
                  className="mt-1"
                />
                <div>
                  <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                    <Store size={18}/> Store Pickup
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Pick up directly from store. Free.</p>
                </div>
              </label>
            </div>
            
            {deliveryOption === 'home' && (
              <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                  <MapPin size={16}/> Complete Address
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House/Flat No., Building Name, Street, Landmark"
                  rows={3}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-lg focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800 transition-all outline-none"
                  required
                />
              </div>
            )}
          </div>

          {/* Payment Options */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 w-6 h-6 rounded-full flex items-center justify-center text-sm">3</span>
              Payment Method
            </h2>
            <div className="space-y-3">
              <label className={cn(
                "border rounded-xl p-4 cursor-pointer transition-all flex items-center justify-between",
                paymentOption === 'cod' ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 ring-1 ring-emerald-500" : "border-gray-200 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-800"
              )}>
                <div className="flex items-center gap-3">
                  <input 
                    type="radio" 
                    name="payment" 
                    checked={true} 
                    readOnly
                  />
                  <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-white">
                    <IndianRupee size={20} className="text-green-600"/> Cash on Delivery
                  </div>
                </div>
              </label>
            </div>
          </div>

        </form>

        <div className="w-full lg:w-96">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm sticky top-24 transition-colors">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>Items Total ({items.length})</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>Delivery Fee</span>
                <span>{deliveryCharge > 0 ? formatPrice(deliveryCharge) : 'Free'}</span>
              </div>
              <div className="border-t border-gray-100 dark:border-gray-700 pt-3 flex justify-between font-bold text-xl text-gray-900 dark:text-white">
                <span>To Pay</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <Button 
              type="submit"
              form="checkout-form"
              className="w-full py-4 text-lg bg-green-600 hover:bg-green-700" 
              disabled={isLoading}
            >
              {isLoading ? 'Placing Order...' : `Place Order - ${formatPrice(total)}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
