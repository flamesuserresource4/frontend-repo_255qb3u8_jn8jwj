import { Dumbbell, Utensils, Library } from 'lucide-react'

export default function Navbar({ current, onChange }) {
  const items = [
    { key: 'workouts', label: 'Workouts', icon: Dumbbell },
    { key: 'templates', label: 'Templates', icon: Library },
    { key: 'nutrition', label: 'Nutrition', icon: Utensils },
  ]

  return (
    <div className="flex items-center justify-center gap-3 p-3 bg-slate-900/60 sticky top-0 backdrop-blur z-10">
      {items.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
            current === key
              ? 'bg-blue-600 text-white border-blue-500'
              : 'bg-slate-800/60 text-blue-100 border-blue-500/20 hover:border-blue-400/50'
          }`}
        >
          <Icon size={18} />
          <span className="text-sm font-medium">{label}</span>
        </button>
      ))}
    </div>
  )
}
