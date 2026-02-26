'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { superAdminAPI } from '../../../lib/api';
import toast from 'react-hot-toast';

const COUNTRIES = [
  'South Africa','Nigeria','Kenya','Ghana','Ethiopia','Tanzania','Uganda',
  'Egypt','Morocco','Algeria','Libya','Tunisia','Sudan','Zambia','Zimbabwe',
  'Pakistan','India','Bangladesh','Afghanistan','UAE','Saudi Arabia','Other'
];

export default function AdminsPage() {
  const [admins,   setAdmins]   = useState([]);
  const [pages,    setPages]    = useState({});
  const [loading,  setLoading]  = useState(true);
  const [toggling, setToggling] = useState(null);
  const [search,   setSearch]   = useState('');
  const [page,     setPage]     = useState(1);

  // Create modal state
  const [showModal, setShowModal] = useState(false);
  const [form,      setForm]      = useState({ name:'', email:'', password:'', country:'', phone:'' });
  const [formErr,   setFormErr]   = useState('');
  const [creating,  setCreating]  = useState(false);
  const [showPw,    setShowPw]    = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await superAdminAPI.getAdmins({ page, limit:15, search });
      if (r?.success) { setAdmins(r.data || []); setPages(r.pagination || {}); }
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const handleSearch = (v) => { setSearch(v); setPage(1); };

  const handleToggle = async (id, name, isActive) => {
    if (!confirm(`${isActive ? 'Disable' : 'Enable'} admin "${name}"?`)) return;
    setToggling(id);
    try {
      const r = await superAdminAPI.toggleAdmin(id);
      if (r?.success) {
        toast.success(r.message);
        setAdmins(prev => prev.map(a => a._id === id ? { ...a, isActive: r.isActive } : a));
      } else toast.error(r?.message || 'Failed');
    } catch { toast.error('Error'); }
    finally { setToggling(null); }
  };

  const setF = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormErr('');
    if (!form.name || !form.email || !form.password || !form.country) {
      setFormErr('Name, email, password, country — sab required.'); return;
    }
    setCreating(true);
    try {
      const r = await superAdminAPI.createAdmin(form);
      if (r?.success) {
        toast.success(`Admin "${form.name}" created!`);
        setShowModal(false);
        setForm({ name:'', email:'', password:'', country:'', phone:'' });
        load();
      } else {
        setFormErr(r?.message || 'Failed to create admin.');
      }
    } catch { setFormErr('Server error.'); }
    finally { setCreating(false); }
  };

  const totalPages = pages.pages || 1;

  return (
    <div className="fade">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:22 }}>
        <div>
          <h1 className="page-title" style={{ marginBottom:2 }}>Manage Admins</h1>
          <p style={{ color:'#6b7280', fontSize:13 }}>Create and manage admin accounts</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}
          style={{ background:'#7c3aed' }}>
          + Create Admin
        </button>
      </div>

      <div className="card">
        {/* Filter bar */}
        <div className="filter-bar">
          <div className="search-wrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input type="text" className="search-input" placeholder="Search by name, email, country…"
              value={search} onChange={e => handleSearch(e.target.value)} />
          </div>
          <div style={{ flex:1 }} />
          <span style={{ fontSize:13, color:'#6b7280' }}>
            Total: <strong>{pages.total || 0}</strong> admins
          </span>
        </div>

        {/* Table */}
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Country</th>
                <th>Phone</th>
                <th>Candidates</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 9 }).map((_, j) => (
                      <td key={j}><div className="skel" style={{ height:12, width:'75%' }} /></td>
                    ))}
                  </tr>
                ))
              ) : admins.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign:'center', padding:'48px 0', color:'#9ca3af' }}>
                  <div style={{ fontSize:36, marginBottom:10 }}>👤</div>
                  <div style={{ fontWeight:600, fontSize:14, marginBottom:4 }}>No admins yet</div>
                  <div style={{ fontSize:13 }}>Click "Create Admin" to add first admin</div>
                </td></tr>
              ) : (
                admins.map(a => (
                  <tr key={a._id}>
                    <td style={{ fontWeight:600 }}>{a.name}</td>
                    <td style={{ color:'#6b7280', fontSize:12.5 }}>{a.email}</td>
                    <td>
                      <span style={{ background:'#f5f3ff', color:'#7c3aed', padding:'3px 9px', borderRadius:12, fontSize:11.5, fontWeight:600 }}>
                        {a.country}
                      </span>
                    </td>
                    <td style={{ color:'#6b7280', fontSize:12.5 }}>{a.phone || '—'}</td>
                    <td style={{ fontWeight:700 }}>{a.candidateCount || 0}</td>
                    <td>
                      <span className={`badge ${a.isActive ? 'badge-approved' : 'badge-rejected'}`}>
                        {a.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td style={{ color:'#6b7280', fontSize:12 }}>
                      {a.lastLogin ? new Date(a.lastLogin).toLocaleDateString('en-GB') : 'Never'}
                    </td>
                    <td style={{ color:'#6b7280', fontSize:12 }}>
                      {new Date(a.createdAt).toLocaleDateString('en-GB')}
                    </td>
                    <td>
                      <div style={{ display:'flex', gap:5, alignItems:'center' }}>
                        <Link href={`/superadmin/admins/${a._id}`} className="btn-view" style={{ fontSize:11.5 }}>
                          View
                        </Link>
                        <button
                          className="btn btn-icon-only"
                          style={{ background: a.isActive ? '#fee2e2' : '#dcfce7', color: a.isActive ? '#dc2626' : '#15803d', border:'none', padding:'5px 10px', borderRadius:5, fontSize:11.5, fontWeight:600, cursor:'pointer' }}
                          onClick={() => handleToggle(a._id, a.name, a.isActive)}
                          disabled={toggling === a._id}
                        >
                          {toggling === a._id
                            ? <div className="spin" style={{ width:12, height:12, borderColor:'rgba(0,0,0,0.2)', borderTopColor:'currentColor' }} />
                            : a.isActive ? 'Disable' : 'Enable'
                          }
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination">
          <span>{pages.total > 0 ? `${admins.length} of ${pages.total} admins` : ''}</span>
          <div className="pg-btns">
            <button className="pg-prev-next" onClick={() => setPage(p => p-1)} disabled={page===1||loading}>Previous</button>
            {Array.from({ length: Math.min(totalPages,5) }, (_, i) => i+1).map(n => (
              <button key={n} className={`pg-btn ${n===page?'active':''}`} onClick={() => setPage(n)}>{n}</button>
            ))}
            <button className="pg-prev-next" onClick={() => setPage(p => p+1)} disabled={page===totalPages||loading}>Next</button>
          </div>
        </div>
      </div>

      {/* ── Create Admin Modal ── */}
      {showModal && (
        <div style={{
          position:'fixed', inset:0, background:'rgba(0,0,0,0.5)',
          display:'flex', alignItems:'center', justifyContent:'center',
          zIndex:1000, padding:20,
        }}>
          <div style={{
            background:'#fff', borderRadius:12, width:'100%', maxWidth:480,
            boxShadow:'0 25px 60px rgba(0,0,0,0.25)', overflow:'hidden',
          }}>
            {/* Modal header */}
            <div style={{ padding:'18px 22px', borderBottom:'1px solid #f3f4f6', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <h2 style={{ fontSize:16, fontWeight:700, color:'#0f172a' }}>Create New Admin</h2>
              <button onClick={() => { setShowModal(false); setFormErr(''); }}
                style={{ background:'none', border:'none', cursor:'pointer', color:'#9ca3af', fontSize:20, lineHeight:1 }}>
                ✕
              </button>
            </div>

            {/* Modal body */}
            <form onSubmit={handleCreate} style={{ padding:'20px 22px' }}>
              {formErr && (
                <div className="alert-error" style={{ marginBottom:16 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink:0, marginTop:1 }}>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                  {formErr}
                </div>
              )}

              <div className="fg">
                <label>Full Name <span style={{ color:'#ef4444' }}>*</span></label>
                <input className="fi" placeholder="e.g. John Smith" required
                  value={form.name} onChange={e => setF('name', e.target.value)} />
              </div>

              <div className="fg">
                <label>Email Address <span style={{ color:'#ef4444' }}>*</span></label>
                <input className="fi" type="email" placeholder="admin@example.com" required
                  value={form.email} onChange={e => setF('email', e.target.value)} />
              </div>

              <div style={{ position:'relative' }} className="fg">
                <label>Password <span style={{ color:'#ef4444' }}>*</span></label>
                <div style={{ position:'relative' }}>
                  <input className="fi" type={showPw ? 'text' : 'password'}
                    placeholder="Min 8 chars + upper + number + special"
                    required value={form.password} onChange={e => setF('password', e.target.value)} />
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#9ca3af' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                  </button>
                </div>
                <p style={{ fontSize:11, color:'#9ca3af', marginTop:4 }}>
                  Min 8 chars + uppercase + lowercase + number + special char (!@#$...)
                </p>
              </div>

              <div className="fg">
                <label>Country <span style={{ color:'#ef4444' }}>*</span></label>
                <select className="fi" required value={form.country} onChange={e => setF('country', e.target.value)}>
                  <option value="">Select Country</option>
                  {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div className="fg">
                <label>Phone <span style={{ color:'#9ca3af', fontWeight:400 }}>(optional)</span></label>
                <input className="fi" placeholder="+1234567890"
                  value={form.phone} onChange={e => setF('phone', e.target.value)} />
              </div>

              <div style={{ display:'flex', gap:10, marginTop:8 }}>
                <button type="submit" className="btn btn-primary" style={{ flex:1, justifyContent:'center', background:'#7c3aed' }} disabled={creating}>
                  {creating ? <><div className="spin" style={{ width:14, height:14 }} /> Creating…</> : 'Create Admin'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); setFormErr(''); }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
