'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Footer from '../../../components/user/Footer';
import Header from '../../../components/user/Header';

const fmt = (d) => {
  if (!d) return '—';
  const dt = new Date(d);
  return `${String(dt.getDate()).padStart(2,'0')}/${String(dt.getMonth()+1).padStart(2,'0')}/${dt.getFullYear()}`;
};

const StatusClass = {
  'Approved':'status-approved','Issued':'status-approved',
  'Pending':'status-pending','Under Review':'status-review','Rejected':'status-rejected',
};

// ── Sirf PDF area print karo ──
const printOnlyPdf = (name) => {
  const el = document.getElementById('user-visa-print-area');
  if (!el) { alert('Visa document not found.'); return; }
  const w = window.open('', '_blank');
  w.document.write(`<!DOCTYPE html><html><head>
    <title>Visa-${name||'document'}</title>
    <style>
      *{margin:0;padding:0;box-sizing:border-box;}
      body{font-family:Arial,Helvetica,sans-serif;font-size:11px;background:#fff;color:#000;}
      @page{margin:10mm;}
      table{border-collapse:collapse;width:100%;}
      th,td{border:1px solid #888;padding:5px 8px;font-size:10px;text-align:center;}
      thead tr{background:#dde3f0;}
    </style>
  </head><body>${el.innerHTML}</body></html>`);
  w.document.close();
  w.focus();
  setTimeout(() => { w.print(); w.close(); }, 500);
};

