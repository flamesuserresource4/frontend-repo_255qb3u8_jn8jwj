import { useEffect, useMemo, useRef, useState } from 'react'

const BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Nutrition() {
  const [q, setQ] = useState('')
  const [results, setResults] = useState([])
  const [userId, setUserId] = useState('demo-user')
  const [dateStr, setDateStr] = useState(() => new Date().toISOString().slice(0,10))
  const [logs, setLogs] = useState([])
  const [status, setStatus] = useState('')

  async function search() {
    setStatus('Searching...')
    const res = await fetch(`${BASE}/api/food/search?q=${encodeURIComponent(q)}`)
    const data = await res.json()
    setResults(data.results || [])
    setStatus('')
  }

  async function scanBarcode() {
    const code = prompt('Enter barcode (UPC/EAN) to simulate scanning:')
    if (!code) return
    setStatus('Looking up barcode...')
    const res = await fetch(`${BASE}/api/food/barcode/${code}`)
    const data = await res.json()
    setResults([data])
    setStatus('')
  }

  async function addLog(item) {
    const body = {
      user_id: userId,
      log_date: dateStr,
      meal: 'unspecified',
      item,
      quantity: 1,
    }
    const res = await fetch(`${BASE}/api/food/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    if (res.ok) {
      setStatus('Added!')
      loadLogs()
    }
  }

  async function loadLogs() {
    const res = await fetch(`${BASE}/api/food/logs?user_id=${encodeURIComponent(userId)}&log_date=${dateStr}`)
    const data = await res.json()
    setLogs(data)
  }

  useEffect(() => { loadLogs() }, [userId, dateStr])

  const totals = useMemo(() => {
    return logs.reduce((acc, l) => {
      const q = l.quantity || 1
      acc.calories += (l.item?.calories || 0) * q
      acc.protein += (l.item?.protein || 0) * q
      acc.carbs += (l.item?.carbs || 0) * q
      acc.fat += (l.item?.fat || 0) * q
      return acc
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 })
  }, [logs])

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-2">
        <input value={userId} onChange={e => setUserId(e.target.value)} placeholder="User ID" className="bg-slate-800/60 border border-blue-500/20 text-blue-100 rounded px-3 py-2 flex-1" />
        <input type="date" value={dateStr} onChange={e => setDateStr(e.target.value)} className="bg-slate-800/60 border border-blue-500/20 text-blue-100 rounded px-3 py-2 w-full md:w-44" />
      </div>

      <div className="flex gap-2">
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search foods (OpenFoodFacts)" className="flex-1 bg-slate-800/60 border border-blue-500/20 text-blue-100 rounded px-3 py-2" />
        <button onClick={search} className="px-3 py-2 bg-blue-600 rounded text-white">Search</button>
        <button onClick={scanBarcode} className="px-3 py-2 bg-green-600 rounded text-white">Scan</button>
      </div>

      {status && <p className="text-blue-200 text-sm">{status}</p>}

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h3 className="text-white font-semibold">Results</h3>
          {results.map((r, i) => (
            <div key={i} className="bg-slate-800/60 border border-blue-500/20 rounded p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 font-medium">{r.name} {r.brand ? `• ${r.brand}` : ''}</p>
                  <p className="text-blue-200/80 text-sm">{r.calories} kcal • P {r.protein} • C {r.carbs} • F {r.fat}</p>
                </div>
                <button onClick={() => addLog(r)} className="px-3 py-1 bg-blue-600 rounded text-white">Add</button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <h3 className="text-white font-semibold">Today's Log</h3>
          <div className="bg-slate-800/60 border border-blue-500/20 rounded p-3 space-y-2">
            {logs.map(l => (
              <div key={l.id} className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">{l.item?.name}</p>
                  <p className="text-blue-200/80 text-sm">{(l.item?.calories||0) * (l.quantity||1)} kcal</p>
                </div>
                <span className="text-blue-200 text-xs">x{l.quantity || 1}</span>
              </div>
            ))}
            <div className="border-t border-blue-500/20 pt-2 text-blue-100">
              <p>Total: {Math.round(totals.calories)} kcal • P {Math.round(totals.protein)} • C {Math.round(totals.carbs)} • F {Math.round(totals.fat)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
