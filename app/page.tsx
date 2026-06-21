'use client'

import { useState, useEffect } from 'react'
import type { TailorResponse } from '@/app/api/tailor/route'
import { ScissorsIcon } from './components/icons'
import { ComposePanel } from './components/ComposePanel'
import { VerdictPanel } from './components/VerdictPanel'
import { RequirementsList } from './components/RequirementsList'
import { DraftPanel } from './components/DraftPanel'
import { GapsPanel } from './components/GapsPanel'
import { BACKGROUND_KEY, type Mode } from './components/types'

export default function Home() {
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
    await navigator.clipboard.writeText(draftText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleStartOver() {
    setResult(null)
    setPosting('')
    setDraftText('')
    setEditingDraft(false)
    setError(null)
    setErrors({})
  }

  async function handleGenerate() {
    const newErrors: { posting?: string; background?: string } = {}
    if (!posting.trim()) newErrors.posting = 'Job posting is required'
    if (!background.trim()) newErrors.background = 'Background is required'
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
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
      if (!res.ok) throw new Error(`Server error (${res.status}). Please try again.`)
      let data: TailorResponse
      try { data = await res.json() } catch { throw new Error('Unexpected server response. Please try again.') }
      setResult(data)
      setDraftText(data.draft)
      setEditingDraft(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleBackgroundChange(value: string) {
    setBackground(value)
    localStorage.setItem(BACKGROUND_KEY, value)
    setErrors(p => ({ ...p, background: undefined }))
  }

  const gapItems = result?.requirements.filter(r => r.status === 'missing') ?? []
  const draftLabel = mode === 'cover-letter' ? 'Cover letter' : 'Cold email'

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0ede8' }}>
      <header className="bg-[#111111] px-6 py-3 ">
        <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <ScissorsIcon className="w-4 h-4 text-black" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">Tailor CV</p>
            <p className="text-gray-500 text-[10px] uppercase tracking-widest leading-tight">Measured fit, ready to send</p>
          </div>
        </div>
        {result && (
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 text-sm text-white/90">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
              Draft ready
            </span>
            <button
              onClick={handleStartOver}
              className="px-4 py-1.5 text-sm text-white border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
            >
              Start over
            </button>
          </div>
        )}
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-5 p-5 container mx-auto items-start">
        <div className="flex-1 w-full shrink-0 md:sticky top-5">
          <ComposePanel
            posting={posting}
            background={background}
            mode={mode}
            loading={loading}
            error={error}
            errors={errors}
            onPostingChange={v => { setPosting(v); setErrors(p => ({ ...p, posting: undefined })) }}
            onBackgroundChange={handleBackgroundChange}
            onModeChange={setMode}
            onGenerate={handleGenerate}
          />
        </div>

        {result && (
          <div className="flex-1 min-w-0 space-y-4">
            <VerdictPanel fitScore={result.fitScore} requirements={result.requirements} />
            <DraftPanel
              draftText={draftText}
              draftLabel={draftLabel}
              editingDraft={editingDraft}
              copied={copied}
              isCoverLetter={mode === 'cover-letter'}
              onToggleEdit={() => setEditingDraft(v => !v)}
              onCopy={handleCopy}
              onDraftChange={setDraftText}
            />
            <RequirementsList requirements={result.requirements} />
            <GapsPanel gapItems={gapItems} />
          </div>
        )}
      </div>
    </div>
  )
}
