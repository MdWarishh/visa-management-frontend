'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { superAdminAPI } from '../../../../lib/api';
import toast from 'react-hot-toast';

const COUNTRIES = [
  'South Africa','Nigeria','Kenya','Ghana','Ethiopia','Tanzania','Uganda',
  'Egypt','Morocco','Algeria','Libya','Tunisia','Sudan','Zambia','Zimbabwe',
  'Pakistan','India','Bangladesh','Afghanistan','UAE','Saudi Arabia','Other'
];

export default function AdminDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');

  // Edit form
  const [form,   setForm]   = useState({ name:'', country:'', phone:'', password:'', isActive: true });
  const [showPw, setShowPw] = useState(false);
  const [newPw,  setNewPw]  = useState('');

  useEffect(() => { load(); }, [id]);

  const load = async () => {
    setLoading(true);
    try {
      const r = await superAdminAPI.getAdmin(id);
      if (r?.success) {
        setData(r.data);
        setForm({ name: r.data.name, country: r.data.country, phone: r.data.phone || '', isActive: r.data.isActive });
      } else {
        toast.error('Admin not found');
        router.push('/superadmin/admins');
      }
    } catch { toast.error('Error'); }
    finally { setLoading(false); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = { ...form };
      if (newPw.trim()) payload.password = newPw.trim();

      const r = await superAdminAPI.updateAdmin(id, payload);
      if (r?.success) {
        toast.success('Admin updated!');
        load();
        setNewPw('');
      } else {
        setError(r?.message || 'Failed');
      }
    } catch { setError('Server error'); }
    finally { setSaving(false); }
  };

  const handleToggle = async () => {
    if (!confirm(`${data.isActive ? 'Disable' : 'Enable'} this admin?`)) return;
    try {
      const r = await superAdminAPI.toggleAdmin(id);
      if (r?.success) { toast.success(r.message); load(); }
      else toast.error(r?.message || 'Failed');
    } catch { toast.error('Error'); }
  };

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'50vh' }}>
      <div className="spin spin-dark" style={{ width:28, height:28, border:'3px solid #e2e8f0', borderTopColor:'#7c3aed' }} />
    </div>
  );

  if (!data) return null;

  const statItems = [
    { label:'Total Candidates', value: data.stats?.total    || 0 },
    { label:'Approved',         value: data.stats?.Approved || 0 },
    { label:'Issued',           value: data.stats?.Issued   || 0 },
    { label:'Rejected',         value: data.stats?.Rejected || 0 },
  ];

  return (
    <div className="fade">
      {/* Breadcrumb */}
      <div className="breadcrumb" style={{ marginBottom:18 }}>
        <Link href="/superadmin/admins">Manage Admins</Link>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">{data.name}</span>
      </div>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:22 }}>
        <div>
          <h1 className="page-title" style={{ marginBottom:2 }}>{data.name}</h1>
          <p style={{ color:'#6b7280', fontSize:13 }}>{data.email} • {data.country}</p>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <span className={`badge ${data.isActive ? 'badge-approved' : 'badge-rejected'}`} style={{ fontSize:13, padding:'6px 14px' }}>
            {data.isActive ? 'Active' : 'Disabled'}
          </span>
          <button
            className="btn"
            style={{ background: data.isActive ? '#fee2e2' : '#dcfce7', color: data.isActive ? '#dc2626' : '#15803d', border:'none' }}
            onClick={handleToggle}
          >
            {data.isActive ? 'Disable Admin' : 'Enable Admin'}
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }}>
        {statItems.map(({ label, value }) => (
          <div key={label} className="stat-card" style={{ padding:'16px 18px' }}>
            <div>
              <div style={{ fontSize:12, fontWeight:600, color:'#6b7280', marginBottom:4, textTransform:'uppercase', letterSpacing:'0.4px' }}>{label}</div>
              <div style={{ fontSize:28, fontWeight:800, color:'#0f172a', letterSpacing:'-1px' }}>{value}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>

        {/* Edit form */}
        <div className="form-card">
          <div className="form-card-head">Edit Admin Info</div>
          <form onSubmit={handleSave} style={{ padding:'18px 20px' }}>
            {error && <div className="alert-error" style={{ marginBottom:14 }}>{error}</div>}

            <div className="fg">
              <label>Full Name</label>
              <input className="fi" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="fg">
              <label>Country</label>
              <select className="fi" required value={form.country} onChange={e => setForm(p => ({ ...p, country: e.target.value }))}>
                {COUNTRIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="fg">
              <label>Phone</label>
              <input className="fi" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
            </div>

            {/* Reset password */}
            <div className="fg">
              <label>New Password <span style={{ color:'#9ca3af', fontWeight:400 }}>(leave blank to keep same)</span></label>
              <div style={{ position:'relative' }}>
                <input className="fi" type={showPw ? 'text' : 'password'} placeholder="Enter new password…"
                  value={newPw} onChange={e => setNewPw(e.target.value)} />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#9ca3af' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="form-actions" style={{ padding:0, background:'none', border:'none', marginTop:8 }}>
              <button type="submit" className="btn btn-primary" style={{ background:'#7c3aed' }} disabled={saving}>
                {saving ? <><div className="spin" style={{ width:14, height:14 }} /> Saving…</> : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Admin's Users list */}
        <div className="card">
          <div className="card-head">Users Created by This Admin ({data.users?.length || 0})</div>
          {!data.users?.length ? (
            <div style={{ padding:'32px 20px', textAlign:'center', color:'#9ca3af' }}>
              <div style={{ fontSize:28, marginBottom:8 }}>👥</div>
              <div style={{ fontSize:13 }}>No users created yet</div>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Permissions</th>
                </tr>
              </thead>
              <tbody>
                {data.users.map(u => (
                  <tr key={u._id}>
                    <td style={{ fontWeight:500 }}>{u.name}</td>
                    <td style={{ fontSize:12, color:'#6b7280' }}>{u.email}</td>
                    <td>
                      <span className={`badge ${u.isActive ? 'badge-approved' : 'badge-rejected'}`} style={{ fontSize:11 }}>
                        {u.isActive ? 'Active' : 'Off'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:3 }}>
                        {Object.entries(u.permissions || {})
                          .filter(([k, v]) => v && k !== 'canView')
                          .map(([k]) => (
                            <span key={k} style={{ background:'#eff6ff', color:'#1d4ed8', fontSize:10, padding:'2px 6px', borderRadius:8, fontWeight:600 }}>
                              {k.replace('can','').toLowerCase()}
                            </span>
                          ))
                        }
                        {Object.values(u.permissions || {}).filter((v,i) => v && i > 0).length === 0 && (
                          <span style={{ color:'#9ca3af', fontSize:11 }}>View only</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
