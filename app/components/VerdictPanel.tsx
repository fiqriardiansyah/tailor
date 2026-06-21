import type { TailorResponse } from '@/app/api/tailor/route'
import { FitScoreGauge } from './FitScoreGauge'

function getVerdict(score: number, requirements: TailorResponse['requirements']) {
  const missingMust = requirements.filter(r => r.status === 'missing' && r.importance === 'must_have')
  const missingNice = requirements.filter(r => r.status === 'missing' && r.importance === 'nice_to_have')

  if (score >= 75 && missingMust.length === 0) {
    return {
      headline: 'Strong fit — lead with confidence',
      summary: missingNice.length > 0
        ? "You cover all core requirements directly. A few nice-to-haves are missing but won't block you."
        : 'You cover all requirements directly. Apply with confidence.',
    }
  }
  if (missingMust.length <= 1) {
    const summary = missingMust.length === 1
      ? `You cover most core requirements directly. One must-have (${missingMust[0].text}) has no evidence; the rest are nice-to-haves.`
      : 'You cover most core requirements. Review any partial matches to strengthen your application.'
    return { headline: 'Worth applying — close the must-haves', summary }
  }
  if (missingMust.length <= 3) {
    return {
      headline: 'Possible fit — address the gaps first',
      summary: `${missingMust.length} must-have requirements aren't supported by your background. Consider strengthening these before applying.`,
    }
  }
  return {
    headline: 'Significant gaps — needs preparation',
    summary: "Multiple core requirements aren't covered. Focus on closing must-haves before applying.",
  }
}

interface Props {
  fitScore: number
  requirements: TailorResponse['requirements']
}

export function VerdictPanel({ fitScore, requirements }: Props) {
  const verdict = getVerdict(fitScore, requirements)
  const strongCount = requirements.filter(r => r.status === 'strong').length
  const partialCount = requirements.filter(r => r.status === 'partial').length
  const missingCount = requirements.filter(r => r.status === 'missing').length

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex gap-6 items-center">
      <FitScoreGauge score={fitScore} />
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-widest text-amber-600 mb-1.5">The Verdict</p>
        <h2 className="text-xl font-bold text-gray-900 mb-2">{verdict.headline}</h2>
        <p className="text-sm text-gray-500 mb-4 leading-relaxed">{verdict.summary}</p>
        <div className="flex flex-wrap gap-2">
          {strongCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
              {strongCount} strong
            </span>
          )}
          {partialCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
              {partialCount} partial
            </span>
          )}
          {missingCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 text-red-700 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
              {missingCount} missing
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
