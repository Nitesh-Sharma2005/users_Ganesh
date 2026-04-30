import { useState } from 'react';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { safeJson } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { Store, ArrowRight, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

export function Login() {
  const [step, setStep] = useState<'initial' | 'complete-profile'>('initial');
  const [tempGoogleUser, setTempGoogleUser] = useState<{ email: string; name: string; uid: string } | null>(null);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useStore();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result?.user;

      if (!user) {
        throw new Error('Google authentication failed - no user returned');
      }

      console.log('Google Auth success:', { 
        email: user.email, 
        displayName: user.displayName, 
        uid: user.uid 
      });

      // Sync with our backend to see if user exists and has phone
      const response = await fetch('/api/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          name: user.displayName,
          uid: user.uid
        }),
      });

      const data = await safeJson(response);
      if (!response.ok) throw new Error(data.error || 'Failed to sync Google user');

      if (!data.user || !data.user.phone) {
        // New user or missing phone - proceed to step 2
        setTempGoogleUser({
          email: user.email || '',
          name: user.displayName || '',
          uid: user.uid
        });
        setStep('complete-profile');
      } else {
        // Existing user with phone - log in immediately
        login(data.user);
        const { loadOrders } = useStore.getState();
        loadOrders(data.user.id);
        toast.success('Logged in with Google!');
        navigate('/');
      }
    } catch (error: any) {
      console.error('Google Login Error:', error);
      toast.error(error.message || 'Google login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempGoogleUser) return;
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      // We'll update the user in our DB with phone and password
      const response = await fetch('/api/complete-google-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: tempGoogleUser.email,
          name: tempGoogleUser.name,
          phone,
          password
        }),
      });

      const data = await safeJson(response);
      if (!response.ok) throw new Error(data.error || 'Failed to complete profile');
      if (!data.user) throw new Error('Server did not return user data');

      login(data.user);
      const { loadOrders } = useStore.getState();
      loadOrders(data.user.id);
      toast.success('Account setup complete!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'complete-profile') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 md:p-8 transition-colors">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 p-3 rounded-full mb-4">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Almost There!</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Please provide your phone number and set a password to finish setting up your Ganesh Kirana account.
            </p>
          </div>

          <form onSubmit={handleCompleteProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-xl focus:bg-white dark:focus:bg-gray-600 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800 outline-none transition-all"
                required
                pattern="[0-9]{10}"
                title="Please enter a valid 10-digit phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Set Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-xl focus:bg-white dark:focus:bg-gray-600 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800 outline-none transition-all"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-xl focus:bg-white dark:focus:bg-gray-600 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800 outline-none transition-all"
                required
              />
            </div>

            <Button type="submit" className="w-full py-6 text-lg mt-2 font-bold" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Finish Setup'}
              {!isLoading && <ArrowRight size={20} className="ml-2" />}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 md:p-8 transition-colors">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 p-3 rounded-full mb-4">
            <Store size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome to Ganesh Kirana</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Please log in with your Google account to get started. 
            Google automatically verifies your identity for a secure experience.
          </p>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all font-bold shadow-lg shadow-emerald-200 dark:shadow-none disabled:opacity-50"
        >
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 gap-2 text-xs">
          <ShieldCheck size={16} />
          <span>Ganesh Kirana uses Google Auth for verified identity</span>
        </div>
      </div>
    </div>
  );
}
