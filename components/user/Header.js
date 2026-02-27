'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import logo from '../../assets/logo.jpeg';

const FlagIndia = () => (
  <svg width="24" height="16" viewBox="0 0 24 16">
    <rect width="24" height="5.33" fill="#FF9933" />
    <rect y="5.33" width="24" height="5.33" fill="#FFFFFF" />
    <rect y="10.67" width="24" height="5.33" fill="#138808" />
    <circle cx="12" cy="8" r="2" fill="none" stroke="#000080" strokeWidth="0.6" />
    <line x1="12" y1="6" x2="12" y2="10" stroke="#000080" strokeWidth="0.4" />
    <line x1="10" y1="8" x2="14" y2="8" stroke="#000080" strokeWidth="0.4" />
  </svg>
);

const FlagSA = () => (
  <svg width="24" height="16" viewBox="0 0 36 24">
    <rect width="36" height="24" fill="#007A4D" />
    <rect width="36" height="8" fill="#DE3831" />
    <rect y="16" width="36" height="8" fill="#002395" />
    <rect y="8" width="36" height="8" fill="#FFFFFF" />
    <polygon points="0,0 0,24 15,12" fill="#FFB612" />
    <polygon points="0,1.5 0,22.5 12.5,12" fill="#000000" />
    <polygon points="0,4 0,20 9,12" fill="#007A4D" />
  </svg>
);

export default function Header({ activePage }) {
  const pathname = usePathname();
  const [indiaTime, setIndiaTime] = useState('');
  const [saTime, setSaTime] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const fmtT = (tz) =>
        now.toLocaleString('en-GB', {
          timeZone: tz, weekday: 'short', day: '2-digit', month: 'short',
          year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
        });
      setIndiaTime(fmtT('Asia/Kolkata'));
      setSaTime(fmtT('Africa/Johannesburg'));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const isTrack = pathname?.includes('/track-form') || pathname?.includes('/result');

  const navLinks = [
    { href: '/home', label: 'Home', className: pathname === '/home' || pathname === '/' ? 'active' : '' },
    { href: '/unavailable', label: 'Important Information', className: '' },
    { href: '/track-application', label: 'Track your Application', className: `nav-track${isTrack ? ' active' : ''}` },
    { href: '/unavailable', label: 'IVP Centers', className: '' },
    { href: '/unavailable', label: 'Feedback / Complaint', className: '' },
    { href: '/unavailable', label: 'Contact Us', className: '' },
  ];

  return (
    <>
      <style>{`
        /* ── Hamburger ── */
        .pub-nav-hamburger {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0 18px;
          margin-left: auto;
          height: 100%;
          min-height: 48px;
          flex-direction: column;
          gap: 5px;
          align-items: center;
          justify-content: center;
        }
        .pub-nav-hamburger span {
          display: block;
          width: 22px;
          height: 2px;
          background: #fff;
          border-radius: 2px;
          transition: all 0.25s ease;
          transform-origin: center;
        }
        .pub-nav-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .pub-nav-hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .pub-nav-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        /* ── Mobile dropdown — sits BELOW the nav bar in normal flow ── */
        .pub-nav-mobile-menu {
          display: none;
          flex-direction: column;
          background: #1a4a8a;
          border-top: 2px solid rgba(255,255,255,0.2);
          box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        }
        .pub-nav-mobile-menu.open { display: flex; }
        .pub-nav-mobile-menu a {
          color: #fff;
          text-decoration: none;
          padding: 15px 20px;
          font-size: 14px;
          font-weight: 500;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          transition: background 0.15s;
          display: block;
        }
        .pub-nav-mobile-menu a:last-child { border-bottom: none; }
        .pub-nav-mobile-menu a:hover,
        .pub-nav-mobile-menu a:active { background: rgba(255,255,255,0.12); }
        .pub-nav-mobile-menu a.active { background: rgba(255,255,255,0.2); font-weight: 700; }
        .pub-nav-mobile-menu a.nav-track { background: #e53935; font-weight: 700; }
        .pub-nav-mobile-menu a.nav-track:hover { background: #c62828; }

        /* ── Responsive ── */
        @media (max-width: 767px) {
          .pub-nav > a { display: none !important; }
          .pub-nav-hamburger { display: flex; }
          .pub-top { flex-wrap: wrap; gap: 8px; padding: 10px 14px; min-height: auto; }
          .pub-timer { min-width: unset; font-size: 11px; }
          .pub-timer-row { font-size: 11px; gap: 5px; }
        }

        @media (min-width: 768px) {
          .pub-nav-hamburger { display: none !important; }
          .pub-nav-mobile-menu { display: none !important; }
        }
      `}</style>

      {/* TOP HEADER */}
      <div className="pub-top">
        <div className="pub-logo">
          <Image src={logo} alt="Company Logo" width={180} height={60} priority />
        </div>
        <div className="pub-timer">
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

      {/* DESKTOP NAVBAR */}
      <nav className="pub-nav">
        {navLinks.map((l) => (
          <Link key={l.href + l.label} href={l.href} className={l.className}>{l.label}</Link>
        ))}

        {/* Hamburger (mobile) */}
        <button
          className={`pub-nav-hamburger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* MOBILE MENU — outside nav, in normal document flow */}
      <div className={`pub-nav-mobile-menu${menuOpen ? ' open' : ''}`}>
        {navLinks.map((l) => (
          <Link key={l.href + l.label} href={l.href} className={l.className}>{l.label}</Link>
        ))}
      </div>
    </>
  );
}