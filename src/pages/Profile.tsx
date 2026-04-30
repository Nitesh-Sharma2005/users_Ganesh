import { UserCog, HelpCircle, MapPin, Globe, Palette, Lock, Bell, LogOut, ChevronRight, X, Phone } from 'lucide-react';
import { useStore } from '../store/useStore';
import { safeJson } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { NotificationService } from '../services/NotificationService';

export function Profile() {
  const { logout, name: storeName, email: storeEmail, phone: storePhone, address: storeAddress, login, theme: storeTheme, setTheme: setStoreTheme, setAddress: saveAddressToStore, notificationsEnabled, setNotificationsEnabled } = useStore();
  const navigate = useNavigate();
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    'Notification' in window ? Notification.permission : 'denied'
  );
  const [activeModal, setActiveModal] = useState<string | null>(null);

  useEffect(() => {
    // Poll permission status if changed outside
    const interval = setInterval(() => {
      if ('Notification' in window && Notification.permission !== notificationPermission) {
        setNotificationPermission(Notification.permission);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [notificationPermission]);

  // Form states
  const [address, setAddress] = useState(storeAddress || '123 Main St, New York, NY 10001');
  const [themeTemp, setThemeTemp] = useState(storeTheme);
  const [tempName, setTempName] = useState(storeName || '');
  const [tempPhone, setTempPhone] = useState(storePhone || '');
  const [isUpdatingInfo, setIsUpdatingInfo] = useState(false);

  // Password states
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  const handleToggleNotifications = async () => {
    if (!notificationsEnabled) {
      // Trying to turn ON
      if (notificationPermission !== 'granted') {
        const granted = await NotificationService.requestPermission();
        setNotificationPermission(Notification.permission);
        if (granted) {
          setNotificationsEnabled(true);
          toast.success('notification on');
          NotificationService.notify('Notifications Active', 'You will now receive order updates with sound.');
        } else {
          toast.error('Permission denied by browser');
        }
      } else {
        setNotificationsEnabled(true);
        toast.success('notification on');
      }
    } else {
      // Turning OFF
      setNotificationsEnabled(false);
      toast.success('notification off');
    }
  };

  const menuItems = [
    { id: 'help-center', icon: HelpCircle, label: 'Help Center' },
    { id: 'update-info', icon: UserCog, label: 'Update Info' },
    { id: 'update-address', icon: MapPin, label: 'Update Address' },
    { id: 'change-theme', icon: Palette, label: 'Change Theme' },
    { id: 'change-password', icon: Lock, label: 'Change Password' },
  ];

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    saveAddressToStore(address);
    toast.success('Address updated successfully');
    setActiveModal(null);
  };

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingInfo(true);

    try {
      const response = await fetch('/api/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: useStore.getState().userId,
          name: tempName,
          phone: tempPhone,
        }),
      });

      const data = await safeJson(response);
      if (!response.ok) throw new Error(data.error || 'Failed to update info');
      if (!data.user) throw new Error('Server did not return user data');

      login(data.user);
      toast.success('Profile updated successfully!');
      setActiveModal(null);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUpdatingInfo(false);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingPassword(true);

    try {
      const response = await fetch('/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: useStore.getState().userId,
          oldPassword,
          newPassword,
          confirmNewPassword,
        }),
      });

      const data = await safeJson(response);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update password');
      }

      toast.success('Password updated in database successfully!');
      setActiveModal(null);
      
      // Clear fields for security
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 md:py-10">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-[#E5E7EB] dark:border-gray-700 p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2 dark:text-gray-100">My Account</h1>
        <p className="text-gray-600 dark:text-gray-300">Manage your profile settings and preferences.</p>
        
        {storeName && (
          <div className="mt-6 flex items-center gap-4 bg-emerald-50 dark:bg-emerald-900/40 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/60">
            <div className="w-16 h-16 bg-emerald-200 dark:bg-emerald-800 rounded-full flex items-center justify-center text-emerald-700 dark:text-emerald-300 text-xl font-bold uppercase">
              {storeName.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{storeName}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{storeEmail || 'Not provided'}</p>
              {storePhone && (
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1.5 mt-1">
                  <Phone size={14} className="text-emerald-600 dark:text-emerald-400" />
                  {storePhone}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-[#E5E7EB] dark:border-gray-700 overflow-hidden">
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveModal(item.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-gray-600 dark:text-gray-400">
                  <item.icon size={20} />
                </div>
                <span className="font-medium text-gray-900 dark:text-white">{item.label}</span>
              </div>
              <ChevronRight size={20} className="text-gray-400 dark:text-gray-500" />
            </button>
          ))}
          
          {/* Notifications Toggle */}
          <div className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer select-none" onClick={handleToggleNotifications}>
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-gray-600 dark:text-gray-400">
                <Bell size={20} />
              </div>
              <div>
                <span className="font-medium text-gray-900 dark:text-white block">Real-time Notifications</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">Receive order updates with sound</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${notificationsEnabled ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${notificationsEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
              <span className={`text-[10px] font-bold uppercase ${notificationsEnabled ? 'text-emerald-600' : 'text-gray-400'}`}>
                {notificationsEnabled ? 'notification on' : 'notification off'}
              </span>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-4 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-red-50 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400 group-hover:bg-red-100 dark:group-hover:bg-red-900/50 transition-colors">
                <LogOut size={20} />
              </div>
              <span className="font-medium text-red-600 dark:text-red-400">Logout</span>
            </div>
          </button>
        </div>
      </div>

      {/* Modals */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md overflow-hidden relative transition-colors shadow-2xl">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2"
            >
              <X size={20} />
            </button>

            {activeModal === 'help-center' && (
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4 dark:text-white">Help Center</h3>
                <div className="space-y-3">
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                    <h4 className="font-medium text-gray-900 dark:text-white">How do I track my order?</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">You can track your order in the Orders section of your profile.</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                    <h4 className="font-medium text-gray-900 dark:text-white">What is the return policy?</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">We accept returns within 30 days of purchase for unused items.</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                    <h4 className="font-medium text-gray-900 dark:text-white">Contact Support</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Email us at support@example.com for further assistance.</p>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button onClick={() => setActiveModal(null)} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">Got it</button>
                </div>
              </div>
            )}
            
            {activeModal === 'update-info' && (
              <form onSubmit={handleSaveInfo} className="p-6">
                <h3 className="text-xl font-bold mb-4 dark:text-white">Update Profile Info</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Name</label>
                    <input 
                      type="text" 
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                    <input 
                      type="tel" 
                      value={tempPhone}
                      onChange={(e) => setTempPhone(e.target.value)}
                      placeholder="9876543210"
                      className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" disabled={isUpdatingInfo}>Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50" disabled={isUpdatingInfo}>
                    {isUpdatingInfo ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}

            {activeModal === 'update-address' && (
              <form onSubmit={handleSaveAddress} className="p-6">
                <h3 className="text-xl font-bold mb-4 dark:text-white">Update Address</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Delivery Address</label>
                    <textarea 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 min-h-[100px]"
                      required
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700">Save Address</button>
                </div>
              </form>
            )}



            {activeModal === 'change-theme' && (
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4 dark:text-white">Change Theme</h3>
                <div className="space-y-2">
                  {[
                    { id: 'light', label: 'Light' }, 
                    { id: 'dark', label: 'Dark' }
                  ].map(t => (
                    <button 
                      key={t.id}
                      onClick={() => {
                        setStoreTheme(t.id as 'light' | 'dark');
                        toast.success(`Theme set to ${t.label}`);
                        setActiveModal(null);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${storeTheme === t.id ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                    >
                      <span className="font-medium">{t.label}</span>
                      {storeTheme === t.id && <div className="w-2 h-2 rounded-full bg-emerald-500"></div>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeModal === 'change-password' && (
              <form onSubmit={handleSavePassword} className="p-6">
                <h3 className="text-xl font-bold mb-4 dark:text-white">Change Password</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                    <input 
                      type="password" 
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      required
                      minLength={6}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                    <input 
                      type="password" 
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      required
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" disabled={isUpdatingPassword}>Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50" disabled={isUpdatingPassword}>
                    {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}
    </div>
  );
}

