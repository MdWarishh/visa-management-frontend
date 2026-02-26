'use client';
import { useEffect, useState } from 'react';
import { userAPI } from '../../../lib/api';
import toast from 'react-hot-toast';

const PERMS = [
  { key:'canAdd',      label:'Add Application',    desc:'Naya candidate add kar sakta hai'     },
  { key:'canEdit',     label:'Edit Application',   desc:'Existing candidate edit kar sakta hai' },
  { key:'canDelete',   label:'Delete Application', desc:'Candidate delete kar sakta hai'        },
  { key:'canExport',   label:'Export Data',        desc:'Excel export kar sakta hai'            },
  { key:'canDownload', label:'Download Visa PDF',  desc:'Issued visa PDF download kar sakta hai'},
];

const defaultPerms = () => ({ canAdd:false, canEdit:false, canDelete:false, canExport:false, canDownload:false });

/* ── Inline styles for the modal overlay ──────────────────────────
   Problem: Admin panel mein sidebar 260px fixed left pe hoti hai.
   Solution: Portal-style overlay — pure viewport cover, sidebar ke
   upar bhi, left:0 se start, poori width/height.
   z-index 9999 taaki sidebar (z:100) ke upar rahe.
──────────────────────────────────────────────────────────────────── */

export default function UsersPage() {
  const [users,    setUsers]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [form,     setForm]     = useState({ name:'', email:'', password:'', permissions: defaultPerms() });
  const [formErr,  setFormErr]  = useState('');
  const [saving,   setSaving]   = useState(false);
  const [showPw,   setShowPw]   = useState(false);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    load();
  }, []);

  // Lock body scroll when modal open
  useEffect(() => {
    if (modal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [modal]);

  const load = async () => {
    setLoading(true);
    try {
      const r = await userAPI.getAll();
      if (r?.success) setUsers(r.data || []);
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  const openCreate = () => {
    setForm({ name:'', email:'', password:'', permissions: defaultPerms() });
    setFormErr(''); setShowPw(false);
    setModal('create'); setEditUser(null);
  };

  const openEdit = (user) => {
    setEditUser(user);
    setForm({ name: user.name, email: user.email, password:'', permissions: { ...defaultPerms(), ...user.permissions } });
    setFormErr(''); setShowPw(false);
    setModal(user._id);
  };

  const closeModal = () => { setModal(null); setEditUser(null); setFormErr(''); };

  const setP = (key) => setForm(p => ({ ...p, permissions: { ...p.permissions, [key]: !p.permissions[key] } }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErr('');
    if (!form.name || !form.email) { setFormErr('Name and email required.'); return; }
    if (modal === 'create' && !form.password) { setFormErr('Password required for new user.'); return; }
    if (form.password && form.password.length < 6) { setFormErr('Password min 6 characters.'); return; }

    setSaving(true);
    try {
      const payload = { name: form.name, email: form.email, permissions: form.permissions };
      if (form.password) payload.password = form.password;
      const r = modal === 'create'
        ? await userAPI.create(payload)
        : await userAPI.update(modal, payload);
      if (r?.success) {
        toast.success(modal === 'create' ? `User "${form.name}" created!` : 'User updated!');
        closeModal(); load();
      } else { setFormErr(r?.message || 'Failed.'); }
    } catch { setFormErr('Server error.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      const r = await userAPI.delete(id);
      if (r?.success) { toast.success('User deleted.'); load(); }
      else toast.error(r?.message || 'Failed.');
    } catch { toast.error('Error.'); }
    finally { setDeleting(null); }
  };

  const handleToggle = async (user) => {
    try {
      const r = await userAPI.update(user._id, { isActive: !user.isActive });
      if (r?.success) { toast.success(`User ${!user.isActive ? 'enabled' : 'disabled'}.`); load(); }
    } catch { toast.error('Error.'); }
  };

  const permCount = (perms) => Object.entries(perms || {}).filter(([k,v]) => v && k !== 'canView').length;

  return (
    <div className="fade">
      {/* ── Page header ── */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:22 }}>
        <div>
          <h1 className="page-title" style={{ marginBottom:2 }}>Manage Users</h1>
          <p style={{ color:'#6b7280', fontSize:13 }}>Create users and assign permissions for your panel</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Create User</button>
      </div>

      {/* ── Users table ── */}
      <div className="card">
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Permissions</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j}><div className="skel" style={{ height:12, width:'70%' }} /></td>
                    ))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign:'center', padding:'52px 0', color:'#9ca3af' }}>
                    <div style={{ fontSize:36, marginBottom:10 }}>👥</div>
                    <div style={{ fontWeight:600, fontSize:14, marginBottom:4 }}>No users yet</div>
                    <div style={{ fontSize:13 }}>Click "Create User" to add your first user</div>
                  </td>
                </tr>
              ) : (
                users.map(u => (
                  <tr key={u._id}>
                    <td style={{ fontWeight:600 }}>{u.name}</td>
                    <td style={{ color:'#6b7280', fontSize:12.5 }}>{u.email}</td>
                    <td>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:3 }}>
                        <span style={{ background:'#f0fdf4', color:'#15803d', fontSize:10.5, padding:'2px 7px', borderRadius:8, fontWeight:600 }}>
                          View
                        </span>
                        {PERMS.filter(p => u.permissions?.[p.key]).map(p => (
                          <span key={p.key} style={{ background:'#eff6ff', color:'#1d4ed8', fontSize:10.5, padding:'2px 7px', borderRadius:8, fontWeight:600 }}>
                            {p.label.replace('Application','').trim()}
                          </span>
                        ))}
                        {permCount(u.permissions) === 0 && (
                          <span style={{ color:'#9ca3af', fontSize:11 }}>View only</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span style={{
                        background: u.isActive ? '#dcfce7' : '#f3f4f6',
                        color:      u.isActive ? '#166534' : '#6b7280',
                        fontSize: 11.5, padding:'3px 10px', borderRadius:20, fontWeight:600
                      }}>
                        {u.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td style={{ color:'#6b7280', fontSize:12 }}>
                      {new Date(u.createdAt).toLocaleDateString('en-GB')}
                    </td>
                    <td>
                      <div style={{ display:'flex', gap:5, alignItems:'center' }}>
                        <button className="btn-edit" onClick={() => openEdit(u)}>Edit</button>
                        <button
                          className="btn btn-icon-only"
                          style={{ background: u.isActive ? '#fff7ed' : '#f0fdf4', color: u.isActive ? '#c2410c' : '#15803d', border:`1px solid ${u.isActive ? '#fed7aa' : '#bbf7d0'}`, padding:'5px 10px', borderRadius:5, fontSize:11.5, fontWeight:600, cursor:'pointer' }}
                          onClick={() => handleToggle(u)}
                        >
                          {u.isActive ? 'Disable' : 'Enable'}
                        </button>
                        <button className="btn-del" onClick={() => handleDelete(u._id, u.name)} disabled={deleting === u._id}>
                          {deleting === u._id
                            ? <div className="spin spin-dark" style={{ width:14, height:14 }} />
                            : <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                              </svg>
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
      </div>

      {/* ══════════════════════════════════════════════════════════
          MODAL — position:fixed with left:0 (NOT left:sidebar-width)
          z-index:9999 — sidebar (z:100) ke upar
          viewport ka exact centre — sidebar ignore
      ══════════════════════════════════════════════════════════ */}
      {modal && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
          style={{
            position: 'fixed',
            top: 0, left: 0,          /* full viewport — sidebar ignore */
            width: '100vw',
            height: '100vh',
            background: 'rgba(15,23,42,0.6)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,              /* sidebar (100) ke upar */
            padding: '20px',
          }}
        >
          {/* ── Modal Box ── */}
          <div style={{
            background: '#fff',
            borderRadius: 14,
            width: '100%',
            maxWidth: 520,
            boxShadow: '0 32px 80px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '90vh',
            overflow: 'hidden',
          }}>

            {/* ── Modal Header (sticky) ── */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0,
              background: '#fff',
            }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:36, height:36, background:'#eff6ff', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div>
                  <h2 style={{ fontSize:16, fontWeight:700, color:'#0f172a', lineHeight:1.2 }}>
                    {modal === 'create' ? 'Create New User' : `Edit User`}
                  </h2>
                  {modal !== 'create' && (
                    <p style={{ fontSize:12, color:'#6b7280', marginTop:1 }}>{editUser?.name}</p>
                  )}
                </div>
              </div>
              <button
                onClick={closeModal}
                style={{ width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:8, cursor:'pointer', color:'#64748b', flexShrink:0 }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* ── Modal Body (scrollable) ── */}
            <div style={{ overflowY: 'auto', flex: 1, padding: '22px 24px' }}>

              {formErr && (
                <div style={{ display:'flex', alignItems:'flex-start', gap:8, background:'#fef2f2', border:'1px solid #fecaca', borderRadius:8, padding:'10px 14px', marginBottom:16 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="#dc2626" style={{ flexShrink:0, marginTop:1 }}>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                  <span style={{ fontSize:13, color:'#991b1b', fontWeight:500 }}>{formErr}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} id="user-form">

                {/* ── User Info Section ── */}
                <div style={{ marginBottom:20 }}>
                  <div style={{ fontSize:11, fontWeight:700, color:'#94a3b8', letterSpacing:'0.6px', textTransform:'uppercase', marginBottom:12 }}>
                    User Information
                  </div>

                  <div className="fg" style={{ marginBottom:14 }}>
                    <label style={{ fontSize:13, fontWeight:600, color:'#374151', display:'block', marginBottom:6 }}>
                      Full Name <span style={{ color:'#ef4444' }}>*</span>
                    </label>
                    <input
                      className="fi"
                      placeholder="Enter full name"
                      required
                      value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      style={{ width:'100%' }}
                    />
                  </div>

                  <div className="fg" style={{ marginBottom:14 }}>
                    <label style={{ fontSize:13, fontWeight:600, color:'#374151', display:'block', marginBottom:6 }}>
                      Email Address <span style={{ color:'#ef4444' }}>*</span>
                    </label>
                    <input
                      className="fi"
                      type="email"
                      placeholder="user@example.com"
                      required
                      value={form.email}
                      onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      readOnly={modal !== 'create'}
                      style={{ width:'100%', ...(modal !== 'create' ? { background:'#f8fafc', color:'#94a3b8', cursor:'not-allowed' } : {}) }}
                    />
                  </div>

                  <div className="fg" style={{ marginBottom:0 }}>
                    <label style={{ fontSize:13, fontWeight:600, color:'#374151', display:'block', marginBottom:6 }}>
                      Password
                      {modal === 'create'
                        ? <span style={{ color:'#ef4444' }}> *</span>
                        : <span style={{ color:'#94a3b8', fontWeight:400, fontSize:12 }}> (blank = no change)</span>
                      }
                    </label>
                    <div style={{ position:'relative' }}>
                      <input
                        className="fi"
                        type={showPw ? 'text' : 'password'}
                        placeholder={modal === 'create' ? 'Minimum 6 characters' : 'New password (optional)'}
                        value={form.password}
                        onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                        style={{ width:'100%', paddingRight:40 }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw(v => !v)}
                        style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#94a3b8', display:'flex', alignItems:'center', padding:0 }}
                      >
                        {showPw
                          ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                          : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        }
                      </button>
                    </div>
                  </div>
                </div>

                {/* ── Permissions Section ── */}
                <div style={{ borderTop:'1px solid #f1f5f9', paddingTop:20 }}>
                  <div style={{ fontSize:11, fontWeight:700, color:'#94a3b8', letterSpacing:'0.6px', textTransform:'uppercase', marginBottom:12 }}>
                    Permissions
                  </div>

                  {/* View — always ON */}
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'11px 14px', background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:9, marginBottom:8 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:30, height:30, background:'#dcfce7', borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2.5">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                        </svg>
                      </div>
                      <div>
                        <div style={{ fontSize:13, fontWeight:600, color:'#15803d' }}>View Applications</div>
                        <div style={{ fontSize:11, color:'#6b7280' }}>Always allowed — cannot be removed</div>
                      </div>
                    </div>
                    <div style={{ width:40, height:22, background:'#22c55e', borderRadius:20, position:'relative', flexShrink:0 }}>
                      <div style={{ width:18, height:18, background:'#fff', borderRadius:'50%', position:'absolute', top:2, right:2, boxShadow:'0 1px 3px rgba(0,0,0,0.15)' }} />
                    </div>
                  </div>

                  {/* Toggleable permissions */}
                  {PERMS.map(({ key, label, desc }) => {
                    const on = form.permissions[key];
                    const icons = {
                      canAdd:      <path d="M12 5v14M5 12h14"/>,
                      canEdit:     <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
                      canDelete:   <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>,
                      canExport:   <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
                      canDownload: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
                    };
                    return (
                      <div
                        key={key}
                        onClick={() => setP(key)}
                        style={{
                          display:'flex', alignItems:'center', justifyContent:'space-between',
                          padding:'11px 14px', borderRadius:9, marginBottom:8, cursor:'pointer',
                          border:`1px solid ${on ? '#bfdbfe' : '#e5e7eb'}`,
                          background: on ? '#eff6ff' : '#fff',
                          transition:'all 0.15s',
                          userSelect:'none',
                        }}
                      >
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <div style={{ width:30, height:30, background: on ? '#dbeafe' : '#f8fafc', borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={on ? '#1d4ed8' : '#9ca3af'} strokeWidth="2">
                              {icons[key]}
                            </svg>
                          </div>
                          <div>
                            <div style={{ fontSize:13, fontWeight:600, color: on ? '#1d4ed8' : '#374151' }}>{label}</div>
                            <div style={{ fontSize:11, color:'#6b7280' }}>{desc}</div>
                          </div>
                        </div>
                        <div style={{ width:40, height:22, borderRadius:20, position:'relative', flexShrink:0, background: on ? '#1a56db' : '#d1d5db', transition:'background 0.2s' }}>
                          <div style={{ width:18, height:18, background:'#fff', borderRadius:'50%', position:'absolute', top:2, left: on ? 20 : 2, transition:'left 0.2s', boxShadow:'0 1px 3px rgba(0,0,0,0.15)' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </form>
            </div>

            {/* ── Modal Footer (sticky) ── */}
            <div style={{ padding:'16px 24px', borderTop:'1px solid #f1f5f9', display:'flex', gap:10, flexShrink:0, background:'#fff' }}>
              <button
                type="submit"
                form="user-form"
                className="btn btn-primary"
                style={{ flex:1, justifyContent:'center' }}
                disabled={saving}
              >
                {saving
                  ? <><div className="spin" style={{ width:14, height:14 }} />{modal === 'create' ? 'Creating…' : 'Saving…'}</>
                  : modal === 'create' ? '+ Create User' : 'Save Changes'
                }
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeModal}
                style={{ minWidth:90 }}
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}