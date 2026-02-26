'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { candidateAPI } from '../../../../../lib/api';
import { getUser } from '../../../../../lib/auth';
import toast from 'react-hot-toast';

const fmt = (d) => {
  if (!d) return '—';
  const dt = new Date(d);
  return `${String(dt.getDate()).padStart(2,'0')}/${String(dt.getMonth()+1).padStart(2,'0')}/${dt.getFullYear()}`;
};

const STATUS_COLORS = {
  'Pending':      { bg:'#fef3c7', color:'#92400e' },
  'Under Review': { bg:'#dbeafe', color:'#1e40af' },
  'Approved':     { bg:'#dcfce7', color:'#166534' },
  'Rejected':     { bg:'#fee2e2', color:'#991b1b' },
  'Issued':       { bg:'#f3e8ff', color:'#6b21a8' },
};

// ── Sirf PDF print karo ──
const printOnlyPdf = (name) => {
  const el = document.getElementById('visa-print-area');
  if (!el) return;
  const w = window.open('', '_blank');
  w.document.write(`<!DOCTYPE html><html><head>
    <title>Visa-${name}</title>
    <style>
      *{margin:0;padding:0;box-sizing:border-box;}
      body{font-family:Arial,Helvetica,sans-serif;font-size:11px;background:#fff;}
      @page{margin:10mm;}
      table{border-collapse:collapse;width:100%;}
      th,td{border:1px solid #888;padding:5px 8px;font-size:10px;text-align:center;}
      thead tr{background:#dde3f0;}
      a{color:#1a56db;}
    </style>
  </head><body>${el.innerHTML}</body></html>`);
  w.document.close();
  w.focus();
  setTimeout(() => { w.print(); w.close(); }, 500);
};

