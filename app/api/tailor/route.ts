type Status = 'strong' | 'partial' | 'missing'

export interface TailorResponse {
  requirements: { text: string; evidence: string; status: Status }[]
  draft: string
  gaps: string[]
}

export async function POST(request: Request) {
  await request.json()

  const result: TailorResponse = {
    draft: `Dear Hiring Team,

I'm writing to express my strong interest in the Senior Software Engineer role. My four years of hands-on TypeScript work, combined with production experience building full-stack applications with Next.js and React, aligns closely with what you're looking for.

At my current company I led a full migration of our monolith to a TypeScript-first microservices architecture, cutting runtime errors by 60%. I've also set up CI/CD pipelines using GitHub Actions and deployed services to AWS — both areas your posting highlights.

I'd love to bring this background to your team. Thank you for your consideration.

Best regards`,
    requirements: [
      {
        text: '5+ years TypeScript experience',
        evidence:
          'Led TS migration at Acme Corp; 4 years full-time TypeScript across 3 production codebases.',
        status: 'strong',
      },
      {
        text: 'React and Next.js proficiency',
        evidence:
          'Built 3 production Next.js apps; open-source contributions to React component libraries.',
        status: 'strong',
      },
      {
        text: 'CI/CD pipeline experience',
        evidence:
          'Set up GitHub Actions workflows for 2 projects; no Jenkins or CircleCI experience.',
        status: 'partial',
      },
      {
        text: 'AWS or GCP cloud platforms',
        evidence: 'Used AWS S3 and Lambda in side projects; no GCP; no deep infra ownership.',
        status: 'partial',
      },
      {
        text: 'Team leadership — managing direct reports',
        evidence: 'No direct people-management experience mentioned in background.',
        status: 'missing',
      },
    ],
    gaps: [
      'No mention of managing direct reports or engineering-lead responsibilities.',
      'Cloud experience is limited to basic AWS services; no production GCP or deep infra work.',
    ],
  }

  return Response.json(result)
}
