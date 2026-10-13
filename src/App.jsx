import { useState } from 'react'
import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { getSession, setSession } from './api.js'
import Login from './pages/Login.jsx'
import Books from './pages/Books.jsx'
import Members from './pages/Members.jsx'
import NewLoan from './pages/NewLoan.jsx'
import Loans from './pages/Loans.jsx'
import Overdue from './pages/Overdue.jsx'
import Report from './pages/Report.jsx'

export default function App() {
  const [session, setState] = useState(getSession())
  const login = (s) => { setSession(s); setState(s) }
  const logout = () => { setSession(null); setState(null) }

  if (!session) return <Login onLogin={login} />
  const isAdmin = session.role === 'admin'

  return (
    <div className="layout">
      <nav>
        <strong>Manager Library</strong>
        <NavLink to="/books">Catálogo</NavLink>
        <NavLink to="/members">Socios</NavLink>
        <NavLink to="/loans/new">Prestar</NavLink>
        <NavLink to="/loans">Préstamos</NavLink>
        <NavLink to="/overdue">Vencidos</NavLink>
        {isAdmin && <NavLink to="/report">Reporte</NavLink>}
        <span className="spacer" />
        <span className="role">{session.username} · {session.role}</span>
        <button onClick={logout}>Salir</button>
      </nav>
      <main>
        <Routes>
          <Route path="/books" element={<Books isAdmin={isAdmin} />} />
          <Route path="/members" element={<Members />} />
          <Route path="/loans/new" element={<NewLoan />} />
          <Route path="/loans" element={<Loans />} />
          <Route path="/overdue" element={<Overdue />} />
          {isAdmin && <Route path="/report" element={<Report />} />}
          <Route path="*" element={<Navigate to="/books" />} />
        </Routes>
      </main>
    </div>
  )
}
