# Outcome tracking — the application funnel

Finding jobs is only the first half. Every application should move through a
tracked funnel so you can see what actually converts — and show recruiters a
measured pipeline instead of "I applied to a few places."

## The funnel

Every job in `data/applications.json` carries a `status`:

| Status | Meaning |
|---|---|
| `found` | New posting discovered by the daily search (set automatically) |
| `applied` | Application sent (CV + cover note) |
| `replied` | Got a response — positive or negative |
| `interview` | Invited to an interview (add a note with the stage) |
| `offer` | Offer received |
| `closed` | No longer active: rejected, expired, or withdrawn (note why) |

## Updating the ledger

The workflow sets every new job to `found` automatically. Move a job forward
with the helper script:

```bash
# see the whole funnel at a glance
node scripts/update-application.js stats

# mark a job by its ID (shown in the ledger / WhatsApp message)
node scripts/update-application.js JOB-617206-0 applied

# or by its URL, with a note
node scripts/update-application.js https://www.myjobmag.co.ke/job/... interview "Stage 1: recruiter call"
```

Valid statuses: `found`, `applied`, `replied`, `interview`, `offer`, `closed`.
Each update stamps `updatedAt` and appends optional notes.

## Google Sheets mirror

Once the Sheets node is enabled, use this header row so the funnel maps 1:1:

```
Date Found | Company | Job Title | URL | Role | CV File | Email | Email Sent | Responded | Status | Notes
```

The `Status` and `Notes` columns are the live funnel. Keep the local ledger and
the sheet in sync: update one, then the other, weekly. The local ledger stays
the source of truth until Sheets OAuth is connected.

## What to do with the numbers

- Weekly: run `stats` and log applications sent vs. replies vs. interviews.
- If you send 20+ applications with zero replies, the CV or targeting is the
  problem, not the pipeline — change the role mapping, not the volume.
- The funnel itself is portfolio material: "automated search, 25 jobs found on
  day one, N applications sent, X interviews" is a measured system, which is
  exactly what the jobhunter project is selling.
