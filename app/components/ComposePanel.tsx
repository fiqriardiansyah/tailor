import { ScissorsIcon } from './icons'
import type { Mode } from './types'

interface Props {
  posting: string
  background: string
  mode: Mode
  loading: boolean
  error: string | null
  errors: { posting?: string; background?: string }
  onPostingChange: (value: string) => void
  onBackgroundChange: (value: string) => void
  onModeChange: (mode: Mode) => void
  onGenerate: () => void
}

export function ComposePanel({
  posting, background, mode, loading, error, errors,
  onPostingChange, onBackgroundChange, onModeChange, onGenerate,
}: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-amber-600 mb-1">Compose</p>
        <h1 className="text-xl font-bold text-gray-900">Tailor an application</h1>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-800">Job posting</label>
          <span className="text-xs text-gray-400">paste the listing</span>
        </div>
        <textarea
          rows={6}
          value={posting}
          onChange={e => onPostingChange(e.target.value)}
          placeholder="Paste the job description here…"
          className={`w-full rounded-xl border px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y ${errors.posting ? 'border-red-400' : 'border-gray-200'}`}
        />
        {errors.posting && <p className="text-xs text-red-500">{errors.posting}</p>}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-800">Your background</label>
          <span className="text-xs text-gray-400">résumé, bullets, notes</span>
        </div>
        <textarea
          rows={6}
          value={background}
          onChange={e => onBackgroundChange(e.target.value)}
          placeholder="Paste your résumé or a few bullet points about your experience…"
          className={`w-full rounded-xl border px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y ${errors.background ? 'border-red-400' : 'border-gray-200'}`}
        />
        {errors.background && <p className="text-xs text-red-500">{errors.background}</p>}
      </div>

      <div role="group" aria-label="Output type" className="flex gap-1 p-1 bg-gray-100 rounded-xl">
        {(['cover-letter', 'cold-email'] as const).map(m => (
          <button key={m} type="button" onClick={() => onModeChange(m)}
            className={`flex-1 py-2 text-sm rounded-lg transition-all ${
              mode === m ? 'bg-white text-gray-900 shadow-sm font-medium' : 'text-gray-500 hover:text-gray-700'
            }`}>
            {m === 'cover-letter' ? 'Cover letter' : 'Cold email'}
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div>
        <button type="button" onClick={onGenerate} disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white py-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
          {loading ? (
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <ScissorsIcon className="w-4 h-4 text-white" />
          )}
          {loading ? 'Generating…' : 'Tailor application'}
        </button>
        <p className="mt-2 text-xs text-center text-gray-400">
          Scores your fit and writes a grounded draft — only from what's in your background.
        </p>
      </div>
    </div>
  )
}
