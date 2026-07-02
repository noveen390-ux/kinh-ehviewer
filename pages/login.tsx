import { useEffect, useState } from 'react'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('username')
    if (saved) setUsername(saved)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || submitting) return
    setSubmitting(true)
    setError(false)
    try {
      const resp = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await resp.json()
      if (data.error) {
        setError(true)
        setSubmitting(false)
        return
      }
      localStorage.setItem('username', username.trim())
      sessionStorage.setItem('auth', 'valid')
      const params = new URLSearchParams(window.location.search)
      window.location.href = params.get('redirect') || '/'
    } catch {
      setError(true)
      setSubmitting(false)
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#111' }}>
      <form onSubmit={handleSubmit} style={{ background: '#222', padding: 32, borderRadius: 8, textAlign: 'center' }}>
        <h1 style={{ color: '#fff', margin: '0 0 16px' }}>Kinh EhViewer</h1>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="الاسم"
          style={{ padding: '8px 16px', fontSize: 16, borderRadius: 4, border: '1px solid #555', background: '#333', color: '#fff', width: 200, marginBottom: 12, display: 'block' }}
          autoFocus
        />
        <input
          type="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(false) }}
          placeholder="كلمة المرور"
          style={{ padding: '8px 16px', fontSize: 16, borderRadius: 4, border: '1px solid #555', background: '#333', color: '#fff', width: 200, marginBottom: 12, display: 'block' }}
          autoComplete="new-password"
        />
        {error && <p style={{ color: '#f44', margin: '0 0 8px', fontSize: 14 }}>كلمة المرور خطأ</p>}
        <button type="submit" disabled={submitting} style={{ display: 'block', width: '100%', padding: '8px', fontSize: 16, borderRadius: 4, border: 'none', background: '#1976d2', color: '#fff', cursor: 'pointer', opacity: submitting ? 0.6 : 1 }}>
          {submitting ? '...' : 'دخول'}
        </button>
      </form>
    </div>
  )
}
