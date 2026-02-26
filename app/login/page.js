'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '../../lib/api';
import { setUser, dashboardPath, getUser } from '../../lib/auth';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  useEffect(() => {
    const u = getUser();
    if (u && localStorage.getItem('token')) {
      router.replace(dashboardPath(u.role));
    }
  }, [router]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Email and password required.'); return; }
    setLoading(true);
    try {
      const d = await authAPI.login(email.trim(), password);
      if (d?.success && d?.token) {
        localStorage.setItem('token', d.token);
        setUser(d.user);
        toast.success(`Welcome, ${d.user.name}!`);
        router.push(dashboardPath(d.user.role));
      } else {
        setError(d?.message || 'Login failed.');
      }
    } catch {
      setError('Cannot connect to server. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg">
      <div style={{ width:'100%', maxWidth:400, position:'relative', zIndex:1 }}>

        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:24 }}>
          <div style={{ width:56, height:56, background:'#1a56db', borderRadius:'50%', margin:'0 auto 16px', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/>
            </svg>
          </div>
          <h1 style={{ color:'#fff', fontSize:22, fontWeight:800, fontFamily:'Inter,sans-serif', marginBottom:4 }}>
            Visa Management
          </h1>
          <p style={{ color:'#8ba3bd', fontSize:13 }}>Sign in to your account</p>
        </div>

        <div className="login-card fade">
          {error && (
            <div className="login-error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink:0, marginTop:1 }}>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={submit}>
            <div style={{ marginBottom:16 }}>
              <label className="login-label">Email Address</label>
              <div className="login-input-wrap" style={{ marginBottom:0 }}>
                <span className="login-input-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </span>
                <input type="email" className="login-input" placeholder="your@email.com"
                  value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
              </div>
            </div>

            <div style={{ marginBottom:24 }}>
              <label className="login-label">Password</label>
              <div className="login-input-wrap" style={{ marginBottom:0 }}>
                <span className="login-input-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                  </svg>
                </span>
                <input type={showPw ? 'text' : 'password'} className="login-input" placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="button" className="login-eye" onClick={() => setShowPw(v => !v)}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    {showPw
                      ? <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27z"/>
                      : <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    }
                  </svg>
                </button>
              </div>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading
                ? <><div className="spin" style={{ width:16, height:16 }} /> Signing in…</>
                : 'Sign In'
              }
            </button>
          </form>

          <p style={{ textAlign:'center', color:'#4e6476', fontSize:11, marginTop:16 }}>
            Account locks after 5 failed attempts
          </p>
        </div>
      </div>
    </div>
  );
}
