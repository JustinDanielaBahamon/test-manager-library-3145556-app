import { useState } from 'react'
import { api } from '../api.js'
import ErrorBox from '../ErrorBox.jsx'

// HU-01
export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  async function submit(e) {
    e.preventDefault()
    setError(null)
    try {
      const r = await api('/auth/login', { method: 'POST', body: { username, password } })
      onLogin({ token: r.access_token, role: r.role, username: username.trim().toLowerCase() })
    } catch (err) {
      setError(err)
    }
  }

  return (
    <form className="login" onSubmit={submit}>
      <h1>Manager Library</h1>
      <label>Usuario <input value={username} onChange={(e) => setUsername(e.target.value)} required /></label>
      <label>Contraseña <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
      <button type="submit">Ingresar</button>
      <ErrorBox error={error} />
    </form>
  )
}
