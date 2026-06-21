# Tailor CV

Paste a job posting and your background — get a fit score, a tailored cover letter or cold email grounded only in your resume, and an honest list of the requirements you don't yet meet.

**Live:** `https://tailor-livid-sigma.vercel.app` · **Stack:** Next.js · Vercel · LLM via one server route (JSON mode)

---

### What it is, and how to run it
A single-screen web app: paste a posting + your background, hit **Tailor application**, and get three things — a 0–100 fit score, a requirement-by-requirement evidence map, and a gaps list — plus a ready-to-send draft. To run:

```bash
git clone https://github.com/fiqriardiansyah/tailor && cd tailor
npm install
# create .env file and add LLM_API_KEY (free tier from OpenRouter https://openrouter.ai/)
npm run dev                     # http://localhost:3000
```

### Who it's for, and the one job
For job seekers especially developers, applying to several roles a week. The one job: turn a posting and your real background into a draft you'd actually send, and show how well you genuinely fit before you do.

### Why this problem, and how I know it's worth solving
Tailoring each application is the highest-leverage step and the first one people skip; generic letters get ignored. I know because I'm job-hunting right now (this take-home included), and the default workflow is paste the posting into ChatGPT (clunky and quietly invents experience you don't have).

### What's already out there, and why I built this anyway
ChatGPT/Claude directly, and a handful of AI cover-letter sites. They either fabricate qualifications or bury the truth in flattery a recruiter can smell. Tailor CV grounds every claim in your resume, surfaces requirements you *can't* support instead of papering over them, and derives the fit score from that breakdown, so the number can never contradict what's on screen.

### What's in scope, what I left out, and why
**In:** posting + background inputs, fit score, requirement→evidence map (with must-have / nice-to-have tags), gaps list, cover-letter / cold-email toggle, copy/edit, download pdf.
**Out:** accounts, saved history, an application tracker, PDF upload/parsing, scraping postings from a URL, multi-variant drafts. Each one adds a *second* job or a fragile surface; the one job ships cleaner and more reliably without them.

### Where I didn't have answers, and what I assumed
I assumed English input/output, and that the user has resume text ready to paste. The fit score weights must-haves double and scores strong/partial/missing, my guess at how a recruiter reads it, but unvalidated. I used a free LLM tier whose terms allow training on inputs: fine for a demo, but real users with private resumes would need a paid, no-training tier.

### Three questions I'd ask a real user
1. Last time you applied somewhere, what did you actually do — paste into ChatGPT, write from scratch, or skip the letter?
2. Would you send this draft with light edits, or rewrite it anyway — and what would make you trust it?
3. Is the gap-check helpful or discouraging — does it sharpen your application, or make you not apply?

### How I'd know it's working, and what's next
**Working:** drafts sent with only minor edits, people coming back for a second posting, the gap-check changing what they emphasize. **Next:** PDF upload, save/compare drafts, URL import of a posting, Bahasa Indonesia output, and streaming the draft as it writes.
