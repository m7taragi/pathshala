import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { Mail, Lock, User, KeyRound } from 'lucide-react';
import { loginSuccess } from '../store/userSlice';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'signup'
  const [loginMethod, setLoginMethod] = useState('password'); // 'password' or 'otp'
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useDispatch();

  const handleAuthSuccess = (data) => {
    dispatch(loginSuccess(data));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post(`${API_URL}/auth/register`, { name, email, password });
      handleAuthSuccess(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });
      handleAuthSuccess(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post(`${API_URL}/auth/otp/request`, { email });
      setOtpSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post(`${API_URL}/auth/otp/verify`, { email, otp });
      handleAuthSuccess(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post(`${API_URL}/auth/google`, {
        credential: credentialResponse.credential,
      });
      handleAuthSuccess(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Google Login failed');
    } finally {
      setLoading(false);
    }
  };

  const renderLoginForm = () => {
    if (loginMethod === 'password') {
      return (
        <form onSubmit={handlePasswordLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-secondary)' }} />
              <input type="email" required className="form-input" style={{ paddingLeft: '40px' }} placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-secondary)' }} />
              <input type="password" required className="form-input" style={{ paddingLeft: '40px' }} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
      );
    }

    if (loginMethod === 'otp') {
      if (!otpSent) {
        return (
          <form onSubmit={handleRequestOtp}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-secondary)' }} />
                <input type="email" required className="form-input" style={{ paddingLeft: '40px' }} placeholder="Enter your email for OTP" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        );
      }

      return (
        <form onSubmit={handleVerifyOtp}>
          <div className="form-group">
            <label className="form-label">Enter OTP sent to {email}</label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-secondary)' }} />
              <input type="text" required className="form-input" style={{ paddingLeft: '40px' }} placeholder="6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify OTP & Login'}
          </button>
          <button type="button" className="btn btn-outline" style={{ marginTop: '10px' }} onClick={() => setOtpSent(false)}>
            Back
          </button>
        </form>
      );
    }
  };

  return (
    <div className="glass-panel" style={{ width: '100%', maxWidth: '420px', animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2>Welcome Back</h2>
        <p style={{ marginTop: '0.5rem' }}>Access your account</p>
      </div>

      <div className="tabs">
        <button className={`tab ${activeTab === 'login' ? 'active' : ''}`} style={{ flex: 1 }} onClick={() => { setActiveTab('login'); setError(''); }}>
          Log In
        </button>
        <button className={`tab ${activeTab === 'signup' ? 'active' : ''}`} style={{ flex: 1 }} onClick={() => { setActiveTab('signup'); setError(''); }}>
          Sign Up
        </button>
      </div>

      {error && (
        <div style={{ padding: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid #ef4444', color: '#ef4444', marginBottom: '1rem', borderRadius: '4px', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      {activeTab === 'login' ? (
        <>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <button className={`btn ${loginMethod === 'password' ? 'btn-primary' : 'btn-outline'}`} style={{ flex: 1, padding: '0.5rem', fontSize: '0.875rem' }} onClick={() => { setLoginMethod('password'); setOtpSent(false); }}>
              Password
            </button>
            <button className={`btn ${loginMethod === 'otp' ? 'btn-primary' : 'btn-outline'}`} style={{ flex: 1, padding: '0.5rem', fontSize: '0.875rem' }} onClick={() => setLoginMethod('otp')}>
              OTP
            </button>
          </div>
          {renderLoginForm()}
        </>
      ) : (
        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-secondary)' }} />
              <input type="text" required className="form-input" style={{ paddingLeft: '40px' }} placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-secondary)' }} />
              <input type="email" required className="form-input" style={{ paddingLeft: '40px' }} placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-secondary)' }} />
              <input type="password" required className="form-input" style={{ paddingLeft: '40px' }} placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
      )}

      <div style={{ margin: '2rem 0', display: 'flex', alignItems: 'center' }}>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
        <span style={{ padding: '0 1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>or continue with</span>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setError('Google Login Failed')}
          useOneTap
          theme="filled_black"
          shape="pill"
        />
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AuthPage;
