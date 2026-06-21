'use client'

import { useState, useEffect } from 'react'
import type { TailorResponse } from '@/app/api/tailor/route'

const BACKGROUND_KEY = 'tailor-background'

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
  const [errors, setErrors] = useState<{ posting?: string; background?: string }>({})
  const [copied, setCopied] = useState(false)
  const [draftText, setDraftText] = useState('')
  const [editingDraft, setEditingDraft] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(BACKGROUND_KEY)
    if (saved) setBackground(saved)
  }, [])

  async function handleCopy() {
    if (!result) return
    await navigator.clipboard.writeText(draftText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleGenerate() {
    const newErrors: { posting?: string; background?: string } = {}
    if (!posting.trim()) newErrors.posting = 'Job posting is required'
    if (!background.trim()) newErrors.background = 'Background is required'
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setErrors({})
    setLoading(true)
    setError(null)
    try {
      let res: Response
      try {
        res = await fetch('/api/tailor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ posting, background, tone: mode }),
        })
      } catch {
        throw new Error('Network error — check your connection and try again.')
      }
      if (!res.ok) {
        throw new Error(`The server returned an error (${res.status}). Please try again.`)
      }
      let data: TailorResponse
      try {
        data = await res.json()
      } catch {
        throw new Error('Unexpected response from the server. Please try again.')
      }
      setResult(data)
      setDraftText(data.draft)
      setEditingDraft(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6">
      <h1 className="text-xl font-semibold tracking-tight mb-5 text-gray-900">Tailor CV</h1>
      <div className=" flex mx-auto space-y-6 gap-5">

        {/* Input form */}
        <div className="bg-white flex-1 h-fit sticky top-5 rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-800">Job posting</label>
            <textarea
              rows={6}
              value={posting}
              onChange={(e) => { setPosting(e.target.value); setErrors((p) => ({ ...p, posting: undefined })) }}
              placeholder="Paste the job description here…"
              className={`w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y ${errors.posting ? 'border-red-400' : 'border-gray-300'}`}
            />
            {errors.posting && <p className="text-xs text-red-500">{errors.posting}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-800">
              Your background{' '}
              <span className="font-normal text-gray-400">(résumé, bullets, notes)</span>
            </label>
            <textarea
              rows={6}
              value={background}
              onChange={(e) => { setBackground(e.target.value); localStorage.setItem(BACKGROUND_KEY, e.target.value); setErrors((p) => ({ ...p, background: undefined })) }}
              placeholder="Paste your résumé or a few bullet points about your experience…"
              className={`w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y ${errors.background ? 'border-red-400' : 'border-gray-300'}`}
            />
            {errors.background && <p className="text-xs text-red-500">{errors.background}</p>}
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
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            {loading && (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            {loading ? 'Generating…' : 'Generate'}
          </button>
        </div>

        {/* Results */}
        <div className="space-y-3 flex-1">
          {/* Draft */}
          <ResultCard
            title="Your draft"
            action={
              result && (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingDraft((v) => !v)}
                    className="text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {editingDraft ? 'Done' : 'Edit'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              )
            }
          >
            {result ? (
              editingDraft ? (
                <textarea
                  value={draftText}
                  onChange={(e) => setDraftText(e.target.value)}
                  rows={20}
                  className="w-full px-5 py-4 text-sm text-gray-800 font-sans leading-relaxed resize-y focus:outline-none"
                />
              ) : (
                <pre className="px-5 py-4 text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">
                  {draftText}
                </pre>
              )
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

function ResultCard({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-700">{title}</h2>
        {action}
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
