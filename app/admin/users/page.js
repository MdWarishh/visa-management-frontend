'use client';
import { useEffect, useState } from 'react';
import { userAPI } from '../../../lib/api';
import toast from 'react-hot-toast';

const PERMS = [
  { key:'canAdd',      label:'Add Application',    desc:'Naya candidate add kar sakta hai'    },
  { key:'canEdit',     label:'Edit Application',   desc:'Existing candidate edit kar sakta hai'},
  { key:'canDelete',   label:'Delete Application', desc:'Candidate delete kar sakta hai'       },
  { key:'canExport',   label:'Export Data',        desc:'Excel export kar sakta hai'           },
  { key:'canDownload', label:'Download Visa PDF',  desc:'Issued visa PDF download kar sakta hai'},
];

const defaultPerms = () => ({ canAdd:false, canEdit:false, canDelete:false, canExport:false, canDownload:false });

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
    if (modal) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [modal]);

  useEffect(() => { load(); }, []);

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
      const r = modal === 'create' ? await userAPI.create(payload) : await userAPI.update(modal, payload);
      if (r?.success) {
        toast.success(modal === 'create' ? 'User created!' : 'User updated!');
        closeModal(); load();
      } else setFormErr(r?.message || 'Failed.');
    } catch { setFormErr('Server error.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!confirm('Delete user "' + name + '"?')) return;
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
      if (r?.success) { toast.success('User ' + (!user.isActive ? 'enabled' : 'disabled') + '.'); load(); }
    } catch { toast.error('Error.'); }
  };

  const permCount = (perms) => Object.entries(perms || {}).filter(([k,v]) => v && k !== 'canView').length;

  return (
    <div className="fade">

      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:22, gap:12, flexWrap:'wrap' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom:2 }}>Manage Users</h1>
          <p style={{ color:'#6b7280', fontSize:13 }}>Create users and assign permissions for your panel</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate} style={{ flexShrink:0 }}>+ Create User</button>
      </div>

      <div className="card">
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th><th>Email</th><th>Permissions</th>
                <th>Status</th><th>Created</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 6 }).map((_, j) => (
                    <td key={j}><div className="skel" style={{ height:12, width:'70%' }} /></td>
                  ))}</tr>
                ))
              ) : users.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign:'center', padding:'52px 0', color:'#9ca3af' }}>
                  <div style={{ fontSize:36, marginBottom:10 }}>👥</div>
                  <div style={{ fontWeight:600, fontSize:14, marginBottom:4 }}>No users yet</div>
                  <div style={{ fontSize:13 }}>Click "Create User" to add your first user</div>
                </td></tr>
              ) : users.map(u => (
                <tr key={u._id}>
                  <td style={{ fontWeight:600 }}>{u.name}</td>
                  <td style={{ color:'#6b7280', fontSize:12.5 }}>{u.email}</td>
                  <td>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:3 }}>
                      <span style={{ background:'#f0fdf4', color:'#15803d', fontSize:10.5, padding:'2px 7px', borderRadius:8, fontWeight:600 }}>View</span>
                      {PERMS.filter(p => u.permissions?.[p.key]).map(p => (
                        <span key={p.key} style={{ background:'#eff6ff', color:'#1d4ed8', fontSize:10.5, padding:'2px 7px', borderRadius:8, fontWeight:600 }}>
                          {p.label.replace('Application','').trim()}
                        </span>
                      ))}
                      {permCount(u.permissions) === 0 && <span style={{ color:'#9ca3af', fontSize:11 }}>View only</span>}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize:11.5, fontWeight:700, padding:'3px 10px', borderRadius:20, background: u.isActive ? '#dcfce7' : '#fee2e2', color: u.isActive ? '#166534' : '#991b1b' }}>
                      {u.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td style={{ color:'#6b7280', fontSize:12 }}>{new Date(u.createdAt).toLocaleDateString('en-GB')}</td>
                  <td>
                    <div style={{ display:'flex', gap:5, alignItems:'center', flexWrap:'wrap' }}>
                      <button className="btn-edit" onClick={() => openEdit(u)}>Edit</button>
                      <button
                        className="btn btn-icon-only"
                        style={{ background: u.isActive ? '#fff7ed' : '#f0fdf4', color: u.isActive ? '#c2410c' : '#15803d', border:'1px solid ' + (u.isActive ? '#fed7aa' : '#bbf7d0'), padding:'5px 10px', borderRadius:5, fontSize:11.5, fontWeight:600, cursor:'pointer' }}
                        onClick={() => handleToggle(u)}
                      >
                        {u.isActive ? 'Disable' : 'Enable'}
                      </button>
                      <button className="btn-del" onClick={() => handleDelete(u._id, u.name)} disabled={deleting === u._id}>
                        {deleting === u._id
                          ? <div className="spin spin-dark" style={{ width:14, height:14 }} />
                          : <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                        }
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ════════════════════════════════════
          MODAL — FIXED: top cut issue solved
          overflow on OVERLAY, not modal box
      ════════════════════════════════════ */}
      {modal && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
          style={{
            position:'fixed', inset:0,
            background:'rgba(0,0,0,0.5)',
            backdropFilter:'blur(2px)',
            zIndex:1000,
            overflowY:'auto',          /* scroll here, not inside modal */
            padding:'20px 16px',
            display:'flex',
            alignItems:'center',   /* start so top is never cut */
            justifyContent:'center',
          }}
        >
          <div style={{
            background:'#fff',
            borderRadius:12,
            width:'100%',
            maxWidth:500,
            boxShadow:'0 25px 60px rgba(0,0,0,0.25)',
            overflow:'hidden',
            margin:'auto',        
            position:'relative',
          }}>

            {/* Header */}
            <div style={{
              padding:'18px 22px',
              borderBottom:'1px solid #f3f4f6',
              display:'flex', alignItems:'center', justifyContent:'space-between',
              background:'#fff',
            }}>
              <h2 style={{ fontSize:16, fontWeight:700, color:'#0f172a' }}>
                {modal === 'create' ? '+ Create New User' : 'Edit: ' + editUser?.name}
              </h2>
              <button
                onClick={closeModal}
                style={{
                  background:'#f3f4f6', border:'none', cursor:'pointer', color:'#6b7280',
                  width:30, height:30, borderRadius:'50%', fontSize:15,
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}
              >✕</button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ padding:'20px 22px' }}>
              {formErr && (
                <div className="alert-error" style={{ marginBottom:14 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink:0, marginTop:1 }}>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                  {formErr}
                </div>
              )}

              <div className="fg">
                <label>Full Name <span style={{ color:'#ef4444' }}>*</span></label>
                <input className="fi" placeholder="User ka naam" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
              </div>

              <div className="fg">
                <label>Email Address <span style={{ color:'#ef4444' }}>*</span></label>
                <input className="fi" type="email" placeholder="user@example.com" required value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  readOnly={modal !== 'create'}
                  style={modal !== 'create' ? { background:'#f9fafb', color:'#6b7280' } : {}}
                />
              </div>

              <div className="fg">
                <label>
                  Password
                  {modal !== 'create' && <span style={{ color:'#9ca3af', fontWeight:400 }}> (leave blank to keep same)</span>}
                  {modal === 'create' && <span style={{ color:'#ef4444' }}> *</span>}
                </label>
                <div style={{ position:'relative' }}>
                  <input className="fi" type={showPw ? 'text' : 'password'}
                    placeholder={modal === 'create' ? 'Min 6 characters' : 'New password…'}
                    value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#9ca3af' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Permissions */}
              <div style={{ marginTop:6 }}>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:10, textTransform:'uppercase', letterSpacing:'0.4px' }}>
                  Permissions
                </label>

                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px', background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:8, marginBottom:8 }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:'#15803d' }}>View Applications</div>
                    <div style={{ fontSize:11.5, color:'#6b7280' }}>Applications dekhna — hamesha allowed</div>
                  </div>
                  <div style={{ width:40, height:22, background:'#22c55e', borderRadius:20, position:'relative', flexShrink:0 }}>
                    <div style={{ width:18, height:18, background:'#fff', borderRadius:'50%', position:'absolute', top:2, right:2 }} />
                  </div>
                </div>

                {PERMS.map(({ key, label, desc }) => {
                  const on = form.permissions[key];
                  return (
                    <div key={key} onClick={() => setP(key)} style={{
                      display:'flex', alignItems:'center', justifyContent:'space-between',
                      padding:'10px 14px', borderRadius:8, marginBottom:8, cursor:'pointer',
                      border:'1px solid ' + (on ? '#bfdbfe' : '#e5e7eb'),
                      background: on ? '#eff6ff' : '#fff',
                      transition:'all 0.15s', userSelect:'none',
                    }}>
                      <div style={{ flex:1, marginRight:12 }}>
                        <div style={{ fontSize:13, fontWeight:600, color: on ? '#1d4ed8' : '#374151' }}>{label}</div>
                        <div style={{ fontSize:11.5, color:'#6b7280' }}>{desc}</div>
                      </div>
                      <div style={{ width:40, height:22, borderRadius:20, position:'relative', flexShrink:0, background: on ? '#1a56db' : '#d1d5db', transition:'background 0.2s' }}>
                        <div style={{ width:18, height:18, background:'#fff', borderRadius:'50%', position:'absolute', top:2, left: on ? 20 : 2, transition:'left 0.2s', boxShadow:'0 1px 3px rgba(0,0,0,0.15)' }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ display:'flex', gap:10, marginTop:20, paddingTop:16, borderTop:'1px solid #f3f4f6' }}>
                <button type="submit" className="btn btn-primary" style={{ flex:1, justifyContent:'center' }} disabled={saving}>
                  {saving ? <><div className="spin" style={{ width:14, height:14 }} /> {modal === 'create' ? 'Creating…' : 'Saving…'}</> : modal === 'create' ? 'Create User' : 'Save Changes'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}