// ── Auth helpers ──────────────────────────────────────
export const getUser = () => {
  if (typeof window === 'undefined') return null;
  try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
};

export const setUser = (user) => localStorage.setItem('user', JSON.stringify(user));

export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const isSuperAdmin = (user) => user?.role === 'superadmin';
export const isAdmin      = (user) => user?.role === 'admin';
export const isUser       = (user) => user?.role === 'user';

// Check if user can do action
export const can = (user, perm) => {
  if (!user) return false;
  if (user.role === 'superadmin' || user.role === 'admin') return true;
  return user.permissions?.[perm] === true;
};

// Where to redirect after login based on role
export const dashboardPath = (role) => {
  if (role === 'superadmin') return '/superadmin/dashboard';
  return '/admin/dashboard';
};