// ── Visa Document — exactly like screenshot ──
function VisaDocument({ d }) {
  return (
    <div id="visa-print-area" style={{
      border:'1px solid #bbb', background:'#fff',
      padding:'16px 20px', fontFamily:'Arial,Helvetica,sans-serif',
      fontSize:11, maxWidth:680, margin:'0 auto',
    }}>
      <div style={{fontSize:9,color:'#1a56db',textDecoration:'underline',marginBottom:8}}>
        https://www.piba-gov.il.info.South Africagervisacheck.com/status.php
      </div>

      {/* Header: Seal + Authority */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10,paddingBottom:8,borderBottom:'1px solid #ccc'}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{width:58,height:58,border:'2px solid #1a3060',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg width="46" height="46" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="47" fill="none" stroke="#1a3060" strokeWidth="2"/>
              <rect x="48" y="24" width="4" height="34" fill="#1a3060"/>
              <rect x="27" y="29" width="3" height="19" fill="#1a3060"/>
              <rect x="37" y="26" width="3" height="22" fill="#1a3060"/>
              <rect x="57" y="26" width="3" height="22" fill="#1a3060"/>
              <rect x="67" y="29" width="3" height="19" fill="#1a3060"/>
              <line x1="27" y1="48" x2="73" y2="48" stroke="#1a3060" strokeWidth="2.5"/>
              <line x1="29" y1="36" x2="50" y2="36" stroke="#1a3060" strokeWidth="1.8"/>
              <line x1="50" y1="36" x2="71" y2="36" stroke="#1a3060" strokeWidth="1.8"/>
              <line x1="39" y1="31" x2="50" y2="31" stroke="#1a3060" strokeWidth="1.5"/>
              <line x1="50" y1="31" x2="61" y2="31" stroke="#1a3060" strokeWidth="1.5"/>
              <rect x="37" y="58" width="26" height="4" fill="#1a3060"/>
              <rect x="43" y="53" width="14" height="5" fill="#1a3060"/>
              <text x="50" y="78" textAnchor="middle" fontSize="6.5" fill="#1a3060" fontStyle="italic">מדינת ישראל</text>
            </svg>
          </div>
          <div style={{fontSize:9,fontWeight:'bold',color:'#1a3060',lineHeight:1.6}}>
            מדינת ישראל<br/>State of South Africa
          </div>
        </div>
        <div style={{textAlign:'right',fontSize:9,lineHeight:1.7,maxWidth:240}}>
          <div style={{direction:'rtl'}}>רשות האוכלוסין וההגירה</div>
          Population &amp; Immigration Authority<br/>
          <div style={{direction:'rtl'}}>שאל להנגי מינניו בירו</div>
          Foreign Worker Administration Director<br/><br/>
          <strong>Visa Issue Date: {fmt(d.visaIssueDate)}</strong>
        </div>
      </div>

      <div style={{textAlign:'right',direction:'rtl',fontSize:9,color:'#333',marginBottom:4}}>
        מסמך מספר : 25CC252208
      </div>

      {/* Dates bar */}
      <div style={{display:'flex',justifyContent:'space-between',border:'1.5px solid #1a3060',borderRadius:2,padding:'5px 14px',margin:'6px 0',background:'#f4f6fb'}}>
        <span style={{fontSize:10,fontWeight:'bold',color:'#1a3060'}}>Visa Issue Date:-{fmt(d.visaIssueDate)}</span>
        <span style={{fontSize:10,fontWeight:'bold',color:'#1a3060'}}>Expiry Date:-{fmt(d.visaExpiryDate)}</span>
      </div>

      {/* Visa number */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:5}}>
        <div>
          <span style={{fontSize:12,fontWeight:'bold'}}>Visa No </span>
          <span style={{fontSize:14,fontWeight:'bold',color:'#c00000',letterSpacing:1}}>{d.visaNumber || 'PENDING'}</span>
        </div>
        <div style={{border:'1px solid #888',padding:'3px 8px',fontFamily:'monospace',fontSize:8,letterSpacing:2}}>
          {d.visaNumber || '—'}
        </div>
      </div>

      <div style={{color:'#c00000',fontSize:10,fontWeight:'bold',textAlign:'center',margin:'5px 0',lineHeight:1.5}}>
        This document provides an entry permit to the State of South Africa and<br/>
        Replacing an entry visa
      </div>

      <div style={{fontSize:10,marginBottom:4}}>This is to confirm that</div>
      <div style={{fontSize:13,fontWeight:'bold',color:'#c00000',textAlign:'center',marginBottom:8,letterSpacing:1}}>
        {(d.visaType || 'WORK VISA South Africa').toUpperCase()}
      </div>

      {/* Table */}
      <table style={{width:'100%',borderCollapse:'collapse',marginBottom:0}}>
        <thead>
          <tr style={{background:'#dde3f0'}}>
            {['Name','Passport No#','Profession','Company Name'].map(h => (
              <th key={h} style={{border:'1px solid #888',padding:'5px 8px',fontSize:10,textAlign:'center'}}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {[d.fullName, d.passportNumber, d.profession||'—', d.companyName||'—'].map((v,i) => (
              <td key={i} style={{border:'1px solid #888',padding:'5px 8px',fontSize:10,textAlign:'center'}}>{v}</td>
            ))}
          </tr>
        </tbody>
      </table>

      <div style={{border:'1px solid #888',borderTop:'none',padding:'4px 8px',fontSize:10,textAlign:'right',direction:'rtl',background:'#f9f9f9',marginBottom:8}}>
        תרבת תצוגק פורטשא לארשי &nbsp;&nbsp;&nbsp; א. הדילך: &quot;{fmt(d.dateOfBirth)}&quot;
      </div>

      <div style={{fontSize:9.5,lineHeight:1.6,marginBottom:5}}>
        .לארשי תנידמל ודיי ,ויתוסיטב/ויתוסיטל ,ביניגמ יחמשמ יתשמ ויחמשמ ידכ<br/>
        May board his/her their flights, on his/her their way to the State of South Africa.
      </div>
      <div style={{fontSize:9.5,lineHeight:1.6,marginBottom:5}}>
        This permit letter is based on the statement of the above-mentioned passenger/s that he/she/they is/are aware of his/her/their obligations in South Africa:
      </div>
      <div style={{fontSize:9.5,lineHeight:1.6,marginBottom:5,textAlign:'right',direction:'rtl',background:'#f9f9f9',borderRight:'3px solid #1a3060',paddingRight:6}}>
        בוט אוה הפנסה דעקמ 90 למשמ הפח תה הן הדיוה הנינבב<br/>
        דלבל הפח הכמ הנינקה עברו
      </div>
      <div style={{color:'#c00000',fontWeight:'bold',fontSize:9.5,textAlign:'center',margin:'6px 0',lineHeight:1.5}}>
        This permit letter is valid for 90 days from the date of issue and is<br/>
        good For one entry only
      </div>
      <div style={{fontSize:9.5,lineHeight:1.6,marginBottom:8,textAlign:'right',direction:'rtl',background:'#f9f9f9',borderRight:'3px solid #1a3060',paddingRight:6}}>
        קסומסתכביתיה<br/>
        שדירחכב דיבות תא קיות אב ,דניצ יחמשמ יתשמ ויחמשמ אמיחמ<br/>
        וביישעלו אי יבוסיס שדשמ הקשה מסטוב (1) דיש הקשמ פרושיוק
      </div>

      {/* Signature */}
      <div style={{display:'flex',alignItems:'flex-end',gap:16,margin:'10px 0 8px'}}>
        <div>
          <div style={{fontStyle:'italic',fontSize:14,color:'#1a3060',marginBottom:2,fontFamily:'Georgia,serif'}}>David Daniel</div>
          <div style={{fontSize:9,lineHeight:1.5}}>
            <strong>David Daniel</strong><br/>Foreign Workers Administration Director
          </div>
        </div>
        <div style={{width:52,height:52,border:'2px solid #1a3060',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:7,fontWeight:'bold',color:'#1a3060',textAlign:'center',padding:4,lineHeight:1.4}}>
          STATE<br/>OF<br/>South Africa<br/>✡
        </div>
      </div>

      <div style={{borderTop:'1px solid #ccc',paddingTop:5,fontSize:8.5,color:'#333',lineHeight:1.6}}>
        .תולאתגה ,הינגרה ,תוינדיה ,הרוצה B1/ב-A1<br/>
        B1/Work Visas are granted to foreign workers in the industry, welfare, construction, and agriculture sectors.<br/>
        <span style={{color:'#1a56db'}}>https://www.piba-gov.il.info.South Africagervisacheck.com/status.php</span>
      </div>
    </div>
  );
}

export default function ViewDetailsPage() {
  const { id }  = useParams();
  const router  = useRouter();
  const user    = getUser();

  const [data,      setData]      = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [newStatus, setNewStatus] = useState('');
  const [updating,  setUpdating]  = useState(false);

  const canEdit = user?.role === 'admin' || user?.role === 'superadmin' || user?.permissions?.canEdit;

  useEffect(() => { load(); }, [id]);

  const load = async () => {
    setLoading(true);
    try {
      const r = await candidateAPI.get(id);
      if (r?.success) { setData(r.data); setNewStatus(r.data.status); }
      else { toast.error('Record not found'); router.push('/admin/applications'); }
    } catch { toast.error('Server error'); }
    finally { setLoading(false); }
  };

  const handleStatusUpdate = async () => {
    if (newStatus === data.status) { toast('Status same hai'); return; }
    setUpdating(true);
    try {
      const fd = new FormData();
      fd.append('status', newStatus);
      const r = await candidateAPI.update(id, fd);
      if (r?.success) { toast.success(`Status: "${newStatus}"`); setData(r.data); setNewStatus(r.data.status); }
      else toast.error(r?.message || 'Failed');
    } catch { toast.error('Error'); }
    finally { setUpdating(false); }
  };

  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'50vh',flexDirection:'column',gap:14}}>
      <div className="spin spin-dark" style={{width:28,height:28,border:'3px solid #e2e8f0',borderTopColor:'#1a56db'}}/>
      <p style={{color:'#6b7280',fontSize:14}}>Loading…</p>
    </div>
  );

  if (!data) return null;

  const sc = STATUS_COLORS[data.status] || { bg:'#f3f4f6', color:'#374151' };
  const isApproved = data.status === 'Approved' || data.status === 'Issued';

  const rows = [
    { label:'Passport No',      value: data.passportNumber || '—' },
    { label:'Visa No',          value: data.visaNumber     || '—' },
    { label:'Name',             value: data.fullName       || '—' },
    { label:'Date of birth',    value: fmt(data.dateOfBirth)      },
    { label:'Profession',       value: data.profession     || '—' },
    { label:'Company Name',     value: data.companyName    || '—' },
    { label:'Visa Issue Date',  value: fmt(data.visaIssueDate)    },
    { label:'Visa Expiry Date', value: fmt(data.visaExpiryDate)   },
    { label:'Visa Type',        value: data.visaType       || '—' },
    { label:'Country',          value: data.country        || '—' },
    { label:'Status',           value: data.status, isStatus:true },
    { label:'Message',          value: data.message        || '—' },
  ];

  return (
    <div className="fade">

      {/* ── Breadcrumb ── */}
      <div className="breadcrumb" style={{marginBottom:16}}>
        <Link href="/admin/applications">All Applications</Link>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">View: {data.applicationNumber}</span>
      </div>

      {/* ── Top action bar ── */}
      <div style={{display:'flex',gap:10,flexWrap:'wrap',alignItems:'center',marginBottom:20}}>
        {canEdit && (
          <div style={{display:'flex',alignItems:'center',gap:8,background:'#fff',border:'1px solid #e5e7eb',borderRadius:8,padding:'10px 14px'}}>
            <span style={{fontSize:13,fontWeight:600,color:'#374151',whiteSpace:'nowrap'}}>Update Status:</span>
            <select className="sel" value={newStatus} onChange={e=>setNewStatus(e.target.value)} style={{minWidth:140}}>
              {['Pending','Under Review','Approved','Rejected','Issued'].map(s=><option key={s}>{s}</option>)}
            </select>
            <button className="btn btn-primary" onClick={handleStatusUpdate} disabled={updating||newStatus===data.status}>
              {updating?<><div className="spin" style={{width:13,height:13}}/> Saving…</>:'Update'}
            </button>
          </div>
        )}
        <div style={{display:'flex',gap:8,marginLeft:'auto'}}>
          {canEdit && (
            <Link href={`/admin/applications/edit/${id}`} className="btn btn-secondary">
              ✏️ Edit
            </Link>
          )}
          <Link href="/admin/applications" className="btn btn-secondary">← Back</Link>
        </div>
      </div>

      {/* ════════════════════════════════════════
          CENTRED CARD — Details + PDF + Print
      ════════════════════════════════════════ */}
      <div style={{maxWidth:780, margin:'0 auto'}}>

        {/* Congrats banner */}
        {isApproved && (
          <div style={{background:'linear-gradient(90deg,#166534 0%,#1a56db 55%)',color:'#fff',padding:'12px 20px',borderRadius:'6px 6px 0 0',fontSize:14,fontWeight:500,textAlign:'center'}}>
            Congratulations. Dear <strong>{data.fullName}</strong>, your visa is ready.{' '}
            <span style={{color:'#90caf9',textDecoration:'underline',cursor:'pointer',fontWeight:700}} onClick={()=>printOnlyPdf(data.applicationNumber)}>
              Print it here
            </span>
          </div>
        )}

        {/* Authority gradient bar */}
        <div style={{
          background:'linear-gradient(90deg,#1e3a8a 0%,#d97706 100%)',
          color:'#fff',padding:'9px 20px',textAlign:'center',fontSize:13,fontWeight:700,
          borderRadius: isApproved ? 0 : '6px 6px 0 0',
        }}>
          South Africa Police Visa Immigration Services
        </div>

        {/* ── Details table — centred ── */}
        <div style={{background:'#fff',border:'1px solid #e5e7eb',borderTop:'none',overflow:'hidden',marginBottom:0}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <tbody>
              {rows.map(({label,value,isStatus},i)=>(
                <tr key={label} style={{background:i%2===0?'#f9fafb':'#fff'}}>
                  <td style={{padding:'13px 28px',width:'45%',fontWeight:500,fontSize:13.5,color:'#374151',borderBottom:i<rows.length-1?'1px solid #f0f0f0':'none'}}>
                    {label}
                  </td>
                  <td style={{padding:'13px 28px',fontSize:13.5,color:'#111',borderBottom:i<rows.length-1?'1px solid #f0f0f0':'none'}}>
                    {isStatus
                      ? <span style={{background:sc.bg,color:sc.color,padding:'3px 12px',borderRadius:20,fontSize:12.5,fontWeight:700}}>{value}</span>
                      : value
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── FULL PDF DOCUMENT — shown below details when Approved ── */}
        {isApproved ? (
          <div style={{background:'#fff',border:'1px solid #e5e7eb',borderTop:'none',borderRadius:'0 0 8px 8px',padding:'24px 20px'}}>
            <div style={{fontSize:15,fontWeight:700,color:'#0f172a',marginBottom:16,borderBottom:'2px solid #1a56db',paddingBottom:8,maxWidth:680,margin:'0 auto 16px'}}>
              Visa Document
            </div>

            {/* The actual visa doc */}
            <VisaDocument d={data} />

            {/* ── PRINT BUTTON — centred ── */}
            <div style={{textAlign:'center',marginTop:24,paddingBottom:4}}>
              <button
                onClick={()=>printOnlyPdf(data.applicationNumber)}
                style={{
                  background:'#1565c0',color:'#fff',border:'none',
                  padding:'14px 70px',fontSize:15,fontWeight:700,
                  cursor:'pointer',borderRadius:4,letterSpacing:'1px',
                }}
              >
                PRINT RESULT
              </button>
            </div>
          </div>
        ) : (
          <div style={{background:'#fff',border:'1px solid #e5e7eb',borderTop:'none',borderRadius:'0 0 8px 8px',padding:'20px',textAlign:'center',color:'#9ca3af',fontSize:13}}>
            PDF will appear here once status is set to <strong>Approved</strong>.
          </div>
        )}
      </div>

      {/* ── Status history ── */}
      {data.statusHistory?.length>0 && (
        <div className="card" style={{maxWidth:780,margin:'20px auto 0'}}>
          <div className="card-head">Status History</div>
          <table>
            <thead><tr><th>Status</th><th>Changed By</th><th>Date</th></tr></thead>
            <tbody>
              {[...data.statusHistory].reverse().map((h,i)=>{
                const hc=STATUS_COLORS[h.status]||{bg:'#f3f4f6',color:'#374151'};
                return (
                  <tr key={i}>
                    <td><span style={{background:hc.bg,color:hc.color,padding:'3px 10px',borderRadius:20,fontSize:11.5,fontWeight:700}}>{h.status}</span></td>
                    <td style={{color:'#6b7280',fontSize:13}}>{h.changedBy||'Admin'}</td>
                    <td style={{color:'#6b7280',fontSize:12.5}}>{h.createdAt?new Date(h.createdAt).toLocaleString('en-GB'):'—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
