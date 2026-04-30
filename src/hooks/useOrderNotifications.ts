
import { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { NotificationService } from '../services/NotificationService';
import { OrderStatus } from '../store/useStore';

export function useOrderNotifications() {
  const { orders, userId, loadOrders, notificationsEnabled } = useStore();
  const prevStatuses = useRef<Record<string, OrderStatus>>({});

  useEffect(() => {
    if (!userId || !notificationsEnabled) return;

    // Load orders initially to get current state
    loadOrders(userId);

    const checkUpdates = async () => {
      // Note: loadOrders updates the global 'orders' state
      await loadOrders(userId);
    };

    // Poll every 30 seconds for status changes
    // We use a relatively long interval to be "smart" and not spam the server
    const interval = setInterval(checkUpdates, 30000);

    return () => clearInterval(interval);
  }, [userId, loadOrders]);

  useEffect(() => {
    // Check for changes between current orders and stored previous statuses
    orders.forEach(order => {
      const prevStatus = prevStatuses.current[order.id];
      
      if (prevStatus && prevStatus !== order.status && notificationsEnabled) {
        // Status changed!
        if (order.status === 'Confirmed') {
          NotificationService.notify(
            'Order Confirmed! 🎉',
            `Your order #${order.id} has been confirmed and is being prepared.`
          );
        } else if (order.status === 'Cancelled') {
          NotificationService.notify(
            'Order Update',
            `Your order #${order.id} has been cancelled.`
          );
        } else if (order.status === 'Delivered') {
           NotificationService.notify(
            'Order Delivered! 🚚',
            `Your order #${order.id} has been delivered successfully.`
          );
        }
      }

      // Update ref with current status
      prevStatuses.current[order.id] = order.status;
    });

    // Clean up IDs that are no longer in the orders list
    const orderIds = new Set(orders.map(o => o.id));
    Object.keys(prevStatuses.current).forEach(id => {
      if (!orderIds.has(id)) {
        delete prevStatuses.current[id];
      }
    });
  }, [orders]);
}
