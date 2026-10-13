import { useState } from 'react'
import { api } from '../api.js'
import ErrorBox from '../ErrorBox.jsx'

// HU-10 (admin): rows by book and frozen category name; no members, no librarians
export default function Report() {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  async function run(e) {
    e.preventDefault()
    setError(null)
    try { setData(await api('/reports/most-borrowed', { query: { from, to } })) } catch (err) { setError(err) }
  }

  return (
    <section>
      <h2>Libros más prestados</h2>
      <form className="row" onSubmit={run}>
        <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} required />
        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} required />
        <button>Generar</button>
      </form>
      <ErrorBox error={error} />
      <table>
        <thead><tr><th>Libro</th><th>Categoría</th><th>Veces prestado</th></tr></thead>
        <tbody>
          {data?.rows.map((r) => (
            <tr key={r.book_id + r.book_title + r.category_name}><td>{r.book_title}</td><td>{r.category_name}</td><td>{r.times_borrowed}</td></tr>
          ))}
        </tbody>
      </table>
      {data && data.rows.length === 0 && <p>No hubo préstamos en ese rango.</p>}
    </section>
  )
}
