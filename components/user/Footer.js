export default function Footer() {
  return (
    <footer className="pub-footer">
      <div className="pub-footer-title">Footer</div>

      <div className="pub-footer-contact-title">
        Contact Us - Helpline &amp; Helpdesk Timings Only
      </div>
      <div className="pub-footer-feel">Feel free to contact us:</div>

      <div className="pub-footer-grid">
        {/* Left: Important section */}
        <div className="pub-footer-imp">
          <div className="pub-footer-imp-title">Important</div>
          <p>
            Physically challenged applicants are requested to contact our helpline prior to
            visiting our centre to submit your application so that we may offer you the best
            possible assistance. Applicants are required to read the Security guidelines
            carefully which would in turn increase their convenience at South Africa Visa Services.
          </p>
        </div>

        {/* Right: Quote box */}
        <div className="pub-footer-quote">
          Acceptance of your form for processing and payment of the processing fee does not
          guarantee grant of the visa. The granting of the visa is entirely the prerogative and
          at the discretion of the Embassy / Consul of South Africa and no reasons will be
          provided for the delay/denial of a visa.
        </div>
      </div>

      {/* Bottom bar */}
      <div className="pub-footer-bottom">
        <span>© Copyright 2017. All rights reserved.</span>
        <div className="pub-footer-links-group">
          <div className="pub-footer-links">
            <a href="/unavailable">Usefull Links</a>
            <a href="/unavailable">Disclaimer</a>
          </div>
          <div className="pub-footer-links">
            <a href="/unavailable">Contact us</a>
            <a href="/unavailable">Feedback/Complaints</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
