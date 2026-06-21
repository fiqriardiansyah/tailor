'use client'

import { useState, useRef, useEffect } from 'react'
import { EditIcon, CopyIcon, DownloadIcon } from './icons'

interface Props {
  draftText: string
  draftLabel: string
  editingDraft: boolean
  copied: boolean
  isCoverLetter: boolean
  onToggleEdit: () => void
  onCopy: () => void
  onDraftChange: (text: string) => void
}

export function DraftPanel({ draftText, draftLabel, editingDraft, copied, isCoverLetter, onToggleEdit, onCopy, onDraftChange }: Props) {
  const [showPdfModal, setShowPdfModal] = useState(false)
  const [pdfFileName, setPdfFileName] = useState('')
  const [generatingPdf, setGeneratingPdf] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (showPdfModal) {
      setPdfFileName(localStorage.getItem('pdfFileName') ?? '')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [showPdfModal])

  function handlePdfFileNameChange(value: string) {
    setPdfFileName(value)
    localStorage.setItem('pdfFileName', value)
  }

  async function handleDownloadPdf() {
    const name = pdfFileName.trim()
    if (!name) return
    setGeneratingPdf(true)
    try {
      const { jsPDF } = await import('jspdf')

      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pageW = doc.internal.pageSize.getWidth()
      const pageH = doc.internal.pageSize.getHeight()
      const marginX = 22
      const marginTop = 28
      const marginBottom = 22
      const usableW = pageW - 2 * marginX
      const lineH = 6
      const emptyLineH = 3

      function addAccentLine() {
        doc.setFillColor(245, 158, 11)
        doc.rect(0, 0, pageW, 1.8, 'F')
      }

      addAccentLine()
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10.5)
      doc.setTextColor(31, 41, 55)

      let y = marginTop
      for (const para of draftText.split('\n')) {
        if (para.trim() === '') {
          y += emptyLineH
          continue
        }
        for (const line of doc.splitTextToSize(para, usableW)) {
          if (y > pageH - marginBottom) {
            doc.addPage()
            addAccentLine()
            y = marginTop
          }
          doc.text(line, marginX, y)
          y += lineH
        }
      }

      doc.save(name.endsWith('.pdf') ? name : `${name}.pdf`)
      setShowPdfModal(false)
    } finally {
      setGeneratingPdf(false)
    }
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-amber-600 mb-0.5">Your draft</p>
            <h2 className="text-lg font-bold text-gray-900">{draftLabel}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onToggleEdit}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg transition-colors">
              <EditIcon className="w-3.5 h-3.5" />
              {editingDraft ? 'Done' : 'Edit'}
            </button>
            <button type="button" onClick={onCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg transition-colors">
              <CopyIcon className="w-3.5 h-3.5" />
              {copied ? 'Copied!' : 'Copy'}
            </button>
            {isCoverLetter && (
              <button type="button" onClick={() => setShowPdfModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg transition-colors">
                <DownloadIcon className="w-3.5 h-3.5" />
                PDF
              </button>
            )}
          </div>
        </div>
        <div className="border border-gray-100 rounded-xl m-5 overflow-hidden">
          {editingDraft ? (
            <textarea
              value={draftText}
              onChange={e => onDraftChange(e.target.value)}
              rows={16}
              className="w-full px-5 py-4 text-sm text-gray-700 leading-relaxed resize-y focus:outline-none font-sans"
            />
          ) : (
            <pre className="px-5 py-4 text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
              {draftText}
            </pre>
          )}
        </div>
      </div>

      {showPdfModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) setShowPdfModal(false) }}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
            <h3 className="text-base font-bold text-gray-900 mb-1">Save as PDF</h3>
            <p className="text-sm text-gray-500 mb-4">Enter a filename for your cover letter.</p>
            <input
              ref={inputRef}
              type="text"
              value={pdfFileName}
              onChange={e => handlePdfFileNameChange(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleDownloadPdf()
                if (e.key === 'Escape') setShowPdfModal(false)
              }}
              placeholder="e.g. Cover Letter - Google"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 mb-4"
            />
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setShowPdfModal(false)}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg transition-colors">
                Cancel
              </button>
              <button type="button" onClick={handleDownloadPdf}
                disabled={!pdfFileName.trim() || generatingPdf}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                <DownloadIcon className="w-3.5 h-3.5" />
                {generatingPdf ? 'Generating…' : 'Download PDF'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
