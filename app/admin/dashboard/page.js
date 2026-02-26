'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { candidateAPI } from '../../../lib/api';
import StatusBadge from '../../../components/admin/StatusBadge';
import toast from 'react-hot-toast';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function DashboardPage() {
  const [stats,   setStats]   = useState(null);
  const [recent,  setRecent]  = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const [sRes, lRes] = await Promise.all([
        candidateAPI.stats(),
        candidateAPI.list({ limit: 8, page: 1 }),
      ]);
      if (sRes?.success) setStats(sRes.stats);
      if (lRes?.success) setRecent(lRes.data || []);

      // Monthly breakdown
      const all = await candidateAPI.list({ limit: 2000 });
      if (all?.data) {
        const map = {};
        MONTHS.forEach(m => { map[m] = 0; });
        all.data.forEach(c => {
          const d = new Date(c.applicationDate || c.createdAt);
          map[MONTHS[d.getMonth()]]++;
        });
        setMonthly(MONTHS.map(m => ({ month: m, count: map[m] })));
      }
    } catch { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  };

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'60vh', flexDirection:'column', gap:14 }}>
      <div className="spin spin-dark" style={{ width:32, height:32, border:'3px solid #e2e8f0', borderTopColor:'#1a56db' }} />
      <p style={{ color:'#6b7280', fontSize:14 }}>Loading dashboard…</p>
    </div>
  );

  const cards = [
    {
      label: 'All Candidate', value: stats?.total ?? 0,
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="#1a56db">
          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
        </svg>
      ),
    },
    {
      label: 'This Month', value: stats?.thisMonth ?? 0,
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="#1a56db">
          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
        </svg>
      ),
    },
    {
      label: 'All Visa', value: stats?.issued ?? 0,
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="#1a56db">
          <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-7 2h2v2h-2V6zm0 4h2v2h-2v-2zm-4-4h2v2H9V6zm0 4h2v2H9v-2zm-1 4H6v-2h2v2zm0-4H6V8h2v2zm0-4H6V4h2v2zm3 8H9v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V6h2v2z"/>
        </svg>
      ),
    },
    {
      label: 'Deleted Visa', value: stats?.deletedCount ?? stats?.deleted ?? 0,
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="#1a56db">
          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4z"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="fade">
      {/* Header — centered, matching screenshot */}
      <p className="page-title-center">Admin Dashboard</p>
      <p className="page-subtitle">Welcome to Visa Application Tracking system</p>

      {/* Stat cards */}
      <div className="stats-row">
        {cards.map(({ label, value, icon }) => (
          <div key={label} className="stat-card">
            <div>
              <div className="stat-label">{label}</div>
              <div className="stat-value">{value}</div>
            </div>
            <div className="stat-icon">{icon}</div>
          </div>
        ))}
      </div>

      {/* Bottom grid */}
      <div className="dashboard-grid">

        {/* Monthly table */}
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th style={{ textAlign:'right' }}>Total Candidate Onboard</th>
              </tr>
            </thead>
            <tbody>
              {monthly.length === 0
                ? MONTHS.map(m => (
                    <tr key={m}>
                      <td style={{ fontWeight:500 }}>{m}</td>
                      <td style={{ textAlign:'right', fontWeight:700 }}>0</td>
                    </tr>
                  ))
                : monthly.map(({ month, count }) => (
                    <tr key={month}>
                      <td style={{ fontWeight:500 }}>{month}</td>
                      <td style={{ textAlign:'right', fontWeight:700 }}>
                        {count >= 20 ? `${count}+` : count || '—'}
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>

        {/* Recent candidates */}
        <div className="card">
          <div className="card-head" style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span>Recent Applications</span>
            <Link href="/admin/applications" style={{ fontSize:12, color:'#1a56db', textDecoration:'none', fontWeight:500 }}>
              View All →
            </Link>
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Country</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign:'center', padding:'32px 0', color:'#9ca3af' }}>No applications yet</td></tr>
              ) : (
                recent.map(c => (
                  <tr key={c._id}>
                    <td>
                      <span style={{ fontFamily:'monospace', fontSize:12, color:'#1a56db', fontWeight:700 }}>
                        {c.applicationNumber}
                      </span>
                    </td>
                    <td style={{ fontWeight:500 }}>{c.fullName}</td>
                    <td style={{ color:'#6b7280' }}>{c.country || '—'}</td>
                    <td><StatusBadge status={c.status} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Mini stats */}
          <div style={{ display:'flex', borderTop:'1px solid #f3f4f6', padding:'12px 16px', gap:0 }}>
            {[
              { l:'Pending',  v: stats?.pending    ?? 0, c:'#f59e0b' },
              { l:'Approved', v: stats?.approved   ?? 0, c:'#22c55e' },
              { l:'Rejected', v: stats?.rejected   ?? 0, c:'#ef4444' },
              { l:'Issued',   v: stats?.issued     ?? 0, c:'#8b5cf6' },
            ].map(({ l, v, c }) => (
              <div key={l} style={{ flex:1, textAlign:'center', borderRight:'1px solid #f3f4f6' }}>
                <div style={{ fontSize:20, fontWeight:800, color:c, lineHeight:1 }}>{v}</div>
                <div style={{ fontSize:10, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.5px', fontWeight:600, marginTop:3 }}>{l}</div>
              </div>
            ))}
            <div style={{ flex:1, textAlign:'center' }}>
              <div style={{ fontSize:20, fontWeight:800, color:'#6b7280', lineHeight:1 }}>{stats?.underReview ?? 0}</div>
              <div style={{ fontSize:10, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.5px', fontWeight:600, marginTop:3 }}>In Review</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
