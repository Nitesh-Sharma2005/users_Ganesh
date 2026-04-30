import { useStore } from '../store/useStore';
import { formatPrice, cn } from '../lib/utils';
import * as React from 'react';
import { Package, Clock, CheckCircle2, Truck, XCircle, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { toast } from 'sonner';

export function Orders() {
  const { orders, cancelOrder, userId, loadOrders, hiddenOrderIds, hideOrder } = useStore();

  React.useEffect(() => {
    if (userId) {
      loadOrders(userId);
    }
  }, [userId, loadOrders]);

  const visibleOrders = orders.filter(order => !hiddenOrderIds.includes(order.id));

  const handleCancelOrder = async (orderId: string) => {
    const success = await cancelOrder(orderId);
    if (success) {
      toast.success('Order cancelled and removed successfully');
    } else {
      toast.error('Failed to cancel order');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock size={20} className="text-amber-500" />;
      case 'Confirmed': return <CheckCircle2 size={20} className="text-blue-500" />;
      case 'Out for Delivery': return <Truck size={20} className="text-blue-500" />;
      case 'Delivered': return <CheckCircle2 size={20} className="text-emerald-500" />;
      case 'Cancelled': return <XCircle size={20} className="text-red-500" />;
      default: return <Package size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50';
      case 'Confirmed': return 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/50';
      case 'Out for Delivery': return 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/50';
      case 'Delivered': return 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50';
      case 'Cancelled': return 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50';
      default: return 'bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-800/50';
    }
  };

  if (visibleOrders.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 p-6 rounded-full mb-6">
          <Package size={48} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{orders.length > 0 ? 'No visible orders' : 'No orders yet'}</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm">
          {orders.length > 0 ? "You have hidden all your orders. They are still in our database but hidden from this view." : "You haven't placed any orders. Start shopping and your orders will appear here."}
        </p>
        <Link to="/">
          <Button size="lg">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-4 md:py-8 px-4 md:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Orders</h1>
      </div>
      
      <div className="space-y-4">
        {visibleOrders.map((order) => (
          <div key={order.id} className="relative bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden transition-colors group">
            {/* Remove from interface only button */}
            <button 
              onClick={() => {
                hideOrder(order.id);
                toast.success('Order hidden from summary');
              }}
              title="Remove from interface"
              className="absolute top-2 right-2 p-1.5 rounded-full bg-gray-200/50 hover:bg-red-100 dark:bg-gray-700/50 dark:hover:bg-red-900/30 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <X size={14} />
            </button>
            
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pr-10 md:pr-12">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Order placed on {new Date(order.date).toLocaleDateString('en-IN', {
                    year: 'numeric', month: 'long', day: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                  })}
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">Order ID: #{order.id}</p>
                {order.note && (
                  <div className="mt-2 text-sm bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 p-2 rounded-lg text-emerald-800 dark:text-emerald-300 italic">
                    <span className="font-bold non-italic not-italic mr-1">Note:</span> {order.note}
                  </div>
                )}
              </div>
              
              <div className={cn(
                "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium w-fit",
                getStatusColor(order.status)
              )}>
                {getStatusIcon(order.status)}
                {order.status}
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="w-20 h-20 flex-shrink-0 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <img 
                          src={item.product.image || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?q=80&w=200&auto=format&fit=crop'} 
                          alt={item.product.name} 
                          className="w-full h-full object-contain p-1"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2">{item.product.name}</h4>
                        <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Qty: {item.quantity}</p>
                        <p className="font-semibold text-sm mt-1 dark:text-white">{formatPrice(item.product.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="w-full md:w-64 bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 h-fit border border-gray-100 dark:border-gray-700">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm border-b border-gray-200 dark:border-gray-600 pb-2">Order Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Total Amount</span>
                      <span className="font-bold dark:text-white">{formatPrice(order.total)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Payment</span>
                      <span className="uppercase dark:text-white">{order.paymentOption}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Delivery</span>
                      <span className="capitalize dark:text-white">{order.deliveryOption}</span>
                    </div>
                  </div>
                  
                  {order.status === 'Pending' && (
                    <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:border-red-900/30 dark:hover:bg-red-900/20"
                        onClick={() => handleCancelOrder(order.id)}
                      >
                        Cancel Order
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
