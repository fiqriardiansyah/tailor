export function FitScoreGauge({ score }: { score: number }) {
  const cx = 80, cy = 80, r = 56
  const circumference = 2 * Math.PI * r
  const arcDeg = 270
  const trackLen = (arcDeg / 360) * circumference
  const gapLen = circumference - trackLen
  const fillLen = (score / 100) * trackLen
  const rotation = 135

  const color = score >= 75 ? '#4f46e5' : score >= 50 ? '#f59e0b' : '#ef4444'
  const bandLabel = score >= 75 ? 'Strong match' : score >= 50 ? 'Partial match' : 'Weak match'
  const bandLabelColor = score >= 75 ? '#4f46e5' : score >= 50 ? '#d97706' : '#dc2626'

  const numTicks = 32
  const ticks = Array.from({ length: numTicks }, (_, i) => {
    const deg = rotation + (i / (numTicks - 1)) * arcDeg
    const rad = (deg * Math.PI) / 180
    const r1 = r + 8, r2 = r + 14
    return {
      x1: cx + r1 * Math.cos(rad), y1: cy + r1 * Math.sin(rad),
      x2: cx + r2 * Math.cos(rad), y2: cy + r2 * Math.sin(rad),
    }
  })

  return (
    <div className="relative shrink-0" style={{ width: 160, height: 160 }}>
      <svg width={160} height={160} viewBox="0 0 160 160">
        {ticks.map((t, i) => (
          <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
            stroke="#e5e7eb" strokeWidth="2" strokeLinecap="round" />
        ))}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#ebebeb" strokeWidth="9"
          strokeDasharray={`${trackLen} ${gapLen}`} strokeLinecap="round"
          transform={`rotate(${rotation} ${cx} ${cy})`} />
        {score > 0 && (
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="9"
            strokeDasharray={`${fillLen} ${circumference - fillLen}`} strokeLinecap="round"
            transform={`rotate(${rotation} ${cx} ${cy})`} />
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 pointer-events-none">
        <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Fit score</span>
        <div className="flex items-end leading-none gap-[1px]">
          <span className="text-[32px] font-bold text-gray-900 leading-none">{score}</span>
          <span className="text-base font-bold text-gray-600 leading-none pb-[2px]">%</span>
        </div>
        <span className="text-[10px] font-semibold" style={{ color: bandLabelColor }}>{bandLabel}</span>
      </div>
    </div>
  )
}
