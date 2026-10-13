import { useEffect, useState } from 'react'
import { api } from '../api.js'
import ErrorBox from '../ErrorBox.jsx'
import Pager from '../Pager.jsx'

// HU-07 and HU-08
export default function Loans() {
  const [filters, setFilters] = useState({ from: '', to: '', status: '' })
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  async function load(page = 1) {
    setError(null)
    try { setData(await api('/loans', { query: { ...filters, page, size: 10 } })) } catch (err) { setError(err) }
  }
  useEffect(() => { load() }, [])

  async function giveBack(loanId, itemId) {
    setError(null)
    try { await api(`/loans/${loanId}/items/${itemId}/return`, { method: 'POST' }); load(data?.page || 1) } catch (err) { setError(err) }
  }

  return (
    <section>
      <h2>Préstamos</h2>
      <form className="row" onSubmit={(e) => { e.preventDefault(); load(1) }}>
        <input type="date" value={filters.from} onChange={(e) => setFilters({ ...filters, from: e.target.value })} />
        <input type="date" value={filters.to} onChange={(e) => setFilters({ ...filters, to: e.target.value })} />
        <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">Todos</option>
          <option value="open">Abiertos</option>
          <option value="overdue">Vencidos</option>
          <option value="closed">Cerrados</option>
        </select>
        <button>Filtrar</button>
      </form>
      <ErrorBox error={error} />
      {data?.items.map((loan) => (
        <div key={loan.id} className="card">
          <div><strong>{new Date(loan.loaned_at).toLocaleString('es-CO')}</strong> · <span className={`status ${loan.status}`}>{loan.status}</span></div>
          <ul>
            {loan.items.map((i) => (
              <li key={i.id}>
                {i.book_title} ({i.category_name}) — vence {new Date(i.due_at).toLocaleDateString('es-CO')}{' '}
                {i.returned_at ? <em>devuelto</em> : <button onClick={() => giveBack(loan.id, i.id)}>Devolver</button>}
              </li>
            ))}
          </ul>
        </div>
      ))}
      <Pager data={data} onPage={load} />
    </section>
  )
}
