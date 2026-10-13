import { useState } from 'react'
import { api } from '../api.js'
import ErrorBox from '../ErrorBox.jsx'

// HU-06: one member, 1 to 3 books
export default function NewLoan() {
  const [memberQ, setMemberQ] = useState('')
  const [members, setMembers] = useState([])
  const [member, setMember] = useState(null)
  const [bookQ, setBookQ] = useState('')
  const [books, setBooks] = useState([])
  const [selected, setSelected] = useState([])
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  const findMembers = async () => {
    try { setMembers((await api('/members', { query: { q: memberQ, size: 10 } })).items) } catch (err) { setError(err) }
  }
  const findBooks = async () => {
    try { setBooks((await api('/books', { query: { q: bookQ, size: 10 } })).items) } catch (err) { setError(err) }
  }
  const toggle = (b) => setSelected((s) => (s.find((x) => x.id === b.id) ? s.filter((x) => x.id !== b.id) : [...s, b]))

  async function lend() {
    setError(null)
    setResult(null)
    try {
      const loan = await api('/loans', { method: 'POST', body: { member_id: member?.id, items: selected.map((b) => ({ book_id: b.id })) } })
      setResult(loan)
      setSelected([])
    } catch (err) { setError(err) }
  }

  return (
    <section>
      <h2>Registrar préstamo</h2>
      <div className="card">
        <h3>1. Socio {member && <small>— {member.full_name} ({member.document_number})</small>}</h3>
        <div className="row">
          <input placeholder="Nombre o documento" value={memberQ} onChange={(e) => setMemberQ(e.target.value)} />
          <button onClick={findMembers}>Buscar</button>
        </div>
        {members.map((m) => <button key={m.id} className="chip" onClick={() => setMember(m)}>{m.full_name}</button>)}
      </div>
      <div className="card">
        <h3>2. Libros (máximo 3) — seleccionados: {selected.length}</h3>
        <div className="row">
          <input placeholder="Título o autor" value={bookQ} onChange={(e) => setBookQ(e.target.value)} />
          <button onClick={findBooks}>Buscar</button>
        </div>
        {books.map((b) => (
          <label key={b.id} className="check">
            <input type="checkbox" checked={!!selected.find((x) => x.id === b.id)} onChange={() => toggle(b)} />
            {b.title} — disponibles {b.available_copies}
          </label>
        ))}
      </div>
      <button onClick={lend} disabled={!member || selected.length === 0}>Prestar</button>
      <ErrorBox error={error} />
      {result && (
        <div className="ok">
          Préstamo registrado. Vence: {new Date(result.items[0].due_at).toLocaleString('es-CO')} · estado {result.status}
        </div>
      )}
    </section>
  )
}
