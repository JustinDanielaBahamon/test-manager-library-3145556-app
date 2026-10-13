import { useEffect, useState } from 'react'
import { api } from '../api.js'
import ErrorBox from '../ErrorBox.jsx'
import Pager from '../Pager.jsx'

// HU-05
export default function Members() {
  const [q, setQ] = useState('')
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({ full_name: '', document_number: '' })

  async function load(page = 1) {
    setError(null)
    try { setData(await api('/members', { query: { q, page, size: 20 } })) } catch (err) { setError(err) }
  }
  useEffect(() => { load() }, [])

  async function create(e) {
    e.preventDefault()
    setError(null)
    try {
      await api('/members', { method: 'POST', body: form })
      setForm({ full_name: '', document_number: '' })
      load()
    } catch (err) { setError(err) }
  }

  return (
    <section>
      <h2>Socios</h2>
      <form className="row" onSubmit={(e) => { e.preventDefault(); load(1) }}>
        <input placeholder="Nombre o documento" value={q} onChange={(e) => setQ(e.target.value)} />
        <button>Buscar</button>
      </form>
      <ErrorBox error={error} />
      <table>
        <thead><tr><th>Nombre</th><th>Documento</th><th>Id</th></tr></thead>
        <tbody>
          {data?.items.map((m) => <tr key={m.id}><td>{m.full_name}</td><td>{m.document_number}</td><td><code>{m.id}</code></td></tr>)}
        </tbody>
      </table>
      <Pager data={data} onPage={load} />
      <form className="card" onSubmit={create}>
        <h3>Nuevo socio</h3>
        <input placeholder="Nombre completo" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
        <input placeholder="Documento" value={form.document_number} onChange={(e) => setForm({ ...form, document_number: e.target.value })} required />
        <button>Crear</button>
      </form>
    </section>
  )
}
