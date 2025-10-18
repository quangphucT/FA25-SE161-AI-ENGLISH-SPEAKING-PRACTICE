// utils/auth.ts
import { toast } from 'sonner';

export const handleTokenExpiration = (message?: string) => {
  // Clear client-side storage
  if (typeof window !== 'undefined') {
    // // Clear localStorage
    // localStorage.removeItem('user');
    // localStorage.removeItem('userRole');
    // localStorage.removeItem('preferences');
    
    // Clear sessionStorage
    // sessionStorage.clear();
    
    // Show toast message
    toast.error(message || 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    
    // Redirect to login
    window.location.href = '/sign-in';
  }
};

export const handleLogout = async () => {
  try {
    // Call logout API để invalidate tokens ở backend (optional)
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
  } catch (error) {
    console.error('Logout API failed:', error);
  } finally {
    // Clear client-side storage regardless
    handleTokenExpiration('Đăng xuất thành công.');
  }
};

export const isClientSide = () => typeof window !== 'undefined';