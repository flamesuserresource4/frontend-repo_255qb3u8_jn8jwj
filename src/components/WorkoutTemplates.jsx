import { useEffect, useState } from 'react'

const BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function WorkoutTemplates({ onUseTemplate }) {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const res = await fetch(`${BASE}/api/templates`)
      const data = await res.json()
      if (Array.isArray(data) && data.length === 0) {
        // seed if empty
        await fetch(`${BASE}/api/templates/seed`, { method: 'POST' })
        const r2 = await fetch(`${BASE}/api/templates`)
        const d2 = await r2.json()
        setTemplates(d2)
      } else {
        setTemplates(data)
      }
    } catch (e) {
      setStatus('Failed to load templates')
    } finally {
      setLoading(false)
    }
  }

  async function search(e) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch(`${BASE}/api/templates?q=${encodeURIComponent(q)}`)
    setTemplates(await res.json())
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <form onSubmit={search} className="flex gap-2">
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search templates"
          className="flex-1 bg-slate-800/60 border border-blue-500/20 text-blue-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="px-3 py-2 bg-blue-600 text-white rounded">Search</button>
        <button type="button" onClick={load} className="px-3 py-2 bg-slate-700 text-white rounded">Reset</button>
      </form>

      {loading ? (
        <p className="text-blue-200">Loading…</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {templates.map(t => (
            <div key={t.id} className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-semibold">{t.title}</h3>
                <button onClick={() => onUseTemplate(t)} className="px-3 py-1 bg-blue-600 text-white rounded">Use</button>
              </div>
              {t.description && <p className="text-blue-200/80 text-sm mb-2">{t.description}</p>}
              <ul className="text-blue-100 text-sm list-disc pl-5 space-y-1">
                {t.exercises?.map((e, i) => (
                  <li key={i}>{e.name} — {e.sets}x{e.reps}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {status && <p className="text-red-300 text-sm">{status}</p>}
    </div>
  )
}
