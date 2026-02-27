export default function Footer() {
  const offices = [
    {
      city: "New Delhi",
      phone: "011-41576142",
      email: "delhi@southafricavisa.com",
    },
    {
      city: "Mumbai",
      phone: "022-49703927",
      email: "mumbai@southafricavisa.com",
    },
    {
      city: "Chennai",
      phone: "080-41251257",
      email: "chennai@southafricavisa.com",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --footer-bg: #1a1d20;
          --footer-surface: #22262b;
          --footer-border: #2e3338;
          --footer-accent: #c0392b;
          --footer-accent-soft: rgba(192,57,43,0.12);
          --footer-gold: #c9a84c;
          --text-primary: #f0ede8;
          --text-secondary: #8c9099;
          --text-muted: #555c66;
        }

        .pf-root {
          font-family: 'DM Sans', sans-serif;
          background: var(--footer-bg);
          color: var(--text-primary);
          padding: 0;
          margin-top: 0;
          position: relative;
          overflow: hidden;
        }

        /* Subtle texture */
        .pf-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(192,57,43,0.07) 0%, transparent 60%);
          pointer-events: none;
        }

        /* ── CONTACT SECTION ── */
        .pf-contact {
          padding: 48px 48px 0;
          position: relative;
        }

        .pf-contact-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 36px;
        }

        .pf-contact-header-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, var(--footer-border), transparent);
        }

        .pf-contact-header-label {
          font-family: 'Cormorant Garamond', serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--text-secondary);
        }

        .pf-contact-header-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--footer-accent);
          flex-shrink: 0;
        }

        .pf-offices-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
          border: 1px solid var(--footer-border);
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 0;
        }

        .pf-office-card {
          background: var(--footer-surface);
          padding: 28px 30px;
          position: relative;
          transition: background 0.25s;
        }

        .pf-office-card:hover {
          background: #262b30;
        }

        .pf-office-card + .pf-office-card {
          border-left: 1px solid var(--footer-border);
        }

        .pf-office-city {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 16px;
          letter-spacing: 0.02em;
        }

        .pf-office-city::after {
          content: '';
          display: block;
          width: 24px;
          height: 2px;
          background: var(--footer-accent);
          margin-top: 8px;
        }

        .pf-office-enquiry {
          font-size: 12px;
          color: var(--text-secondary);
          line-height: 1.7;
          margin-bottom: 16px;
        }

        .pf-office-enquiry strong {
          color: var(--text-primary);
          font-weight: 500;
        }

        .pf-office-phone {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: var(--footer-gold);
          font-weight: 500;
          letter-spacing: 0.03em;
          margin-bottom: 4px;
        }

        .pf-office-phone svg {
          opacity: 0.7;
        }

        .pf-email-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 14px;
          background: var(--footer-accent);
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 7px;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: none;
          padding: 8px 16px;
          border: none;
          cursor: default;
          text-decoration: none;
          user-select: text;
        }

        .pf-email-btn svg { opacity: 0.85; }

        /* ── DIVIDER ── */
        .pf-divider {
          margin: 0 48px;
          border: none;
          border-top: 1px solid var(--footer-border);
        }

        /* ── INFO GRID ── */
        .pf-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          margin: 0 48px;
        }

        .pf-info-block {
          padding: 32px 0 32px 0;
        }

        .pf-info-block + .pf-info-block {
          padding-left: 40px;
          border-left: 1px solid var(--footer-border);
        }

        .pf-info-block-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 15px;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .pf-info-block-title::before {
          content: '';
          width: 16px;
          height: 2px;
          background: var(--footer-accent);
          flex-shrink: 0;
        }

        .pf-info-block p {
          font-size: 12.5px;
          color: var(--text-secondary);
          line-height: 1.85;
          margin: 0;
        }

        .pf-quote-block {
          background: var(--footer-surface);
          border-left: 3px solid var(--footer-accent);
          padding: 20px 24px;
          margin: 0;
          position: relative;
        }

        .pf-quote-mark {
          font-family: 'Cormorant Garamond', serif;
          font-size: 56px;
          color: var(--footer-accent);
          opacity: 0.25;
          line-height: 0.8;
          display: block;
          margin-bottom: 8px;
          user-select: none;
        }

        .pf-quote-block p {
          font-size: 12.5px;
          color: var(--text-secondary);
          line-height: 1.85;
          margin: 0;
          font-style: italic;
        }

        /* ── BOTTOM BAR ── */
        .pf-bottom {
          margin: 0 48px;
          border-top: 1px solid var(--footer-border);
          padding: 20px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }

        .pf-copyright {
          font-size: 11.5px;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }

        .pf-bottom-links {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .pf-bottom-links a {
          font-size: 11.5px;
          color: var(--text-muted);
          text-decoration: none;
          letter-spacing: 0.04em;
          padding: 4px 10px;
          border: 1px solid transparent;
          transition: color 0.2s, border-color 0.2s;
        }

        .pf-bottom-links a:hover {
          color: var(--text-primary);
          border-color: var(--footer-border);
        }

        .pf-bottom-links .sep {
          color: var(--text-muted);
          font-size: 11px;
          display: flex;
          align-items: center;
        }

        /* ── FLAG BADGE ── */
        .pf-flag-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11.5px;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }

        .pf-flag {
          display: flex;
          height: 10px;
          width: 20px;
          overflow: hidden;
          border-radius: 1px;
          gap: 0;
        }

        .pf-flag span {
          flex: 1;
        }

        @media (max-width: 1024px) {
          .pf-contact { padding: 36px 28px 0; }
          .pf-info-grid { margin: 0 28px; }
          .pf-bottom { margin: 0 28px; }
        }

        @media (max-width: 767px) {
          .pf-contact { padding: 28px 16px 0; }
          .pf-offices-grid { grid-template-columns: 1fr; gap: 0; }
          .pf-office-card + .pf-office-card { border-left: none; border-top: 1px solid var(--footer-border); }
          .pf-office-card { padding: 22px 18px; }
          .pf-office-city { font-size: 19px; }
          .pf-email-btn { font-size: 7px; padding: 5px 8px; word-break: break-all; }
          .pf-info-grid { grid-template-columns: 1fr; margin: 0 16px; }
          .pf-info-block + .pf-info-block { border-left: none; border-top: 1px solid var(--footer-border); padding-left: 0 !important; }
          .pf-info-block { padding: 24px 0; }
          .pf-bottom { margin: 0 16px; flex-direction: column; align-items: flex-start; gap: 10px; padding: 16px 0; }
          .pf-bottom-links { flex-wrap: wrap; gap: 4px; }
          .pf-bottom-links a { padding: 4px 8px; font-size: 11px; }
          .pf-copyright { font-size: 11px; }
        }

        @media (max-width: 400px) {
          .pf-contact-header-label { font-size: 11px; letter-spacing: 0.12em; }
          .pf-office-city { font-size: 17px; }
          .pf-email-btn { font-size: 7px; padding: 5px 8px; }
        }
      `}</style>

      <footer className="pf-root">
        {/* ── CONTACT OFFICES ── */}
        <div className="pf-contact">
          <div className="pf-contact-header">
            <div className="pf-contact-header-dot" />
            <span className="pf-contact-header-label">Feel free to contact us</span>
            <div className="pf-contact-header-line" />
          </div>

          <div className="pf-offices-grid">
            {offices.map((o) => (
              <div className="pf-office-card" key={o.city}>
                <div className="pf-office-city">{o.city}</div>
                <div className="pf-office-enquiry">
                  For enquiry call{" "}
                  <strong className="pf-office-phone">{o.phone}</strong>
                  <br />
                  Mon – Fri &nbsp;·&nbsp; 0900–1200 hrs &amp; 1300–1600 hrs
                  <br />
                  <em style={{ fontSize: 11, color: "var(--text-muted)" }}>except public holidays</em>
                </div>
                <span className="pf-email-btn">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m2 7 10 7 10-7" />
                  </svg>
                  {o.email}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── INFO GRID ── */}
        <div className="pf-info-grid">
          <div className="pf-info-block">
            <div className="pf-info-block-title">Important Notice</div>
            <p>
              Physically challenged applicants are requested to contact our helpline prior to
              visiting our centre so that we may offer the best possible assistance. All
              applicants are required to read the security guidelines carefully to increase
              convenience at South Africa Visa Services.
            </p>
          </div>

          <div className="pf-info-block" style={{ paddingLeft: 40 }}>
            <div className="pf-info-block-title">Visa Disclaimer</div>
            <div className="pf-quote-block">
              <span className="pf-quote-mark">&ldquo;</span>
              <p>
                Acceptance of your form for processing and payment of fees does not guarantee
                grant of a visa. The granting of the visa is entirely at the discretion of the
                Embassy / Consul of South Africa, and no reasons will be given for delay or denial.
              </p>
            </div>
          </div>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div className="pf-bottom">
          <div>
            <span className="pf-copyright">© 2014–{new Date().getFullYear()} South Africa Visa Services. All rights reserved.</span>
          </div>

          <div className="pf-bottom-links">
            <a href="/unavailable">Useful Links</a>
            <span className="sep">·</span>
            <a href="/unavailable">Disclaimer</a>
            <span className="sep">·</span>
            <a href="/unavailable">Contact Us</a>
            <span className="sep">·</span>
            <a href="/unavailable">Feedback / Complaints</a>
          </div>
        </div>
      </footer>
    </>
  );
}