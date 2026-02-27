import Footer from '../../../components/user/Footer';
import Header from '../../../components/user/Header';
import img1 from "../../../assets/one.jpeg";
import img2 from "../../../assets/ambasy.jpeg";
import img3 from "../../../assets/three.jpeg";
import doc from "../../../assets/doc.jpeg";
import docu from "../../../assets/docu.jpeg";
import docum from "../../../assets/docum.jpeg";
import last from "../../../assets/south.jpeg";
import lasto from "../../../assets/air.jpeg";
import Image from 'next/image';

export const metadata = { title: 'Home - South Africa Visa Immigration Services' };

export default function HomePage() {
  return (
    <div>
      <Header />

      {/* ─── HERO IMAGES ─── */}
      <div className="pub-hero">
        <Image
          src={img1}
          alt="Company Logo"
          width={180}
          height={60}
          priority
        />
        <Image
          src={img2}
          alt="Company Logo"
          width={180}
          height={60}
          priority
        />
        <Image
          src={img3}
          alt="Company Logo"
          width={180}
          height={60}
          priority
        />
      </div>

      {/* ─── CONTENT: Israel/SA visa info ─── */}
      <div className="pub-content">

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
      <div className="pub-section pub-content">
        <div className="pub-section-title">Type of South Africa Visas</div>

       <div className="pub-visa-grid">
  <div className="pub-visa-card">
    <div className="pub-visa-card-label">Employment Visa</div>
    <div className="pub-visa-image">
        <Image
          src={doc}
          alt="Company Logo"
          width={180}
          height={60}
          priority
        />
    </div>
  </div>

  <div className="pub-visa-card">
    <div className="pub-visa-card-label">Visit Visa</div>
    <div className="pub-visa-image">
      <Image
          src={docu}
          alt="Company Logo"
          width={180}
          height={60}
          priority
        />
    </div>
  </div>

  <div className="pub-visa-card">
    <div className="pub-visa-card-label">Work Visa</div>
    <div className="pub-visa-image">
      <Image
          src={docum}
          alt="Company Logo"
          width={180}
          height={60}
          priority
        />
    </div>
  </div>
</div>

     <div className="pub-content">
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
      </div>

      {/* ─── MORE CONTENT ─── */}
      <div className="pub-section pub-content" style={{ paddingTop: 0 }}>
        <p>Be able to convince the immigration officer that you will leave the country before your South Africa visa expires;</p>
        <p>
          Have sufficient funds to support yourself in South Africa and the amount depends on how long you
          will stay in South Africa and whether you will be staying with family, friends or any paid accommodation.
        </p>

        {/* Second hero images */}
        <div className="pub-hero-2" style={{ marginTop: 16 }}>
          <Image
          src={last}
          alt="Company Logo"
          width={180}
          height={60}
          priority
        />
          <Image
          src={lasto}
          alt="Company Logo"
          width={180}
          height={60}
          priority
        />
          <Image
          src={img3}
          alt="Company Logo"
          width={180}
          height={60}
          priority
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
