import { useState } from 'react'
import Navbar from './components/Navbar'
import WorkoutTemplates from './components/WorkoutTemplates'
import WorkoutLogger from './components/WorkoutLogger'
import Nutrition from './components/Nutrition'

function App() {
  const [current, setCurrent] = useState('workouts')
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-blue-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>

      <div className="relative max-w-5xl mx-auto p-4 md:p-8 space-y-6">
        <header className="text-center space-y-2">
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Workout & Calorie Tracker</h1>
          <p className="text-blue-200">Log workouts, use prebuilt plans, and track calories with barcode search.</p>
        </header>

        <Navbar current={current} onChange={setCurrent} />

        {current === 'templates' && (
          <section className="space-y-4">
            <h2 className="text-xl text-white font-semibold">Prebuilt Workouts</h2>
            <WorkoutTemplates onUseTemplate={(t) => { setSelectedTemplate(t); setCurrent('workouts') }} />
          </section>
        )}

        {current === 'workouts' && (
          <section className="space-y-4">
            <h2 className="text-xl text-white font-semibold">Workout Logger</h2>
            <WorkoutLogger template={selectedTemplate} />
          </section>
        )}

        {current === 'nutrition' && (
          <section className="space-y-4">
            <h2 className="text-xl text-white font-semibold">Calorie Tracking</h2>
            <Nutrition />
          </section>
        )}

        <footer className="text-center text-blue-300/60 text-sm pt-8">
          Your data is saved securely in a database for persistence.
        </footer>
      </div>
    </div>
  )
}

export default App
