import type { TailorResponse } from '@/app/api/tailor/route'
import type { Status, Importance } from './types'

function StatusIcon({ status }: { status: Status }) {
  if (status === 'strong') {
    return (
      <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
        <svg className="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24"
          stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 13l4 4L19 7" />
        </svg>
      </div>
    )
  }
  if (status === 'partial') {
    return (
      <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5 text-amber-600 text-base font-bold select-none">
        ~
      </div>
    )
  }
  return (
    <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
      <svg className="w-3.5 h-3.5 text-red-500" fill="none" viewBox="0 0 24 24"
        stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
  )
}

export function ImportanceBadge({ importance }: { importance: Importance }) {
  return (
    <span className={`inline-flex shrink-0 items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide border ${
      importance === 'must_have'
        ? 'bg-gray-100 text-gray-500 border-gray-200'
        : 'bg-gray-50 text-gray-400 border-gray-100'
    }`}>
      {importance === 'must_have' ? 'Must-have' : 'Nice-to-have'}
    </span>
  )
}

const STATUS_LABEL: Record<Status, { label: string; color: string }> = {
  strong: { label: 'Strong', color: 'text-green-600' },
  partial: { label: 'Partial', color: 'text-amber-500' },
  missing: { label: 'Missing', color: 'text-red-500' },
}

interface Props {
  requirements: TailorResponse['requirements']
}

export function RequirementsList({ requirements }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 pt-5 pb-4 border-b border-gray-100">
        <p className="text-[11px] font-bold uppercase tracking-widest text-amber-600 mb-1">Requirements</p>
        <h2 className="text-lg font-bold text-gray-900">How your background maps</h2>
        <p className="text-sm text-gray-400 mt-0.5">Each posting requirement matched to evidence in your résumé.</p>
      </div>
      <ul className="divide-y divide-gray-50">
        {requirements.map((req, i) => {
          const { label, color } = STATUS_LABEL[req.status]
          return (
            <li key={i} className="px-6 py-4 flex gap-3 items-start">
              <StatusIcon status={req.status} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800">{req.text}</p>
                {req.evidence && (
                  <p className="text-sm text-gray-400 mt-0.5 leading-relaxed">{req.evidence}</p>
                )}
              </div>
              <div className="shrink-0 flex flex-col items-end gap-1.5 ml-2">
                <span className={`text-sm font-semibold ${color}`}>{label}</span>
                <ImportanceBadge importance={req.importance} />
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
