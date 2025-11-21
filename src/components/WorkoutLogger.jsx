import { useEffect, useMemo, useState } from 'react'

const BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function WorkoutLogger({ template }) {
  const [title, setTitle] = useState(template?.title || '')
  const [exercises, setExercises] = useState(template?.exercises || [])
  const [userId, setUserId] = useState('demo-user')
  const [status, setStatus] = useState('')
  const today = useMemo(() => new Date().toISOString().slice(0,10), [])

  useEffect(() => {
    setTitle(template?.title || '')
    setExercises(template?.exercises || [])
  }, [template])

  function updateExercise(i, field, value) {
    setExercises(prev => prev.map((e, idx) => idx === i ? { ...e, [field]: value } : e))
  }

  function addExercise() {
    setExercises(prev => [...prev, { name: '', sets: 3, reps: 10, weight: 0 }])
  }

  async function save() {
    setStatus('Saving...')
    try {
      const res = await fetch(`${BASE}/api/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, session_date: today, title, exercises })
      })
      if (!res.ok) throw new Error('Failed to save')
      setStatus('Saved!')
    } catch (e) {
      setStatus('Error saving')
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col md:flex-row gap-3">
        <input value={userId} onChange={e => setUserId(e.target.value)} placeholder="User ID"
          className="bg-slate-800/60 border border-blue-500/20 text-blue-100 rounded px-3 py-2 flex-1" />
        <input value={today} readOnly className="bg-slate-800/60 border border-blue-500/20 text-blue-100 rounded px-3 py-2 w-full md:w-44" />
      </div>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Session Title"
        className="bg-slate-800/60 border border-blue-500/20 text-blue-100 rounded px-3 py-2 w-full" />

      <div className="space-y-2">
        {exercises.map((e, i) => (
          <div key={i} className="grid grid-cols-12 gap-2 bg-slate-800/40 border border-blue-500/20 rounded p-2">
            <input value={e.name} onChange={ev => updateExercise(i, 'name', ev.target.value)} placeholder="Name" className="col-span-4 bg-slate-900/60 text-blue-100 rounded px-2" />
            <input type="number" value={e.sets} onChange={ev => updateExercise(i, 'sets', parseInt(ev.target.value || '0'))} placeholder="Sets" className="col-span-2 bg-slate-900/60 text-blue-100 rounded px-2" />
            <input type="number" value={e.reps} onChange={ev => updateExercise(i, 'reps', parseInt(ev.target.value || '0'))} placeholder="Reps" className="col-span-2 bg-slate-900/60 text-blue-100 rounded px-2" />
            <input type="number" value={e.weight ?? 0} onChange={ev => updateExercise(i, 'weight', parseFloat(ev.target.value || '0'))} placeholder="Weight" className="col-span-2 bg-slate-900/60 text-blue-100 rounded px-2" />
            <button className="col-span-2 bg-red-600 text-white rounded" onClick={() => setExercises(prev => prev.filter((_, idx) => idx !== i))}>Remove</button>
          </div>
        ))}
        <button onClick={addExercise} className="px-3 py-2 bg-slate-700 text-white rounded">Add Exercise</button>
      </div>

      <button onClick={save} className="px-4 py-2 bg-blue-600 text-white rounded">Save Session</button>
      {status && <p className="text-blue-200 text-sm">{status}</p>}
    </div>
  )
}
