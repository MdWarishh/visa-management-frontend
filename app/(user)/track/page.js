'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '../../../components/user/Footer';
import Header from '../../../components/user/Header';

const VISA_TYPES = [
  'Please Select','Employment Visa','Work Visa','Tourist Visa','Business Visa',
  'Student Visa','Medical Visa','Family Visa','Transit Visa','Other',
];
const NATIONALITIES = [
  'Please Select','Indian','Pakistani','Bangladeshi','South African','Nigerian',
  'Kenyan','Ghanaian','Egyptian','Moroccan','Other',
];

export default function TrackPage() {
  const router  = useRouter();
  const [form,    setForm]    = useState({ passportNumber: '', dob: '', visaType: '', nationality: '' });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.passportNumber.trim()) { setError('Passport Number is required.'); return; }
    if (!form.dob)                   { setError('Date of Birth is required.'); return; }

    setLoading(true);
    try {
      const r = await fetch('/api/candidates/public/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          passportNumber: form.passportNumber.trim().toUpperCase(),
          dateOfBirth:    form.dob,
        }),
      });
      const data = await r.json();

      if (data?.success) {
        // Encode data in URL params — result page pe dikhao
        const params = new URLSearchParams({
          id:   data.data.candidateId,
          pass: form.passportNumber.trim().toUpperCase(),
          dob:  form.dob,
        });
        router.push(`/result?${params.toString()}`);
      } else {
        setError(data?.message || 'No record found. Please check your details.');
      }
    } catch {
      setError('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header/>

      <div className="track-page">
        {/* Page title */}
        <div className="track-hero">
          <h1>Track Your Application</h1>
          <p>
            Applicants who have already applied for a visa can track application using our
            visa application tracker service:
          </p>
        </div>

        <hr className="track-divider" />
        <br />

        {/* Form */}
        <div className="track-form-wrap">
          <div className="track-form-box">
            <div className="track-form-title">Check Your Visa Status</div>

            {error && (
              <div className="track-error">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#856404">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="track-field">
                <label>Passport Number *: </label>
                <input
                  type="text"
                  placeholder="Enter Passport Number"
                  value={form.passportNumber}
                  onChange={set('passportNumber')}
                  required
                />
              </div>

              <div className="track-field">
                <label>Date of (dd/mm/yyyy)*: <strong>DOB</strong></label>
                <input
                  type="date"
                  value={form.dob}
                  onChange={set('dob')}
                  required
                />
              </div>

              <div className="track-field">
                <label>Visa Type *:</label>
                <select value={form.visaType} onChange={set('visaType')}>
                  {VISA_TYPES.map(v => <option key={v} value={v === 'Please Select' ? '' : v}>{v}</option>)}
                </select>
              </div>

              <div className="track-field">
                <label>Nationality *:</label>
                <select value={form.nationality} onChange={set('nationality')}>
                  {NATIONALITIES.map(n => <option key={n} value={n === 'Please Select' ? '' : n}>{n}</option>)}
                </select>
              </div>

              <button type="submit" className="track-submit" disabled={loading}>
                {loading ? 'Searching...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>

        <hr className="track-divider" />
      </div>

      <Footer />
    </div>
  );
}
