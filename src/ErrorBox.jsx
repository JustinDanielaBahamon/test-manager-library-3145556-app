export default function ErrorBox({ error }) {
  if (!error) return null
  return (
    <div className="error">
      <strong>{error.message}</strong>
      {error.code && <code> {error.code}</code>}
      {error.details?.length > 0 && (
        <ul>{error.details.map((d, i) => <li key={i}>{d.field}: {d.issue}</li>)}</ul>
      )}
    </div>
  )
}
