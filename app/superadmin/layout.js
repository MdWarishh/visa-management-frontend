'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '../../lib/api';
import { getUser, isSuperAdmin } from '../../lib/auth';
import toast from 'react-hot-toast';

function SuperSidebar() {
  const path   = usePathname();
  const router = useRouter();
  const user   = getUser();

  const active = (h) => path === h || path.startsWith(h + '/') ? 'nav-item active' : 'nav-item';

  const logout = async () => {
    await authAPI.logout();
    toast.success('Logged out');
    router.push('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-avatar" style={{ background:'#7c3aed' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
          </svg>
        </div>
        <div className="sidebar-brand-info">
          <h3>Super Admin</h3>
          <p>{user?.email || 'Platform Control'}</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <Link href="/superadmin/dashboard" className={active('/superadmin/dashboard')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
          Dashboard
        </Link>
        <Link href="/superadmin/admins" className={active('/superadmin/admins')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
          </svg>
          Manage Admins
        </Link>
      </nav>

      <div style={{ padding:'10px 12px', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
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

export default function SuperAdminLayout({ children }) {
  const router = useRouter();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const check = async () => {
      const token = localStorage.getItem('token');
      if (!token) { router.replace('/login'); return; }
      const d = await authAPI.me();
      if (!d?.success || d?.user?.role !== 'superadmin') {
        router.replace('/login'); return;
      }
      setOk(true);
    };
    check();
  }, [router]);

  if (!ok) return (
    <div style={{ minHeight:'100vh', background:'#f0f2f5', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div className="spin spin-dark" style={{ width:32, height:32, border:'3px solid #e2e8f0', borderTopColor:'#7c3aed' }} />
    </div>
  );

  return (
    <div>
      <SuperSidebar />
      <div className="admin-wrap fade">
        <div className="page-wrap">{children}</div>
      </div>
    </div>
  );
}
