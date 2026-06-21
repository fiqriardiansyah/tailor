'use client'

import { useState } from 'react'
import type { TailorResponse } from '@/app/api/tailor/route'

type Mode = 'cover-letter' | 'cold-email'
type Status = 'strong' | 'partial' | 'missing'

const STATUS_STYLES: Record<Status, string> = {
  strong: 'bg-green-100 text-green-700',
  partial: 'bg-amber-100 text-amber-700',
  missing: 'bg-red-100 text-red-700',
}

export default function TailorForm() {
  const [mode, setMode] = useState<Mode>('cover-letter')
  const [posting, setPosting] = useState('')
  const [background, setBackground] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<TailorResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleGenerate() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ posting, background, tone: mode }),
      })
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      setResult(await res.json())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-xl font-semibold tracking-tight text-gray-900">tailor</h1>

        {/* Input form */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-800">Job posting</label>
            <textarea
              rows={6}
              value={posting}
              onChange={(e) => setPosting(e.target.value)}
              placeholder="Paste the job description here…"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-800">
              Your background{' '}
              <span className="font-normal text-gray-400">(résumé, bullets, notes)</span>
            </label>
            <textarea
              rows={6}
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              placeholder="Paste your résumé or a few bullet points about your experience…"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y"
            />
          </div>

          {/* Mode toggle */}
          <div role="group" aria-label="Output type" className="inline-flex gap-1 p-1 bg-gray-100 rounded-lg">
            {(['cover-letter', 'cold-email'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`px-4 py-1.5 text-sm rounded-md transition-all ${
                  mode === m
                    ? 'bg-white text-gray-900 shadow-sm font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {m === 'cover-letter' ? 'Cover letter' : 'Cold email'}
              </button>
            ))}
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-indigo-400 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            {loading ? 'Generating…' : 'Generate'}
          </button>
        </div>

        {/* Results */}
        <div className="space-y-3">
          {/* Draft */}
          <ResultCard title="Your draft">
            {result ? (
              <pre className="px-5 py-4 text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">
                {result.draft}
              </pre>
            ) : (
              <EmptyState />
            )}
          </ResultCard>

          {/* Requirements */}
          <ResultCard title="Requirements → your evidence">
            {result ? (
              <ul className="divide-y divide-gray-100">
                {result.requirements.map((req, i) => (
                  <li key={i} className="px-5 py-3.5 flex gap-3 items-start">
                    <span
                      className={`mt-0.5 shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[req.status]}`}
                    >
                      {req.status}
                    </span>
                    <div className="min-w-0 space-y-0.5">
                      <p className="text-sm font-medium text-gray-800">{req.text}</p>
                      <p className="text-sm text-gray-500">{req.evidence}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState />
            )}
          </ResultCard>

          {/* Gaps */}
          <ResultCard title="Gaps">
            {result ? (
              result.gaps.length > 0 ? (
                <ul className="px-5 py-4 space-y-2.5">
                  {result.gaps.map((gap, i) => (
                    <li key={i} className="flex gap-2.5 text-sm text-gray-700">
                      <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-red-400" />
                      {gap}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-5 py-4 text-sm font-medium text-green-700">
                  No gaps — strong match!
                </p>
              )
            ) : (
              <EmptyState />
            )}
          </ResultCard>
        </div>
      </div>
    </div>
  )
}

function ResultCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100">
        <h2 className="text-sm font-medium text-gray-700">{title}</h2>
      </div>
      {children}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex items-center justify-center px-5 py-10">
      <span className="text-sm text-gray-300 select-none">—</span>
    </div>
  )
}
