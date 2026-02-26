'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authAPI } from '../../lib/api';
import { getUser, isAdmin } from '../../lib/auth';
import toast from 'react-hot-toast';

export default function Sidebar() {
  const path   = usePathname();
  const router = useRouter();
  const user   = getUser();

  const active = (h) => path === h || path.startsWith(h + '/') ? 'nav-item active' : 'nav-item';

  const logout = async () => {
    try { await authAPI.logout(); } catch {}
    toast.success('Logged out');
    router.push('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-avatar">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
          </svg>
        </div>
        <div className="sidebar-brand-info">
          <h3>{user?.country || 'Admin Panel'}</h3>
          <p>{user?.name || user?.email || ''}</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <Link href="/admin/dashboard" className={active('/admin/dashboard')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
          Dashboard
        </Link>

        <Link href="/admin/applications" className={active('/admin/applications')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
          </svg>
          Applications
        </Link>

        {/* Users link — sirf Admin role ke liye */}
        {isAdmin(user) && (
          <Link href="/admin/users" className={active('/admin/users')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
            </svg>
            Manage Users
          </Link>
        )}
      </nav>

      {/* Role badge + logout */}
      <div style={{ padding:'10px 12px', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ padding:'8px 14px', marginBottom:4, display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.5px',
            background: user?.role === 'admin' ? '#1e3a56' : '#2d1b69',
            color: user?.role === 'admin' ? '#93c5fd' : '#c4b5fd',
            padding:'2px 8px', borderRadius:10 }}>
            {user?.role?.toUpperCase() || 'USER'}
          </span>
        </div>
        <button className="nav-item" onClick={logout} style={{ color:'#f87171', width:'100%' }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
}
