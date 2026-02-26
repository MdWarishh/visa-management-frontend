'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '../../components/admin/Sidebar';
import { authAPI } from '../../lib/api';
import { setUser } from '../../lib/auth';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const path   = usePathname();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const check = async () => {
      const token = localStorage.getItem('token');
      if (!token) { router.replace('/login'); return; }
      const d = await authAPI.me();
      if (!d?.success) { router.replace('/login'); return; }
      // Superadmin ko admin panel nahi
      if (d.user.role === 'superadmin') { router.replace('/superadmin/dashboard'); return; }
      // Update stored user (permissions sync)
      setUser(d.user);
      setOk(true);
    };
    check();
  }, [path, router]);

  if (!ok) return (
    <div style={{ minHeight:'100vh', background:'#f0f2f5', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div className="spin spin-dark" style={{ width:32, height:32, border:'3px solid #e2e8f0', borderTopColor:'#1a56db' }} />
    </div>
  );

  return (
    <div>
      <Sidebar />
      <div className="admin-wrap fade">
        <div className="page-wrap">{children}</div>
      </div>
    </div>
  );
}
