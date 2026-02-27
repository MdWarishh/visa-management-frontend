'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '../../../components/user/Header';
import Footer from '../../../components/user/Footer';
import styles from './result.module.css';

const fmt = (d) => {
  if (!d) return '—';
  const dt = new Date(d);
  return `${String(dt.getDate()).padStart(2,'0')}/${String(dt.getMonth()+1).padStart(2,'0')}/${dt.getFullYear()}`;
};

const printOnlyDoc = (appNo) => {
  const el = document.getElementById('user-visa-doc-area');
  if (!el) { alert('No document to print.'); return; }
  const w = window.open('', '_blank');
  w.document.write(`<!DOCTYPE html><html><head>
    <title>Visa-${appNo || 'document'}</title>
    <style>
      *{margin:0;padding:0;box-sizing:border-box;}
      body{font-family:'Roboto',Arial,sans-serif;background:#fff;}
      @page{margin:8mm;}
      img{max-width:100%;height:auto;display:block;}
    </style>
  </head><body>${el.innerHTML}</body></html>`);
  w.document.close(); w.focus();
  setTimeout(() => { w.print(); w.close(); }, 600);
};

function ResultContent() {
  const params  = useSearchParams();
  const id      = params.get('id');
  const idType  = params.get('idType') || 'passport';
  const idNum   = params.get('idNum')  || params.get('pass') || '';
  const dob     = params.get('dob');

  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    if (!id) { setError('Invalid link. Please track again.'); setLoading(false); return; }
    (async () => {
      try {
        const body = { dateOfBirth: dob };
        if (idType === 'control') body.controlNumber  = idNum;
        else                       body.passportNumber = idNum;
        const r    = await fetch('/api/candidates/public/track', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
        });
        const resp = await r.json();
        if (resp?.success) setData(resp.data);
        else               setError(resp?.message || 'No record found.');
      } catch { setError('Server error.'); }
      finally  { setLoading(false); }
    })();
  }, [id, idType, idNum, dob]);

  if (loading) return (
    <div className={styles.loadingWrap}>
      <div className={styles.spinner}/>
      <p>Loading your application details...</p>
    </div>
  );

  if (error) return (
    <div className={styles.errorWrap}>
      <div className={styles.errorIcon}>❌</div>
      <p>{error}</p>
      <a href="/track-application" className={styles.backLinkBtn}>← Go Back and Try Again</a>
    </div>
  );

  if (!data) return null;

  const isApproved  = data.status === 'Approved' || data.status === 'Issued';
  const idLabel     = data.identifierType === 'control' ? 'Control Number' : 'Passport No';
  const idValue     = data.identifierType === 'control' ? (data.controlNumber || '—') : (data.passportNumber || '—');

  // Visa doc URL — verified via query params
  const visaDocUrl = data.hasVisaDocument
    ? `/api/candidates/public/visa-doc/${data.candidateId}?${
        data.identifierType === 'control'
          ? `controlNumber=${encodeURIComponent(idNum)}`
          : `passportNumber=${encodeURIComponent(idNum)}`
      }&dateOfBirth=${encodeURIComponent(dob)}`
    : null;

  const getStatusClass = (s) => {
    if (s === 'Approved' || s === 'Issued') return styles.statusApproved;
    if (s === 'Pending')      return styles.statusPending;
    if (s === 'Under Review') return styles.statusReview;
    if (s === 'Rejected')     return styles.statusRejected;
    return '';
  };

  // Show Passport No / Control No based on identifierType
  const rows = [
    { label: idLabel,           value: idValue },
    { label: 'Visa No',         value: data.visaNumber       || '—' },
    { label: 'Name',            value: data.fullName         || '—' },
    { label: 'Date of birth',   value: fmt(data.dateOfBirth)        },
    { label: 'Profession',      value: data.profession       || '—' },
    { label: 'Company Name',    value: data.companyName      || '—' },
    { label: 'Visa Issue Date', value: fmt(data.visaIssueDate)      },
    { label: 'Visa Expiry',     value: fmt(data.visaExpiryDate)     },
    { label: 'Visa Type',       value: data.visaType         || '—' },
    { label: 'Country',         value: data.country          || '—' },
    { label: 'Status',          value: data.status, isStatus: true  },
    { label: 'Message',         value: data.message          || '—' },
  ];

  return (
    <div className={styles.resultWrap}>

      {/* Congrats banner */}
      {isApproved && (
        <div className={styles.congratsBanner}>
          Congratulations. Dear <strong>{data.fullName}</strong>, your visa is ready.{' '}
          <span className={styles.printLink} onClick={() => printOnlyDoc(data.applicationNumber)}>
            Print it here
          </span>
        </div>
      )}

      {/* Authority bar */}
      <div className={`${styles.authorityBar} ${!isApproved ? styles.authorityBarRound : ''}`}>
        South Africa Visa Immigration Services
      </div>

      {/* Details table */}
      <div className={styles.tableWrap}>
        <table className={styles.detailTable}>
          <tbody>
            {rows.map(({ label, value, isStatus }, i) => (
              <tr key={label} style={{ background: i%2===0 ? '#f9fafb' : '#fff' }}>
                <td className={styles.tdLabel}>{label}</td>
                <td className={styles.tdValue}>
                  {isStatus
                    ? <span className={getStatusClass(value)}>{value}</span>
                    : value
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Visa Document — uploaded image or PDF ── */}
      {isApproved && data.hasVisaDocument && (
        <div className={styles.visaDocSection}>
          <div className={styles.visaDocTitle}>Your Visa Document</div>

          <div className={styles.visaDocFrame} id="user-visa-doc-area">
            {data.visaDocumentType === 'pdf' ? (
              /* PDF — embed full height */
              <embed
                src={visaDocUrl}
                type="application/pdf"
                className={styles.pdfEmbed}
              />
            ) : (
              /* Image — full width */
              // eslint-disable-next-line @next/next/no-img-element
              <img src={visaDocUrl} alt="Visa Document" className={styles.visaDocImg} />
            )}
          </div>

          <div className={styles.printBtnWrap}>
            <button className={styles.printBtn} onClick={() => printOnlyDoc(data.applicationNumber)}>
              PRINT RESULT
            </button>
          </div>
        </div>
      )}

      {/* Approved but no doc yet */}
      {isApproved && !data.hasVisaDocument && (
        <div className={styles.noDocBox}>
          <span>📎</span>
          <p>Visa document will be available soon. Please check back later.</p>
        </div>
      )}

      {/* Not approved */}
      {!isApproved && (
        <div className={styles.statusBox}>
          <div className={styles.statusBoxIcon}>
            {data.status === 'Rejected' ? '❌' : data.status === 'Pending' ? '⏳' : data.status === 'Under Review' ? '🔍' : '📋'}
          </div>
          <div className={styles.statusBoxTitle}>
            Application Status: <span className={getStatusClass(data.status)}>{data.status}</span>
          </div>
          {data.message && <p className={styles.statusBoxMsg}>{data.message}</p>}
          <p className={styles.statusBoxNote}>
            Your visa document will be available once the status is <strong>Approved</strong>.
          </p>
        </div>
      )}

      <div className={styles.backLinkWrap}>
        <a href="/track-application" className={styles.backLink}>← Track Another Application</a>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <div style={{ fontFamily:"'Roboto',Arial,sans-serif", minHeight:'100vh', background:'#fff' }}>
      <Header />
      <div className={styles.page}>
        <Suspense fallback={<div className={styles.loadingWrap}><p>Loading...</p></div>}>
          <ResultContent />
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}
