export default function Pager({ data, onPage }) {
  if (!data) return null
  const pages = Math.max(1, Math.ceil(data.total / data.size))
  return (
    <div className="pager">
      <button disabled={data.page <= 1} onClick={() => onPage(data.page - 1)}>Anterior</button>
      <span>Página {data.page} de {pages} · {data.total} resultados</span>
      <button disabled={data.page >= pages} onClick={() => onPage(data.page + 1)}>Siguiente</button>
    </div>
  )
}
