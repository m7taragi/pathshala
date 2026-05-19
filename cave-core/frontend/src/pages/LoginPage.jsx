import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, googleLoginUser, clearError } from '../features/auth/authSlice'
import { GoogleLogin } from '@react-oauth/google'
import { useNavigate, Link } from 'react-router-dom'

import './AuthPage.css'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading, error, user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (user) navigate('/dashboard')
  }, [user, navigate])

  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(loginUser({ email, password }))
  }

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
          <h1 className="auth-card__title">CAVE-CORE</h1>
          <p className="auth-card__subtitle">Sign in to your command center</p>
        </div>

        {error && (
          <div className="auth-card__alert auth-card__alert--error">
            <span>⚠</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="login-email" className="form-label">Email</label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password" className="form-label">Password</label>
            <div className="form-input-wrapper">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="form-input-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary auth-form__submit" disabled={isLoading}>
            {isLoading ? (
              <span className="auth-spinner" />
            ) : (
              'Sign In'
            )}
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
            text="signin_with"
            shape="rectangular"
          />
        </div>


        <p className="auth-card__footer-text">
          Don't have an account? <Link to="/register" className="auth-card__link">Create one</Link>
        </p>
        <p className="auth-card__footer-text" style={{ marginTop: '0.75rem' }}>
          Need credentials? Check the <a href="https://github.com/m7taragi/pathshala/blob/master/cave-core/README.md" target="_blank" rel="noopener noreferrer" className="auth-card__link">README.md</a>
        </p>
      </div>
    </div>
  )
}
