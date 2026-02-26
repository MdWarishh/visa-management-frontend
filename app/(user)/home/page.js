import Footer from '../../../components/user/Footer';
import Header from '../../../components/user/Header';

export const metadata = { title: 'Home - South Africa Visa Immigration Services' };

export default function HomePage() {
  return (
    <div>
      <Header/>

      {/* ─── HERO IMAGES ─── */}
      <div className="pub-hero">
        {/* Image 1: SA passport/stamp */}
        <img
          src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=480&h=270&fit=crop&q=80"
          alt="South Africa Visa"
          onError="this.style.background='#1a4a8a';this.style.display='block'"
        />
        {/* Image 2: Table Mountain / Cape Town */}
        <img
          src="https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=480&h=270&fit=crop&q=80"
          alt="Cape Town South Africa"
          onError="this.style.background='#2e7d32';this.style.display='block'"
        />
        {/* Images 3+4 side by side */}
        <div className="pub-hero-split">
          <img
            src="https://images.unsplash.com/photo-1544785349-c4a5301826fd?w=240&h=270&fit=crop&q=80"
            alt="Passports"
            onError="this.style.background='#0d47a1'"
          />
          <img
            src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=240&h=270&fit=crop&q=80"
            alt="Visa Map"
            onError="this.style.background='#37474f'"
          />
        </div>
      </div>

      {/* ─── CONTENT: Israel/SA visa info ─── */}
      <div className="pub-content">
        {/* Breadcrumb — right aligned */}
        <div className="pub-breadcrumb">
          <a href="/home">Home</a>
          <span>›</span>
          <span>Track Your Application</span>
        </div>

        <h2>South Africa visa for Indian citizens</h2>

        <p>
          Your passport must not be older than 10 years also it must be valid for at least THREE MONTHS
          longer than the intended stay. Your passport must have at least TWO BLANK PAGES to affix the
          visa. The Visa application form must be complete &amp; duly signed by the applicant.
        </p>
        <p>
          If you&apos;re travelling to South Africa from India, you&apos;re in luck. This post covers everything
          you need to know about going to South Africa, including if you need a South Africa visa for Indians.
        </p>
        <p>
          Yes, Indian citizens need a visa to travel to South Africa. Indian nationals are required to
          obtain a visa before entering South Africa for tourism, business, or any other purpose.
        </p>
        <p>
          The visa allows them to stay in South Africa for a specified time as approved by the South African authorities.
        </p>
        <p>
          It is necessary to apply for the appropriate visa category and fulfill all the requirements
          to obtain a visa for South Africa.
        </p>
      </div>

      {/* ─── VISA TYPES SECTION ─── */}
      <div className="pub-section">
        <div className="pub-section-title">Type of South Africa Visas</div>

        <div className="pub-visa-grid">
          <div className="pub-visa-card">
            <div className="pub-visa-card-label">Employment visa</div>
            <div className="pub-visa-placeholder">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="#aaa">
                <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
              </svg>
              <span style={{fontSize:12, color:'#888'}}>Employment Visa Document</span>
            </div>
          </div>
          <div className="pub-visa-card">
            <div className="pub-visa-card-label">Visit Visa</div>
            <div className="pub-visa-placeholder">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="#aaa">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
              </svg>
              <span style={{fontSize:12, color:'#888'}}>Visit Visa Document</span>
            </div>
          </div>
          <div className="pub-visa-card">
            <div className="pub-visa-card-label">Work Visa</div>
            <div className="pub-visa-placeholder">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="#aaa">
                <path d="M20 6h-2.18c.07-.44.18-.88.18-1.36 0-2.59-2.09-4.69-4.68-4.69-1.79 0-3.36 1.02-4.14 2.54l-.56 1.12L7.06 2.07C6.32.79 4.95 0 3.5 0 1.57 0 0 1.57 0 3.5c0 1.7 1.22 3.13 2.84 3.44L0 20h24L21.16 6.94C21.07 6.38 20.55 6 20 6z"/>
              </svg>
              <span style={{fontSize:12, color:'#888'}}>Work Visa Document</span>
            </div>
          </div>
        </div>

        <p>Price may differ based on the residence location of the applicant</p>
        <p>Documents pickup and drop charges, photograph development charges, taxes etc. will be additional.</p>
        <p>I have an Indian passport, do I need a visa to visit South Africa?</p>
        <p>
          Yes, Indian travellers need to have a South Africa Visa prior to their arrival in the country.
          The good news is that, with our online portal you can track your South Africa Visa application
          status in just a few minutes! We have an easy application process and provide end-to-end
          assistance to ensure you get your South Africa Visa in the most hassle-free manner possible.
        </p>
        <p>Do I need travel insurance to get a South Africa Visa?</p>
        <p>
          Travellers do not need to have insurance to get a South Africa visa! All you need are the
          below mentioned documents and you&apos;re good to go!
        </p>
        <br />
        <p><strong>Basic Requirements to visit South Africa</strong></p>
        <p>Have a valid Passport and valid South Africa Visa;</p>
        <p>Be in good health;</p>
        <p>Good moral character;</p>
        <p>
          Be able to convince the immigration officer that you have your family, property, assets, etc.
          that would serve as an incentive to come back to your home country;
        </p>
      </div>

      {/* ─── MORE CONTENT ─── */}
      <div className="pub-section" style={{ paddingTop: 0 }}>
        <p>Be able to convince the immigration officer that you will leave the country before your South Africa visa expires;</p>
        <p>
          Have sufficient funds to support yourself in South Africa and the amount depends on how long you
          will stay in South Africa and whether you will be staying with family, friends or any paid accommodation.
        </p>

        {/* Second hero images */}
        <div className="pub-hero-2" style={{ marginTop: 16 }}>
          <img
            src="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=480&h=200&fit=crop&q=80"
            alt="South Africa Flag"
            onError="this.style.background='#007A4D'"
          />
          <img
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=480&h=200&fit=crop&q=80"
            alt="Airplane"
            onError="this.style.background='#37474f'"
          />
          <img
            src="https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=480&h=200&fit=crop&q=80"
            alt="Money / Currency"
            onError="this.style.background='#4e342e'"
          />
        </div>

        <br />
        <p><strong>Visa Services - Terms &amp; Conditions</strong></p>
        <br />
        <p>
          Visa application fees along with the service charge are non-refundable in all cases. Even in
          case of visa application rejection the entire amount is non-refundable.
        </p>
        <p>
          Visa application approval/rejection and processing time is at the sole discretion of the
          immigration and we do not have any control over the same.
        </p>
        <p>
          Visa applications may require more than usual working days for processing and it is completely
          dependent on the immigration.
        </p>
        <p>Our portal may ask for additional documents on a case to case basis.</p>
        <p>Prices are correct at the time of publication and are subject to change without notice.</p>
        <p>
          Visa applications processing will only be after the verification of all required documents
          and receipt of complete payment.
        </p>
        <p>
          Visas issued under visit/business/transit/tourist profession are not eligible to work in
          the destination country.
        </p>
        <p>
          Our portal reserves the right to refuse applications at its discretion and bears no liability
          for the processing.
        </p>
      </div>

      <Footer />
    </div>
  );
}
