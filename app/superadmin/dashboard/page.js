'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { superAdminAPI } from '../../../lib/api';
import toast from 'react-hot-toast';

export default function SuperAdminDashboard() {
  const [stats,   setStats]   = useState(null);
  const [admins,  setAdmins]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const [sRes, aRes] = await Promise.all([
        superAdminAPI.stats(),
        superAdminAPI.getAdmins({ limit: 8 }),
      ]);
      if (sRes?.success) setStats(sRes.stats);
      if (aRes?.success) setAdmins(aRes.data || []);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'60vh', flexDirection:'column', gap:14 }}>
      <div className="spin spin-dark" style={{ width:32, height:32, border:'3px solid #e2e8f0', borderTopColor:'#7c3aed' }} />
      <p style={{ color:'#6b7280', fontSize:14 }}>Loading…</p>
    </div>
  );

  const cards = [
    { label:'Total Admins',     value: stats?.totalAdmins     ?? 0, color:'#7c3aed', bg:'#f5f3ff',
      icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="#7c3aed"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg> },
    { label:'Active Admins',    value: stats?.activeAdmins    ?? 0, color:'#15803d', bg:'#f0fdf4',
      icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="#15803d"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg> },
    { label:'Total Candidates', value: stats?.totalCandidates ?? 0, color:'#1a56db', bg:'#eff6ff',
      icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="#1a56db"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg> },
    { label:'Visas Issued',     value: stats?.issuedVisas     ?? 0, color:'#b45309', bg:'#fffbeb',
      icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="#b45309"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-7 2h2v2h-2V6zm0 4h2v2h-2v-2zm-4-4h2v2H9V6zm0 4h2v2H9v-2zm-1 4H6v-2h2v2zm0-4H6V8h2v2zm0-4H6V4h2v2zm3 8H9v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V6h2v2z"/></svg> },
  ];

  return (
    <div className="fade">
      <div style={{ marginBottom:24 }}>
        <h1 className="page-title" style={{ marginBottom:4 }}>Super Admin Dashboard</h1>
        <p style={{ color:'#6b7280', fontSize:13 }}>Platform-wide overview — all admins & candidates</p>
      </div>

      {/* Stat cards */}
      <div className="stats-row" style={{ marginBottom:22 }}>
        {cards.map(({ label, value, color, bg, icon }) => (
          <div key={label} className="stat-card">
            <div>
              <div className="stat-label">{label}</div>
              <div className="stat-value" style={{ color }}>{value}</div>
            </div>
            <div style={{ width:56, height:56, background:bg, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>
              {icon}
            </div>
          </div>
        ))}
      </div>

      {/* Recent admins table */}
      <div className="card">
        <div className="card-head" style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span>Recent Admins</span>
          <Link href="/superadmin/admins" style={{ fontSize:12, color:'#7c3aed', textDecoration:'none', fontWeight:500 }}>
            Manage All →
          </Link>
        </div>
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Country</th>
                <th>Candidates</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign:'center', padding:'40px 0', color:'#9ca3af' }}>
                  No admins yet. <Link href="/superadmin/admins" style={{ color:'#7c3aed' }}>Create first admin →</Link>
                </td></tr>
              ) : admins.map(a => (
                <tr key={a._id}>
                  <td style={{ fontWeight:600 }}>{a.name}</td>
                  <td style={{ color:'#6b7280', fontSize:12.5 }}>{a.email}</td>
                  <td>
                    <span style={{ background:'#eff6ff', color:'#1d4ed8', padding:'3px 9px', borderRadius:12, fontSize:11.5, fontWeight:600 }}>
                      {a.country}
                    </span>
                  </td>
                  <td style={{ fontWeight:700 }}>{a.candidateCount || 0}</td>
                  <td>
                    <span className={`badge ${a.isActive ? 'badge-approved' : 'badge-rejected'}`}>
                      {a.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td style={{ color:'#6b7280', fontSize:12 }}>
                    {new Date(a.createdAt).toLocaleDateString('en-GB')}
                  </td>
                  <td>
                    <Link href={`/superadmin/admins/${a._id}`} className="btn-view" style={{ fontSize:11.5 }}>
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
