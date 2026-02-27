'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../../components/user/Header';
import Footer from '../../../components/user/Footer';
import styles from './track-application.module.css';

const CITIES = [
  { id: 'delhi',     text: 'Track your Passport for Delhi only',    working: false },
  { id: 'bengaluru',   text: 'Track your Passport for Mumbai',     working: false },
  { id: 'chennai',   text: 'Track your Passport for Chennai',        working: true  },
];

export default function TrackApplicationPage() {
  const router = useRouter();
  const [clickedCity, setClickedCity] = useState(null);

  const handleClick = (city) => {
    if (city.working) {
      router.push('/track-form');
    } else {
      setClickedCity(city.id);
    }
  };

  return (
    <div className={styles.pageWrap}>
      <Header />

      <div className={styles.page}>
        {/* Red label + title + breadcrumb — Image 3 */}
        <div className={styles.pageHead}>
          <div className={styles.titleRow}>
            <h1 className={styles.pageTitle}>South Africa Ambassy in India</h1>
            <div className={styles.breadcrumb}>
              <a href="/home">Home</a>
              <span>›</span>
              <span>Track Your Application</span>
            </div>
          </div>
        </div>

        <hr className={styles.divider} />

        <p className={styles.intro}>
          Applicants who have already applied for a visa can track application using our visa application tracker service:
        </p>

        <ul className={styles.linksList}>
          {CITIES.map((city) => (
            <li key={city.id} className={styles.listItem}>
              <span className={styles.listText}>{city.text} – </span>
              <button className={styles.clickHere} onClick={() => handleClick(city)}>
                click here
              </button>
              {/* <span className={`${styles.cityTag} ${city.working ? styles.cityTagActive : styles.cityTagDisabled}`}>
                {city.label}
              </span> */}
            </li>
          ))}
        </ul>

        {/* Not available message — for Delhi/Bengaluru */}
        {clickedCity && clickedCity !== 'chennai' && (
          <div className={styles.notAvailBox}>
            <div className={styles.notAvailIcon}>⚠️</div>
            <div>
              <strong>Service Not Available</strong>
              <p>This tracking service is currently not available for this region. Our online tracking facility is temporarily unavailable. Please contact the South Africa Embassy directly for assistance, or use the Chennai portal below.</p>
              <button className={styles.tryChennai} onClick={() => router.push('/track-form')}>
                Use Online Tracker →
              </button>
            </div>
          </div>
        )}

        <hr className={styles.divider} />
      </div>

      <Footer />
    </div>
  );
}
