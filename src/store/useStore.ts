import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../data/mockData';
import { safeJson } from '../lib/utils';

export type CartItem = {
  product: Product;
  quantity: number;
};

export type OrderStatus = 'Pending' | 'Confirmed' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export type Order = {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  date: string;
  deliveryOption: 'home' | 'pickup';
  paymentOption: 'cod';
  address?: string;
  note?: string;
};

type UserState = {
  isLoggedIn: boolean;
  email: string | null;
  userId: number | null;
  name: string | null;
  phone: string | null;
  address: string | null;
  login: (user: { id: number; name: string; email: string; phone?: string | null }) => void;
  logout: () => void;
  setAddress: (address: string) => void;
};

type AppUIState = {
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
};

type CartState = {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
};

type WishlistState = {
  wishlistItems: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
};

type OrderState = {
  orders: Order[];
  hiddenOrderIds: string[];
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => Promise<string | null>;
  cancelOrder: (orderId: string) => Promise<boolean>;
  hideOrder: (orderId: string) => void;
  loadOrders: (userId: number) => Promise<void>;
};

type StoreState = UserState & CartState & WishlistState & OrderState & AppUIState;

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // UI
      selectedCategory: null,
      setSelectedCategory: (category) => set({ selectedCategory: category, isSidebarOpen: false }),
      isSidebarOpen: false,
      setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      notificationsEnabled: true,
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),

      // User
      isLoggedIn: false,
      email: null,
      userId: null,
      name: null,
      phone: null,
      address: null,
      login: (user) => {
        if (!user) return;
        set({ 
          isLoggedIn: true, 
          email: user.email || null, 
          userId: user.id || null, 
          name: user.name || null,
          phone: user.phone || null
        });
      },
      logout: () => set({ 
        isLoggedIn: false, 
        email: null, 
        userId: null, 
        name: null, 
        phone: null,
        address: null 
      }),
      setAddress: (address) => set({ address }),

      // Cart
      items: [],
      addToCart: (product, quantity = 1) => set((state) => {
        const existingItem = state.items.find(item => item.product.id === product.id);
        if (existingItem) {
          return {
            items: state.items.map(item => 
              item.product.id === product.id 
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          };
        }
        return { items: [...state.items, { product, quantity }] };
      }),
      removeFromCart: (productId) => set((state) => ({
        items: state.items.filter(item => item.product.id !== productId)
      })),
      updateQuantity: (productId, quantity) => set((state) => {
        if (quantity <= 0) {
          return { items: state.items.filter(item => item.product.id !== productId) };
        }
        return {
          items: state.items.map(item => 
            item.product.id === productId ? { ...item, quantity } : item
          )
        };
      }),
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        const state = get();
        return state.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
      },

      // Wishlist
      wishlistItems: [],
      toggleWishlist: (product) => set((state) => {
        const wishArr = state.wishlistItems;
        const exists = wishArr.find(item => item.id === product.id);
        if (exists) {
          return { wishlistItems: wishArr.filter(item => item.id !== product.id) };
        }
        return { wishlistItems: [...wishArr, product] };
      }),
      isInWishlist: (productId) => {
        const wishArr = get().wishlistItems;
        return !!wishArr.find(item => item.id === productId);
      },

      // Orders
      orders: [],
      hiddenOrderIds: [],
      setOrders: (orders) => set({ orders }),
      addOrder: async (orderData) => {
        const { userId } = get();
        if (!userId) {
          console.error('addOrder failed: userId is null');
          return null;
        }

        try {
          console.log('Placing order for user:', userId, orderData);
          const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, ...orderData }),
          });
          
          const data = await safeJson(response);
          console.log('Order response:', response.status, data);

          if (response.ok && data.orderId) {
            // Re-fetch orders to keep in sync
            const state = get();
            await state.loadOrders(userId);
            return data.orderId.toString();
          } else {
            console.error('Order failed on server or missing orderId:', data.error || 'No orderId returned');
            return null;
          }
        } catch (error) {
          console.error('Add Order Fetch Error:', error);
          return null;
        }
      },
      cancelOrder: async (orderId) => {
        try {
          const response = await fetch(`/api/orders/${orderId}`, {
            method: 'DELETE',
          });
          if (response.ok) {
            set((state) => ({
              orders: state.orders.filter(order => order.id !== orderId)
            }));
            return true;
          }
          return false;
        } catch (error) {
          console.error('Cancel Order Error:', error);
          return false;
        }
      },
      hideOrder: (orderId) => set((state) => ({
        hiddenOrderIds: [...state.hiddenOrderIds, orderId]
      })),
      loadOrders: async (userId) => {
        try {
          const response = await fetch(`/api/orders/${userId}`);
          const data = await safeJson(response);
          if (response.ok && Array.isArray(data)) {
            set({ orders: data });
          } else {
            console.error('Failed to load orders or data is not an array:', data.error || 'Unknown error');
            set({ orders: [] }); // Set to empty array to avoid crashes
          }
        } catch (error) {
          console.error('Load Orders Error:', error);
        }
      }
    }),
    {
      name: 'kirana-store-storage',
    }
  )
);
