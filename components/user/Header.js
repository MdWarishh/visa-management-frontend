'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// India Flag SVG
const FlagIndia = () => (
  <svg width="24" height="16" viewBox="0 0 24 16">
    <rect width="24" height="5.33" fill="#FF9933"/>
    <rect y="5.33" width="24" height="5.33" fill="#FFFFFF"/>
    <rect y="10.67" width="24" height="5.33" fill="#138808"/>
    <circle cx="12" cy="8" r="2" fill="none" stroke="#000080" strokeWidth="0.6"/>
    <line x1="12" y1="6" x2="12" y2="10" stroke="#000080" strokeWidth="0.4"/>
    <line x1="10" y1="8" x2="14" y2="8" stroke="#000080" strokeWidth="0.4"/>
  </svg>
);

// South Africa Flag SVG
const FlagSA = () => (
  <svg width="24" height="16" viewBox="0 0 36 24">
    <rect width="36" height="24" fill="#007A4D"/>
    <rect width="36" height="8" fill="#DE3831"/>
    <rect y="16" width="36" height="8" fill="#002395"/>
    <rect y="8" width="36" height="8" fill="#FFFFFF"/>
    <polygon points="0,0 0,24 15,12" fill="#FFB612"/>
    <polygon points="0,1.5 0,22.5 12.5,12" fill="#000000"/>
    <polygon points="0,4 0,20 9,12" fill="#007A4D"/>
  </svg>
);

export default function Header({ activePage }) {
  const pathname = usePathname();
  const [indiaTime, setIndiaTime] = useState('');
  const [saTime,    setSaTime]    = useState('');

  useEffect(() => {
    const tick = () => {
      const now  = new Date();
      const fmtT = (tz) => {
        return now.toLocaleString('en-GB', {
          timeZone: tz, weekday:'short', day:'2-digit', month:'short',
          year:'numeric', hour:'2-digit', minute:'2-digit', second:'2-digit', hour12: false,
        });
      };
      setIndiaTime(fmtT('Asia/Kolkata'));
      setSaTime(fmtT('Africa/Johannesburg'));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const isTrack = pathname?.includes('/track') || pathname?.includes('/result');

  return (
    <>
      {/* ─── TOP HEADER ─── */}
      <div className="pub-top">
        {/* Logo */}
        <div className="pub-logo">LOGO</div>

        {/* Center - red highlight marker (from screenshot) */}
        {/* <div className="pub-top-center">
          <div style={{ fontSize: 11, color: '#555', lineHeight: 1.5, marginBottom: 4 }}>
            This Red Background is<br />fixed Red Highlight Color
          </div>
          <div className="pub-top-arrow">
            <div className="pub-top-arrow-line" />
            <svg width="14" height="10" viewBox="0 0 14 10" style={{ marginTop: -1 }}>
              <path d="M7 10 L0 0 L14 0 Z" fill="#000"/>
            </svg>
          </div>
        </div> */}

        {/* Real Timer */}
        <div className="pub-timer">
          <div className="pub-timer-title">REAL TIMER</div>
          <div className="pub-timer-row">
            <span>{indiaTime} IST</span>
            <FlagIndia />
            <span className="country-name">India</span>
          </div>
          <div className="pub-timer-row">
            <span>{saTime} SAST</span>
            <FlagSA />
            <span className="country-name">South Africa</span>
          </div>
        </div>
      </div>

      {/* ─── NAVBAR ─── */}
      <nav className="pub-nav">
        <Link href="/home" className={pathname === '/home' || pathname === '/' ? 'active' : ''}>Home</Link>
        <Link href="/unavailable">Important Information</Link>
        <Link href="/track" className={`nav-track${isTrack ? ' active' : ''}`}>Track your Application</Link>
        <Link href="/unavailable">IVP Centers</Link>
        <Link href="/unavailable">Feedback / Complaint</Link>
        <Link href="/unavailable">Contact Us</Link>
      </nav>
    </>
  );
}
