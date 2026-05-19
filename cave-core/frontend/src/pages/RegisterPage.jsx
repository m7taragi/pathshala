import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser, googleLoginUser, clearError } from '../features/auth/authSlice'
import { GoogleLogin } from '@react-oauth/google'
import { useNavigate, Link } from 'react-router-dom'

import './AuthPage.css'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('Viewer')
  const [localError, setLocalError] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading, error, user } = useSelector((s) => s.auth)

  useEffect(() => { if (user) navigate('/dashboard') }, [user, navigate])
  useEffect(() => { dispatch(clearError()) }, [dispatch])

  const handleSubmit = (e) => {
    e.preventDefault()
    setLocalError('')
    if (password.length < 6) return setLocalError('Password must be at least 6 characters')
    if (password !== confirmPassword) return setLocalError('Passwords do not match')
    dispatch(registerUser({ email, password, role }))
  }

  const displayError = localError || error

  return (
    <div className="auth-page">
      <div className="auth-page__bg">
        <div className="auth-page__orb auth-page__orb--1" />
        <div className="auth-page__orb auth-page__orb--2" />
        <div className="auth-page__orb auth-page__orb--3" />
      </div>
      <div className="auth-card glass-panel">
        <div className="auth-card__header">
          <div className="auth-card__logo">◆</div>
          <h1 className="auth-card__title">Join CAVE-CORE</h1>
          <p className="auth-card__subtitle">Create your account</p>
        </div>
        {displayError && <div className="auth-card__alert auth-card__alert--error"><span>⚠</span> {displayError}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="reg-email" className="form-label">Email</label>
            <input id="reg-email" type="email" className="form-input" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
          </div>
          <div className="form-group">
            <label htmlFor="reg-pass" className="form-label">Password</label>
            <input id="reg-pass" type="password" className="form-input" placeholder="Min 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="reg-confirm" className="form-label">Confirm Password</label>
            <input id="reg-confirm" type="password" className="form-input" placeholder="Re-enter password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="reg-role" className="form-label">Role</label>
            <select id="reg-role" className="form-input form-select" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="Viewer">Viewer</option>
              <option value="Manager">Manager</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary auth-form__submit" disabled={isLoading}>
            {isLoading ? <span className="auth-spinner" /> : 'Create Account'}
          </button>
        </form>

        <div className="auth-card__divider">
          <span>or</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              dispatch(googleLoginUser(credentialResponse.credential));
            }}
            onError={() => {
              console.error('Google Login Failed');
            }}
            theme="filled_black"
            text="signup_with"
            shape="rectangular"
          />
        </div>


        <p className="auth-card__footer-text">Already have an account? <Link to="/login" className="auth-card__link">Sign in</Link></p>
      </div>
    </div>
  )
}
