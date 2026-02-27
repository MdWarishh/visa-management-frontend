'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { candidateAPI } from '../../../../../lib/api';
import { getUser } from '../../../../../lib/auth';
import toast from 'react-hot-toast';

const STATUSES  = ['Pending','Under Review','Approved','Rejected','Issued'];
const isNew = (id) => id === 'new';
const toDateInput = (d) => { if (!d) return ''; return new Date(d).toISOString().slice(0, 10); };

export default function EditPage() {
  const { id }   = useParams();
  const router   = useRouter();
  const creating = isNew(id);
  const user     = getUser();

  const [form, setForm] = useState({
    identifierType: 'passport',
    passportNumber:    '',
    controlNumber:     '',
    visaNumber:        '',
    fullName:          '',
    dateOfBirth:       '',
    profession:        '',
    companyName:       '',
    visaIssueDate:     '',
    visaExpiryDate:    '',
    visaType:          '',
    country:           '',
    status:            'Pending',
    message:           '',
    applicationNumber: '',
    applicationDate:   '',
  });

  const [photoFile,    setPhotoFile]    = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [visaDocFile,  setVisaDocFile]  = useState(null);
  const [visaDocName,  setVisaDocName]  = useState('');
  const [existingVisaDoc, setExistingVisaDoc] = useState(null); // {type, name}

  const [loading, setLoading] = useState(!creating);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');

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
            identifierType:    d.identifierType    || 'passport',
            passportNumber:    d.passportNumber    || '',
            controlNumber:     d.controlNumber     || '',
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
          if (d.visaDocument) {
            setExistingVisaDoc({ type: d.visaDocumentType, name: d.visaDocumentName || 'visa-doc' });
          }
        } else { toast.error('Record not found'); router.push('/admin/applications'); }
      } catch { toast.error('Server error'); }
      finally  { setLoading(false); }
    })();
  }, [id, creating, router]);

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handlePhoto = (e) => {
    const file = e.target.files[0]; if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Photo max 5MB'); return; }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleVisaDoc = (e) => {
    const file = e.target.files[0]; if (!file) return;
    if (file.size > 10 * 1024 * 1024) { toast.error('Document max 10MB'); return; }
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['jpg','jpeg','png','pdf'].includes(ext)) { toast.error('Only JPG, PNG or PDF allowed'); return; }
    setVisaDocFile(file);
    setVisaDocName(file.name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    const idVal = form.identifierType === 'control' ? form.controlNumber : form.passportNumber;
    if (!form.fullName || !idVal || !form.dateOfBirth || !form.country || !form.applicationNumber) {
      setError('Name, ID Number, DOB, Country, Application Number — required.'); return;
    }

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => { if (v !== '' && v !== null && v !== undefined) fd.append(k, v); });
    if (photoFile) fd.append('photo', photoFile);
    if (visaDocFile) fd.append('visaDocument', visaDocFile);

    setSaving(true);
    try {
      const r = creating ? await candidateAPI.create(fd) : await candidateAPI.update(id, fd);
      if (r?.success) {
        toast.success(creating ? 'Record added!' : 'Saved!');
        router.push('/admin/applications');
      } else { setError(r?.message || 'Save failed.'); }
    } catch { setError('Server error.'); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'50vh', flexDirection:'column', gap:12 }}>
      <div className="spin spin-dark" style={{ width:28, height:28, border:'3px solid #e2e8f0', borderTopColor:'#1a56db' }} />
      <p style={{ color:'#6b7280', fontSize:14 }}>Loading…</p>
    </div>
  );

  const readOnly = !creating && !canEdit;

  return (
    <div className="fade">
      {/* Breadcrumb */}
      <div className="breadcrumb" style={{ marginBottom:18 }}>
        <Link href="/admin/applications">Applications</Link>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">{creating ? 'Add New' : `Edit: ${form.applicationNumber}`}</span>
      </div>

      {error && (
        <div className="alert-error" style={{ marginBottom:16 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink:0 }}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:18, alignItems:'start' }}>

          {/* ── LEFT: Application Details ── */}
          <div className="card">
            <div className="card-head">Application Details</div>
            <div style={{ padding:'18px 20px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px 18px' }}>

              {/* Identifier Type Toggle */}
              <div className="fg" style={{ gridColumn:'1 / -1' }}>
                <label>Identifier Type <span style={{ color:'#ef4444' }}>*</span></label>
                <div style={{ display:'flex', gap:8, marginTop:4 }}>
                  {['passport','control'].map(t => (
                    <button
                      key={t} type="button"
                      onClick={() => !readOnly && setForm(p => ({ ...p, identifierType: t }))}
                      style={{
                        padding:'8px 20px', borderRadius:6, fontSize:13, fontWeight:600, cursor: readOnly ? 'default' : 'pointer',
                        border:`2px solid ${form.identifierType === t ? '#1a56db' : '#e5e7eb'}`,
                        background: form.identifierType === t ? '#eff6ff' : '#fff',
                        color: form.identifierType === t ? '#1a56db' : '#6b7280',
                        transition:'all 0.15s',
                      }}
                    >
                      {t === 'passport' ? '🛂 Passport Number' : '🔢 Control Number'}
                    </button>
                  ))}
                </div>
              </div>

              {/* ID Number field */}
              <div className="fg" style={{ gridColumn:'1 / -1' }}>
                <label>
                  {form.identifierType === 'passport' ? 'Passport Number' : 'Control Number'}
                  <span style={{ color:'#ef4444' }}> *</span>
                </label>
                {form.identifierType === 'passport' ? (
                  <input className="fi" placeholder="e.g. A1234567" readOnly={readOnly || !creating}
                    value={form.passportNumber}
                    onChange={e => setForm(p => ({ ...p, passportNumber: e.target.value.toUpperCase() }))}
                    style={readOnly || !creating ? { background:'#f9fafb', color:'#6b7280' } : {}}
                  />
                ) : (
                  <input className="fi" placeholder="e.g. CTL-2024-001" readOnly={readOnly}
                    value={form.controlNumber}
                    onChange={e => setForm(p => ({ ...p, controlNumber: e.target.value.toUpperCase() }))}
                    style={readOnly ? { background:'#f9fafb', color:'#6b7280' } : {}}
                  />
                )}
              </div>

              <div className="fg">
                <label>Full Name <span style={{ color:'#ef4444' }}>*</span></label>
                <input className="fi" placeholder="Applicant full name" readOnly={readOnly}
                  value={form.fullName} onChange={set('fullName')} />
              </div>

              <div className="fg">
                <label>Date of Birth <span style={{ color:'#ef4444' }}>*</span></label>
                <input className="fi" type="date" readOnly={readOnly}
                  value={form.dateOfBirth} onChange={set('dateOfBirth')} />
              </div>

              <div className="fg">
                <label>Application Number <span style={{ color:'#ef4444' }}>*</span></label>
                <input className="fi" placeholder="APP-2024-001" readOnly={readOnly || !creating}
                  value={form.applicationNumber} onChange={set('applicationNumber')}
                  style={!creating ? { background:'#f9fafb', color:'#6b7280' } : {}} />
              </div>

              <div className="fg">
                <label>Application Date</label>
                <input className="fi" type="date" readOnly={readOnly}
                  value={form.applicationDate} onChange={set('applicationDate')} />
              </div>

              <div className="fg">
                <label>Visa Number</label>
                <input className="fi" placeholder="e.g. CEG307412/1217" readOnly={readOnly}
                  value={form.visaNumber} onChange={set('visaNumber')} />
              </div>

              <div className="fg">
                <label>Visa Type</label>
                <select className="sel" disabled={readOnly} value={form.visaType} onChange={set('visaType')}>
                  <option value="">— Select —</option>
                  {['Employment Visa','Work Visa','Tourist Visa','Business Visa','Student Visa','Medical Visa','Family Visa','Transit Visa'].map(v => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </div>

              <div className="fg">
                <label>Profession</label>
                <input className="fi" placeholder="e.g. Engineer" readOnly={readOnly}
                  value={form.profession} onChange={set('profession')} />
              </div>

              <div className="fg">
                <label>Company Name</label>
                <input className="fi" placeholder="Employer company" readOnly={readOnly}
                  value={form.companyName} onChange={set('companyName')} />
              </div>

              <div className="fg">
                <label>Visa Issue Date</label>
                <input className="fi" type="date" readOnly={readOnly}
                  value={form.visaIssueDate} onChange={set('visaIssueDate')} />
              </div>

              <div className="fg">
                <label>Visa Expiry Date</label>
                <input className="fi" type="date" readOnly={readOnly}
                  value={form.visaExpiryDate} onChange={set('visaExpiryDate')} />
              </div>

              <div className="fg">
                <label>Country <span style={{ color:'#ef4444' }}>*</span></label>
                <input className="fi" placeholder="e.g. India" readOnly={readOnly}
                  value={form.country} onChange={set('country')} />
              </div>

              <div className="fg">
                <label>Message / Note</label>
                <input className="fi" placeholder="e.g. Work Permit Israel" readOnly={readOnly}
                  value={form.message} onChange={set('message')} />
              </div>
            </div>
          </div>

          {/* ── RIGHT: Status + Photo + Visa Document ── */}
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>

            {/* Status */}
            <div className="card">
              <div className="card-head">Status</div>
              <div style={{ padding:'14px 16px' }}>
                <select className="sel" style={{ width:'100%' }} disabled={readOnly}
                  value={form.status} onChange={set('status')}>
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
                {form.status === 'Approved' && (
                  <div style={{ marginTop:8, fontSize:11.5, color:'#166534', background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:6, padding:'6px 10px' }}>
                    ✅ Once uploaded, visa document will show to user
                  </div>
                )}
              </div>
            </div>

            {/* Photo */}
            {/* <div className="card">
              <div className="card-head">Applicant Photo</div>
              <div style={{ padding:'14px 16px' }}>
                {photoPreview && (
                  <div style={{ marginBottom:10, textAlign:'center' }}>
                    <img src={photoPreview} alt="Photo"
                      style={{ width:100, height:120, objectFit:'cover', borderRadius:6, border:'1px solid #e5e7eb' }} />
                  </div>
                )}
                {!readOnly && (
                  <label style={{ display:'block', cursor:'pointer' }}>
                    <div style={{ border:'2px dashed #d1d5db', borderRadius:8, padding:'12px', textAlign:'center', fontSize:12, color:'#6b7280', background:'#f9fafb' }}>
                      <div style={{ fontSize:20, marginBottom:4 }}>📷</div>
                      Click to upload photo<br/>
                      <span style={{ fontSize:10, color:'#9ca3af' }}>JPG, PNG (max 5MB)</span>
                    </div>
                    <input type="file" accept=".jpg,.jpeg,.png" onChange={handlePhoto} style={{ display:'none' }} />
                  </label>
                )}
              </div>
            </div> */}

            {/* ── Visa Document Upload — NEW ── */}
            <div className="card">
              <div className="card-head">Visa Document</div>
              <div style={{ padding:'14px 16px' }}>
                <p style={{ fontSize:12, color:'#6b7280', marginBottom:10, lineHeight:1.5 }}>
                  Upload the actual visa document (PDF or image). This will be shown to the applicant after approval.
                </p>

                {/* Existing doc indicator */}
                {existingVisaDoc && !visaDocFile && (
                  <div style={{ background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:6, padding:'8px 10px', marginBottom:10, display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ fontSize:16 }}>{existingVisaDoc.type === 'pdf' ? '📄' : '🖼️'}</span>
                    <div>
                      <div style={{ fontSize:12, fontWeight:600, color:'#166534' }}>Document uploaded</div>
                      <div style={{ fontSize:11, color:'#6b7280' }}>{existingVisaDoc.name}</div>
                    </div>
                  </div>
                )}

                {/* New file selected */}
                {visaDocFile && (
                  <div style={{ background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:6, padding:'8px 10px', marginBottom:10, display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ fontSize:16 }}>{visaDocName.endsWith('.pdf') ? '📄' : '🖼️'}</span>
                    <div>
                      <div style={{ fontSize:12, fontWeight:600, color:'#1e40af' }}>New: {visaDocName}</div>
                      <div style={{ fontSize:11, color:'#6b7280' }}>({(visaDocFile.size / 1024 / 1024).toFixed(1)}MB)</div>
                    </div>
                    <button type="button" onClick={() => { setVisaDocFile(null); setVisaDocName(''); }}
                      style={{ marginLeft:'auto', background:'none', border:'none', cursor:'pointer', color:'#9ca3af', fontSize:14 }}>✕</button>
                  </div>
                )}

                {!readOnly && (
                  <label style={{ display:'block', cursor:'pointer' }}>
                    <div style={{ border:'2px dashed #d1d5db', borderRadius:8, padding:'14px', textAlign:'center', fontSize:12, color:'#6b7280', background:'#f9fafb' }}>
                      <div style={{ fontSize:24, marginBottom:4 }}>📎</div>
                      Click to upload visa document<br/>
                      <span style={{ fontSize:10, color:'#9ca3af' }}>PDF, JPG, PNG (max 10MB)</span>
                    </div>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleVisaDoc} style={{ display:'none' }} />
                  </label>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* ── Submit ── */}
        {!readOnly && (
          <div style={{ marginTop:18, display:'flex', gap:10, justifyContent:'flex-end' }}>
            <Link href="/admin/applications" className="btn btn-secondary">Cancel</Link>
            <button type="submit" className="btn btn-primary" disabled={saving} style={{ minWidth:140, justifyContent:'center' }}>
              {saving
                ? <><div className="spin" style={{ width:14, height:14 }} /> Saving…</>
                : creating ? '+ Add Application' : '💾 Save Changes'
              }
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
