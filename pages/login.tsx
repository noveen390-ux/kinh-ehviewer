import { useRouter } from 'next/router'
import { useState } from 'react'

export default function Login() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    const data = await res.json()
    if (data.error) return setError(true)
    const redirect = (router.query.redirect as string) || '/'
    router.push(redirect)
  }

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#111' }}>
      <form onSubmit={handleSubmit} style={{ background: '#222', padding: 32, borderRadius: 8, textAlign: 'center' }}>
        <h1 style={{ color: '#fff', margin: '0 0 16px' }}>Kinh EhViewer</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(false) }}
          placeholder="كلمة المرور"
          style={{ padding: '8px 16px', fontSize: 16, borderRadius: 4, border: '1px solid #555', background: '#333', color: '#fff', width: 200, marginBottom: 12 }}
          autoFocus
        />
        {error && <p style={{ color: '#f44', margin: '0 0 8px', fontSize: 14 }}>كلمة المرور خطأ</p>}
        <button type="submit" style={{ display: 'block', width: '100%', padding: '8px', fontSize: 16, borderRadius: 4, border: 'none', background: '#1976d2', color: '#fff', cursor: 'pointer' }}>
          دخول
        </button>
      </form>
    </div>
  )
}