// ── Visa Document Component ──
function VisaDocument({ d }) {
  return (
    <div id="user-visa-print-area" style={{
      border:'1px solid #bbb',background:'#fff',
      padding:'16px 20px',fontFamily:'Arial,Helvetica,sans-serif',
      fontSize:11,maxWidth:680,margin:'0 auto',
    }}>


      {/* Header */}
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

      <div style={{display:'flex',justifyContent:'space-between',border:'1.5px solid #1a3060',borderRadius:2,padding:'5px 14px',margin:'6px 0',background:'#f4f6fb'}}>
        <span style={{fontSize:10,fontWeight:'bold',color:'#1a3060'}}>Visa Issue Date:-{fmt(d.visaIssueDate)}</span>
        <span style={{fontSize:10,fontWeight:'bold',color:'#1a3060'}}>Expiry Date:-{fmt(d.visaExpiryDate)}</span>
      </div>

      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:5}}>
        <div>
          <span style={{fontSize:12,fontWeight:'bold'}}>Visa No </span>
          <span style={{fontSize:14,fontWeight:'bold',color:'#c00000',letterSpacing:1}}>{d.visaNumber||'PENDING'}</span>
        </div>
        <div style={{border:'1px solid #888',padding:'3px 8px',fontFamily:'monospace',fontSize:8,letterSpacing:2}}>
          {d.visaNumber||'—'}
        </div>
      </div>

      <div style={{color:'#c00000',fontSize:10,fontWeight:'bold',textAlign:'center',margin:'5px 0',lineHeight:1.5}}>
        This document provides an entry permit to the State of South Africa and<br/>
        Replacing an entry visa
      </div>
      <div style={{fontSize:10,marginBottom:4}}>This is to confirm that</div>
      <div style={{fontSize:13,fontWeight:'bold',color:'#c00000',textAlign:'center',marginBottom:8,letterSpacing:1}}>
        {(d.visaType||'WORK VISA South Africa').toUpperCase()}
      </div>

      <table style={{width:'100%',borderCollapse:'collapse',marginBottom:0}}>
        <thead>
          <tr style={{background:'#dde3f0'}}>
            {['Name','Passport No#','Profession','Company Name'].map(h=>(
              <th key={h} style={{border:'1px solid #888',padding:'5px 8px',fontSize:10,textAlign:'center'}}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {[d.fullName,d.passportNumber,d.profession||'—',d.companyName||'—'].map((v,i)=>(
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
        <span style={{color:'#1a56db'}}>https://www.piba-gov.il.info.southafricavisacheck.com/status</span>
      </div>
    </div>
  );
}

function ResultContent() {
  const params = useSearchParams();
  const id   = params.get('id');
  const pass = params.get('pass');
  const dob  = params.get('dob');

  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    if (!id) { setError('Invalid link. Please track again.'); setLoading(false); return; }
    (async () => {
      try {
        const r = await fetch('/api/candidates/public/track', {
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({ passportNumber:pass, dateOfBirth:dob }),
        });
        const resp = await r.json();
        if (resp?.success) setData(resp.data);
        else setError(resp?.message||'No record found.');
      } catch { setError('Server error.'); }
      finally { setLoading(false); }
    })();
  }, [id, pass, dob]);

  const isApproved = data && (data.status === 'Approved' || data.status === 'Issued');

  const rows = data ? [
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
  ] : [];

  if (loading) return (
    <div style={{textAlign:'center',padding:'60px',color:'#555',fontSize:15}}>
      <div style={{marginBottom:14,fontSize:28}}>⏳</div>
      Loading your application details...
    </div>
  );

  if (error) return (
    <div style={{textAlign:'center',padding:'60px',color:'#c00',fontSize:14}}>
      <div style={{marginBottom:14,fontSize:32}}>❌</div>
      <strong>{error}</strong><br/><br/>
      <a href="/track" style={{color:'#1a4a8a',fontWeight:700}}>← Go Back and Try Again</a>
    </div>
  );

  return (
    <div className="result-wrap">

      {/* ── Congrats banner ── */}
      {isApproved && (
        <div className="result-congrats">
          Congratulations. Dear <strong>{data.fullName}</strong>, your visa is ready. Print it from{' '}
          <span className="track-link" onClick={()=>printOnlyPdf(data.applicationNumber)}>Track Visa</span>{' '}link.
        </div>
      )}

      {/* ── Authority bar ── */}
      <div className="result-auth-bar">
        South African Police Visa Immigration Services
      </div>

      {/* ── Details table — centred, equal cols ── */}
      <div className="result-table-wrap">
        <table className="result-table">
          <tbody>
            {rows.map(({label,value,isStatus},i)=>(
              <tr key={label}>
                <td className="td-label" style={{width:'45%'}}>{label}</td>
                <td className={`td-value${isStatus?' bold':''}`}>
                  {isStatus
                    ? <span className={StatusClass[value]||''} style={{fontWeight:700}}>{value}</span>
                    : value
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Full PDF shown below details (approved only) ── */}
      {isApproved && (
        <div className="pdf-preview-section">
          <div className="pdf-preview-title">Your Visa Document</div>
          <VisaDocument d={data} />

          {/* ── PRINT BUTTON — centred ── */}
          <div className="print-btn-wrap">
            <button className="print-btn" onClick={()=>printOnlyPdf(data.applicationNumber)}>
              PRINT RESULT
            </button>
          </div>
        </div>
      )}

      {/* ── Not approved ── */}
      {!isApproved && (
        <div className="status-only-box">
          <div className="status-icon">
            {data.status==='Rejected'?'❌':data.status==='Pending'?'⏳':data.status==='Under Review'?'🔍':'📋'}
          </div>
          <p style={{fontSize:15,fontWeight:700,marginBottom:8}}>
            Application Status: <span className={StatusClass[data.status]}>{data.status}</span>
          </p>
          {data.message && <p style={{fontSize:13,color:'#666',marginTop:6}}>{data.message}</p>}
          <p style={{fontSize:13,color:'#888',marginTop:14}}>
            Your visa PDF will be available once the status is <strong>Approved</strong>.
          </p>
        </div>
      )}

      <div style={{textAlign:'center',marginTop:20,paddingBottom:10}}>
        <a href="/track" style={{color:'#1a4a8a',textDecoration:'none',fontWeight:700,fontSize:14,borderBottom:'2px solid #1a4a8a',paddingBottom:2}}>
          ← Track Another Application
        </a>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <div>
      <Header />
      <div className="result-page">
        <Suspense fallback={<div style={{textAlign:'center',padding:'60px',color:'#555'}}>Loading...</div>}>
          <ResultContent />
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}
