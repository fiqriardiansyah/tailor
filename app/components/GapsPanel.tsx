import type { TailorResponse } from '@/app/api/tailor/route'
import { ImportanceBadge } from './RequirementsList'

interface Props {
  gapItems: TailorResponse['requirements']
}

export function GapsPanel({ gapItems }: Props) {
  if (gapItems.length === 0) return null

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 pt-5 pb-4 border-b border-gray-50">
        <p className="text-[11px] font-bold uppercase tracking-widest text-rose-500 mb-1">Gaps to close</p>
        <h2 className="text-lg font-bold text-gray-900">Requirements with no evidence yet</h2>
        <p className="text-sm text-gray-400 mt-0.5">Add a line for any of these that's actually true before you apply.</p>
      </div>
      <ul className="divide-y divide-gray-50 px-2 py-2">
        {gapItems.map((gap, i) => (
          <li key={i} className="flex items-center gap-3 px-4 py-3">
            <div className="w-6 h-6 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
              <span className="text-rose-400 text-sm font-bold leading-none select-none">+</span>
            </div>
            <span className="flex-1 text-sm text-gray-700">{gap.text}</span>
            <ImportanceBadge importance={gap.importance} />
          </li>
        ))}
      </ul>
    </div>
  )
}
