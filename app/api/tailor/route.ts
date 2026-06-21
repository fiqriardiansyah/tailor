type Status = 'strong' | 'partial' | 'missing'
type Importance = 'must_have' | 'nice_to_have'

export interface TailorResponse {
  requirements: { text: string; evidence: string; status: Status, importance: Importance }[]
  draft: string
  gaps: string[]
  fitScore: number
}

const SYSTEM_PROMPT = `You help a job applicant write a tailored, honest application. You are given a job
posting and the applicant's background (résumé text, bullets, or notes). Produce a
draft they could send with only light edits.

HARD RULES
- Use ONLY facts present in the applicant's background. Never invent or assume
  employers, titles, dates, metrics, tools, or skills. If it isn't in the background,
  they don't have it.
- No flattery or filler ("I'm excited to apply", "I'm a perfect fit"). Lead with
  specific, relevant evidence.
- If a posting requirement has no support in the background, do NOT paper over it —
  record it as a gap and never claim it in the draft.
- Keep the draft tight: ~150–220 words. Plain, confident, specific.
- When extracting each requirement, also classify its importance as "must_have"
  or "nice_to_have", based on the posting's language: words like required,
  must, essential, minimum → must_have; preferred, bonus, plus, nice to have → nice_to_have.
- Do NOT output a fit score yourself. Only classify status and importance.

STEPS
1. Extract 5–8 key requirements/must-haves from the posting.
2. For each, find the strongest matching evidence in the background and rate it:
   "strong" (direct evidence), "partial" (transferable/adjacent), or "missing" (none).
3. Write the draft in the requested tone. tone="cover_letter" → a short cover letter;
   tone="cold_email" → a brief direct outreach email that starts with a "Subject:" line.
   Reference only "strong" and "partial" evidence.
4. List every "missing" requirement plainly.

OUTPUT
Return ONLY valid JSON. No markdown, no code fences, no commentary. Exact shape:
{
  "requirements": [
    { "text": "<requirement>", "evidence": "<evidence from background, or empty>", "status": "strong" | "partial" | "missing", "importance": "must_have" | "nice_to_have" }
  ],
  "draft": "<the letter or email>",
  "gaps": ["<unsupported requirement in plain language>"]
}`

function stripCodeFences(text: string): string {
  return text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/, '')
    .trim()
}

export async function POST(request: Request) {
  const { posting, background, tone } = await request.json()

  const promptTone = tone === 'cold-email' ? 'cold_email' : 'cover_letter'

  const userMessage = `tone="${promptTone}"

JOB POSTING:
${posting}

APPLICANT BACKGROUND:
${background}`

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.LLM_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'openai/gpt-4o-mini',
      temperature: 0.2,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
    }),
  })

  if (!res.ok) {
    return new Response(JSON.stringify({ error: `LLM API error ${res.status}` }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const data = await res.json()
  const raw = data.choices?.[0]?.message?.content ?? ''
  const result: TailorResponse = JSON.parse(stripCodeFences(raw))

  const statusValue: Record<Status, number> = { strong: 1, partial: 0.5, missing: 0 }
  const importanceWeight: Record<Importance, number> = { must_have: 2, nice_to_have: 1 }
  let weightedSum = 0
  let totalWeight = 0
  for (const req of result.requirements) {
    const w = importanceWeight[req.importance] ?? 1
    weightedSum += statusValue[req.status] * w
    totalWeight += w
  }
  result.fitScore = totalWeight > 0 ? Math.round((weightedSum / totalWeight) * 100) : 0

  return Response.json(result)
}
