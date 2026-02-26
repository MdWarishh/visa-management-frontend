import './public.css';

// Public pages ka layout — root layout ke andar render hoga
// Apna html/body nahi hoga
export default function UserLayout({ children }) {
  return <>{children}</>;
}
