# Internship Job Search & Tracker

> An AI-powered job-hunting assistant that searches Kenyan job boards for
> internships matching Ryan Osagiede's target roles, matches each posting to a
> role-tailored CV, tracks everything in a Google Sheet + local ledger, sends
> applications, watches for replies, and pings WhatsApp when something happens.

## Target roles (each has a tailored CV)

| Role | CV files (in `cvs/<role>/`) |
|---|---|
| AI Workflow Engineer | `Ryan_Osagiede_AI_Workflow_Engineer_CV_{1page,2page}.pdf` |
| n8n Automation Specialist | `Ryan_Osagiede_n8n_Automation_Specialist_CV_{1page,2page}.pdf` |
| LLM Application Developer | `Ryan_Osagiede_LLM_Application_Developer_CV_{1page,2page}.pdf` |
| AI Automation Engineer | `Ryan_Osagiede_AI_Automation_Engineer_CV_{1page,2page}.pdf` |
| AI Agent Developer | `Ryan_Osagiede_AI_Agent_Developer_CV_{1page,2page}.pdf` |
| Software Developer | `Ryan_Osagiede_Software_Developer_CV_{1page,2page}.pdf` |

CVs are generated from `cv-generator/generate.js` (shared profile + per-role
title/summary/skills emphasis). Regenerate + convert to PDF:

```bash
node jobhunter/cv-generator/generate.js
bash jobhunter/cv-generator/convert-to-pdf.sh   # headless Chrome; writes via %TEMP% (OneDrive quirk)
```

## The n8n workflow (`src/internship-job-search.json`)

```
[Schedule: daily 08:00]
   → [Generate Search Terms] 8 role-mapped queries for MyJobMag
   → [Search MyJobMag] HTTP requests, 3s apart (batch batching)
   → [Parse & Dedupe] regex-parse job listings, skip URLs already in the ledger
   → [Attach CV & Prep Email] map job → role → CV file + email draft
   ├→ [Google Sheets: Append to Tracker]  (DISABLED until OAuth is set up)
   └→ [Compose Notification] → [Notify via WhatsApp (OpenClaw)]  (ExecuteCommand)
```

Status today:
- **Works now:** search → parse → dedupe → CV mapping → WhatsApp notification.
  Verified live: 25 jobs found on first run (incl. "ICT Intern - Software
  Developer @ Amref Kenya"), notification delivered to **+254 758 840 248**.
- **Local ledger:** `data/applications.json` (source of truth until Sheets is
  enabled): every job found, its role, CV, email status, responded status.
- **Google stages:** the Sheets node is built but **disabled** — enable it after
  connecting your Google account (see below).

## Start n8n (important env vars)

```bash
NODE_FUNCTION_ALLOW_BUILTIN="fs,path" NODES_EXCLUDE="[]" n8n start
```

- `NODE_FUNCTION_ALLOW_BUILTIN="fs,path"` — lets the Code nodes read/write the
  data files (n8n v2 blocks `fs` in Code nodes by default).
- `NODES_EXCLUDE="[]"` — re-enables the **Execute Command** node (n8n v2
  disables it by default for security; the WhatsApp notification depends on it).

## To finish the Google Sheets + Gmail stages

1. In the n8n editor, create a **Google OAuth2 credential** (Credentials →
   New → Google OAuth2) and complete the browser sign-in with your Google
   account. Use the same credential for Sheets **and** Gmail.
2. Create a spreadsheet in Google Sheets named **Internship Tracker** with a
   sheet (tab) named **Tracker** and this header row:
   `Date Found | Company | Job Title | URL | Role | CV File | Email | Email Sent | Responded | Status | Notes`
3. Open the workflow, select the **Google Sheets: Append to Tracker** node,
   pick the spreadsheet + tab, map the columns, and **enable** the node.
4. (Next build) add the Gmail send node (attach the role CV PDF, send the
   drafted email, mark `Email Sent` in Sheets) and the reply-monitor workflow
   that scans Gmail for responses and flips `Responded` — each change pings
   WhatsApp automatically.

## Outcome tracking (the funnel)

Every job in the ledger carries a `status` so the hunt is measurable, not just
automated: `found → applied → replied → interview → offer → closed`.

Move applications through the funnel with the helper script:

```bash
node scripts/update-application.js stats                     # funnel overview
node scripts/update-application.js JOB-617206-0 applied      # by ledger ID
node scripts/update-application.js <url> interview "Stage 1" # by URL + note
```

The `Status` and `Notes` columns in the Google Sheet mirror the same funnel.
See [docs/outcome-tracking.md](docs/outcome-tracking.md) for the full guide —
including what to do with the numbers when replies stall.

## Notes & honest limitations

- **Job sources:** only **MyJobMag** is wired in v1 (it's server-rendered and
  scrape-friendly). Fuzu + BrighterMonday embed JSON in their pages and are the
  documented next extension. Kenya's market for these exact titles is thin —
  some queries legitimately return 0.
- **No direct emails:** MyJobMag postings use online application forms, not
  public emails, so v1 tracks "found" jobs and notifies you; the auto-send
  stage only applies to postings that expose an apply email.
- **OpenClaw gateway:** WhatsApp notifications need the OpenClaw gateway
  running (`openclaw gateway` / the Windows Hub app). Re-install the scheduled
  task with `openclaw gateway install` after a reboot if notifications stop.

## Files

```
jobhunter/
├── cvs/<role>/            ← 12 generated CVs (1-page + 2-page per role)
├── cv-generator/          ← generate.js + convert-to-pdf.sh + check-pages.js
├── data/applications.json ← local application ledger
├── docs/outcome-tracking.md ← the application funnel guide
├── scripts/update-application.js ← move jobs through the funnel
└── src/internship-job-search.json ← the n8n workflow
```
