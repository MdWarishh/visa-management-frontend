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