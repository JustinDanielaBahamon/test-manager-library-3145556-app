import { useEffect, useState } from 'react'
import { api } from '../api.js'
import ErrorBox from '../ErrorBox.jsx'

// HU-09: most days late first
export default function Overdue() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  useEffect(() => { api('/loans/overdue', { query: { size: 50 } }).then(setData).catch(setError) }, [])

  return (
    <section>
      <h2>Libros vencidos</h2>
      <ErrorBox error={error} />
      <table>
        <thead><tr><th>Libro</th><th>Socio</th><th>Venció</th><th>Días de retraso</th></tr></thead>
        <tbody>
          {data?.items.map((r) => (
            <tr key={r.item_id}><td>{r.book_title}</td><td>{r.member_name}</td><td>{new Date(r.due_at).toLocaleDateString('es-CO')}</td><td>{r.days_late}</td></tr>
          ))}
        </tbody>
      </table>
      {data && data.items.length === 0 && <p>No hay libros vencidos.</p>}
    </section>
  )
}
