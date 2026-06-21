'use client'

import { useState } from 'react'

type Mode = 'cover-letter' | 'cold-email'

export default function TailorForm() {
  const [mode, setMode] = useState<Mode>('cover-letter')

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-xl font-semibold tracking-tight text-gray-900">tailor</h1>

        {/* Input form */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-800">
              Job posting
            </label>
            <textarea
              rows={6}
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
              placeholder="Paste your résumé or a few bullet points about your experience…"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y"
            />
          </div>

          {/* Mode toggle */}
          <div
            role="group"
            aria-label="Output type"
            className="inline-flex gap-1 p-1 bg-gray-100 rounded-lg"
          >
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

          <button
            type="button"
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Generate
          </button>
        </div>

        {/* Results */}
        <div className="space-y-3">
          <ResultSection title="Your draft" />
          <ResultSection title="Requirements → your evidence" />
          <ResultSection title="Gaps" />
        </div>
      </div>
    </div>
  )
}

function ResultSection({ title }: { title: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100">
        <h2 className="text-sm font-medium text-gray-700">{title}</h2>
      </div>
      <div className="flex items-center justify-center px-5 py-10">
        <span className="text-sm text-gray-300 select-none">—</span>
      </div>
    </div>
  )
}
