'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { candidateAPI } from '../../../../../lib/api';
import { getUser } from '../../../../../lib/auth';
import toast from 'react-hot-toast';

const STATUSES  = ['Pending','Under Review','Approved','Rejected','Issued'];
const isNew = (id) => id === 'new';

const toDateInput = (d) => {
  if (!d) return '';
  return new Date(d).toISOString().slice(0, 10);
};

export default function EditPage() {
  const { id }   = useParams();
  const router   = useRouter();
  const creating = isNew(id);
  const user     = getUser();

  const [form, setForm] = useState({
    passportNumber: '',
    visaNumber:     '',
    fullName:       '',
    dateOfBirth:    '',
    profession:     '',
    companyName:    '',
    visaIssueDate:  '',
    visaExpiryDate: '',
    visaType:       '',
    country:        '',
    status:         'Pending',
    message:        '',
    applicationNumber: '',
    applicationDate: '',
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading]  = useState(!creating);
  const [saving,  setSaving]   = useState(false);
  const [error,   setError]    = useState('');

  // Permissions
  const canEdit = user?.role === 'admin' || user?.role === 'superadmin' || user?.permissions?.canEdit;
  const canAdd  = user?.role === 'admin' || user?.role === 'superadmin' || user?.permissions?.canAdd;

  useEffect(() => {
    if (creating) return;
    (async () => {
      try {
        const r = await candidateAPI.get(id);
        if (r?.success) {
          const d = r.data;
          setForm({
            passportNumber:    d.passportNumber    || '',
            visaNumber:        d.visaNumber        || '',
            fullName:          d.fullName          || '',
            dateOfBirth:       toDateInput(d.dateOfBirth),
            profession:        d.profession        || '',
            companyName:       d.companyName       || '',
            visaIssueDate:     toDateInput(d.visaIssueDate),
            visaExpiryDate:    toDateInput(d.visaExpiryDate),
            visaType:          d.visaType          || '',
            country:           d.country           || '',
            status:            d.status            || 'Pending',
            message:           d.message           || '',
            applicationNumber: d.applicationNumber || '',
            applicationDate:   toDateInput(d.applicationDate),
          });
          if (d.photo) setPhotoPreview(`/uploads/photos/${d.photo.split('/').pop()}`);
        } else {
          toast.error('Record not found');
          router.push('/admin/applications');
        }
      } catch { toast.error('Server error'); }
      finally  { setLoading(false); }
    })();
  }, [id, creating, router]);

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) { toast.error('Photo max 3MB'); return; }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.fullName || !form.passportNumber || !form.dateOfBirth || !form.country || !form.applicationNumber) {
      setError('Name, Passport No, DOB, Country, Application Number — required hain.');
      return;
    }

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v !== '' && v !== null && v !== undefined) fd.append(k, v);
    });
    if (photoFile) fd.append('photo', photoFile);

    setSaving(true);
    try {
      const r = creating
        ? await candidateAPI.create(fd)
        : await candidateAPI.update(id, fd);

      if (r?.success) {
        toast.success(creating ? 'Record added!' : 'Saved successfully!');
        router.push('/admin/applications');
      } else {
        setError(r?.message || 'Save failed.');
      }
    } catch { setError('Server error. Check backend.'); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'50vh', gap:14, flexDirection:'column' }}>
      <div className="spin spin-dark" style={{ width:28, height:28, border:'3px solid #e2e8f0', borderTopColor:'#1a56db' }} />
      <p style={{ color:'#6b7280', fontSize:14 }}>Loading…</p>
    </div>
  );

  // Field config — exactly 12 fields from screenshot
  const fields = [
    { key:'passportNumber', label:'Passport No.',    type:'text',   required:true,  placeholder:'e.g. B6814311', upper:true },
    { key:'visaNumber',     label:'Visa No.',        type:'text',   required:false, placeholder:'e.g. CEG307412/1217' },
    { key:'fullName',       label:'Name',            type:'text',   required:true,  placeholder:'Full name (MR/MRS prefix)' },
    { key:'dateOfBirth',    label:'Date of Birth',   type:'date',   required:true  },
    { key:'profession',     label:'Profession',      type:'text',   required:false, placeholder:'e.g. DUCT MAN' },
    { key:'companyName',    label:'Company Name',    type:'text',   required:false, placeholder:'e.g. SHIKUN & BINUI COMPANY ISRAEL' },
    { key:'visaIssueDate',  label:'Visa Issue Date', type:'date',   required:false },
    { key:'visaExpiryDate', label:'Visa Expiry Date',type:'date',   required:false },
    { key:'visaType',       label:'Visa Type',       type:'text',   required:false, placeholder:'e.g. Employment Visa' },
    { key:'country',        label:'Country',         type:'text',   required:true,  placeholder:'e.g. India' },
    { key:'message',        label:'Message',         type:'text',   required:false, placeholder:'e.g. WORK PERMIT ISRAEL' },
  ];

  const statusColors = {
    'Pending':      '#f59e0b',
    'Under Review': '#3b82f6',
    'Approved':     '#22c55e',
    'Rejected':     '#ef4444',
    'Issued':       '#8b5cf6',
  };

  return (
    <div className="fade">
      <h1 className="page-title">{creating ? 'Add New Application' : 'Edit Application'}</h1>

      {/* Breadcrumb */}
      <div className="breadcrumb" style={{ marginBottom:20 }}>
        <Link href="/admin/applications">All Applications</Link>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">
          {creating ? 'New Application' : `Edit: ${form.applicationNumber}`}
        </span>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="alert-error" style={{ marginBottom:16 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink:0, marginTop:1 }}>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            {error}
          </div>
        )}

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>

          {/* ── Left: Application Details ── */}
          <div className="form-card">
            <div className="form-card-head">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style={{ color:'#1a56db' }}>
                <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
              </svg>
              Application Details
            </div>
            <div style={{ padding:'18px 20px' }}>

              {/* Application Number */}
              <div className="fg">
                <label>Application Number <span style={{ color:'#ef4444' }}>*</span></label>
                <input className="fi" required
                  placeholder="e.g. APP-001"
                  value={form.applicationNumber}
                  onChange={(e) => setForm(p => ({ ...p, applicationNumber: e.target.value.toUpperCase() }))}
                  readOnly={!creating}
                  style={!creating ? { background:'#f9fafb', color:'#6b7280' } : {}}
                />
              </div>

              {/* All 11 screenshot fields */}
              {fields.map(({ key, label, type, required, placeholder, upper }) => (
                <div className="fg" key={key}>
                  <label>{label} {required && <span style={{ color:'#ef4444' }}>*</span>}</label>
                  <input
                    className="fi"
                    type={type}
                    required={required}
                    placeholder={placeholder || ''}
                    value={form[key]}
                    onChange={(e) => setForm(p => ({
                      ...p,
                      [key]: upper ? e.target.value.toUpperCase() : e.target.value
                    }))}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Status + Photo ── */}
          <div>
            {/* Status card */}
            <div className="form-card" style={{ marginBottom:14 }}>
              <div className="form-card-head">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style={{ color:'#1a56db' }}>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                Current Status
              </div>
              <div style={{ padding:'18px 20px' }}>
                {/* Current badge */}
                <div style={{ marginBottom:16 }}>
                  <div style={{ fontSize:12, color:'#6b7280', fontWeight:500, marginBottom:8 }}>Current Status</div>
                  <span className="badge" style={{
                    background: statusColors[form.status] || '#6b7280',
                    color: '#fff',
                    fontSize: 13, padding:'6px 18px',
                  }}>
                    {form.status}
                  </span>
                </div>

                {/* Update status */}
                <div className="fg" style={{ marginBottom:0 }}>
                  <label>Update Status</label>
                  <select className="fi" value={form.status} onChange={set('status')}>
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* Approved hint */}
                {form.status === 'Approved' && (
                  <div style={{ marginTop:10, padding:'8px 12px', background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:7, fontSize:12, color:'#15803d', fontWeight:500 }}>
                    ✓ Saving as "Approved" will generate the Visa PDF automatically.
                  </div>
                )}
              </div>
            </div>

            {/* Photo card */}
            <div className="form-card">
              <div className="form-card-head">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style={{ color:'#1a56db' }}>
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                Applicant Photo
              </div>
              <div style={{ padding:'18px 20px' }}>
                {photoPreview && (
                  <div style={{ marginBottom:12, textAlign:'center' }}>
                    <img
                      src={photoPreview}
                      alt="Applicant"
                      style={{ width:110, height:130, objectFit:'cover', border:'2px solid #e5e7eb', borderRadius:6 }}
                      onError={e => { e.target.style.display='none'; }}
                    />
                  </div>
                )}
                <label className="btn-upload" style={{ cursor:'pointer', display:'inline-flex', width:'100%', justifyContent:'center' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  {photoPreview ? 'Change Photo' : 'Upload Photo'}
                  <input type="file" accept=".jpg,.jpeg,.png" hidden onChange={handlePhoto} />
                </label>
                <p style={{ fontSize:11, color:'#9ca3af', marginTop:6, textAlign:'center' }}>
                  JPG/PNG only • Max 3MB
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form actions */}
        <div className="form-actions" style={{ marginTop:0 }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving
              ? <><div className="spin" style={{ width:14, height:14 }} /> Saving…</>
              : creating ? 'Add Application' : 'Save Changes'
            }
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => router.push('/admin/applications')}>
            Cancel
          </button>
          {/* View Details link for existing records */}
          {!creating && (
            <Link href={`/admin/applications/view/${id}`} className="btn btn-secondary" style={{ marginLeft:'auto' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              View Details
            </Link>
          )}
        </div>
      </form>
    </div>
  );
}
