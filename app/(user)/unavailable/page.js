import Footer from "../../../components/user/Footer";
import Header from "../../../components/user/Header";

 
export const metadata = { title: 'Page Not Available' };

export default function UnavailablePage() {
  return (
    <div>
      <Header />
      <div className="unavail-page">
        <div style={{fontSize:52}}>🚧</div>
        <h2>Page Not Available</h2>
        <p>
          This page is currently unavailable or under construction.<br/>
          Please visit the Home page or track your application.
        </p>
        <a href="/home">← Back to Home</a>
      </div>
      <Footer />
    </div>
  );
}
