import { useEffect, useState } from 'react'
import { api } from '../api.js'
import ErrorBox from '../ErrorBox.jsx'
import Pager from '../Pager.jsx'

// HU-03 (admin) and HU-04
export default function Books({ isAdmin }) {
  const [categories, setCategories] = useState([])
  const [q, setQ] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({ title: '', author: '', isbn: '', category_id: '', total_copies: 1 })

  async function load(page = 1) {
    setError(null)
    try {
      setData(await api('/books', { query: { q, category_id: categoryId, page, size: 20 } }))
    } catch (err) { setError(err) }
  }

  useEffect(() => {
    api('/categories').then(setCategories).catch(setError)
    load()
  }, [])

  async function create(e) {
    e.preventDefault()
    setError(null)
    try {
      await api('/books', { method: 'POST', body: { ...form, total_copies: Number(form.total_copies) } })
      setForm({ title: '', author: '', isbn: '', category_id: '', total_copies: 1 })
      load()
    } catch (err) { setError(err) }
  }

  async function remove(id) {
    setError(null)
    try { await api(`/books/${id}`, { method: 'DELETE' }); load(data?.page || 1) } catch (err) { setError(err) }
  }

  return (
    <section>
      <h2>Catálogo</h2>
      <form className="row" onSubmit={(e) => { e.preventDefault(); load(1) }}>
        <input placeholder="Título o autor" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">Todas las categorías</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button>Buscar</button>
      </form>
      <ErrorBox error={error} />
      <table>
        <thead><tr><th>Título</th><th>Autor</th><th>ISBN</th><th>Categoría</th><th>Disponibles</th>{isAdmin && <th />}</tr></thead>
        <tbody>
          {data?.items.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td><td>{b.author}</td><td>{b.isbn}</td><td>{b.category.name}</td>
              <td>{b.available_copies} / {b.total_copies}</td>
              {isAdmin && <td><button onClick={() => remove(b.id)}>Dar de baja</button></td>}
            </tr>
          ))}
        </tbody>
      </table>
      <Pager data={data} onPage={load} />

      {isAdmin && (
        <form className="card" onSubmit={create}>
          <h3>Nuevo libro</h3>
          <input placeholder="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <input placeholder="Autor" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} required />
          <input placeholder="ISBN (13 dígitos)" value={form.isbn} onChange={(e) => setForm({ ...form, isbn: e.target.value })} required />
          <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} required>
            <option value="">Categoría</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input type="number" min="1" value={form.total_copies} onChange={(e) => setForm({ ...form, total_copies: e.target.value })} required />
          <button>Crear</button>
        </form>
      )}
    </section>
  )
}
