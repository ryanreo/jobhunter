#!/usr/bin/env node
// Update the application ledger as a job moves through the funnel.
//
// Usage:
//   node scripts/update-application.js stats
//   node scripts/update-application.js <id-or-url> <status> [note]
//
// Statuses: found -> applied -> replied -> interview -> offer -> closed
// "closed" means the application is no longer active (rejected, expired,
// or withdrawn) and can carry an optional note explaining why.

const fs = require('fs');
const path = require('path');

const LEDGER = path.join(__dirname, '..', 'data', 'applications.json');
const STATUSES = ['found', 'applied', 'replied', 'interview', 'offer', 'closed'];
const RANK = Object.fromEntries(STATUSES.map((s, i) => [s, i]));

function loadLedger() {
  if (!fs.existsSync(LEDGER)) return [];
  try {
    return JSON.parse(fs.readFileSync(LEDGER, 'utf8'));
  } catch (e) {
    console.error('Could not read ledger:', e.message);
    process.exit(1);
  }
}

function saveLedger(ledger) {
  fs.writeFileSync(LEDGER, JSON.stringify(ledger, null, 2) + '\n');
}

function stats(ledger) {
  const counts = Object.fromEntries(STATUSES.map((s) => [s, 0]));
  for (const job of ledger) {
    const status = job.status || 'found';
    counts[status] = (counts[status] ?? 0) + 1;
  }
  console.log('Application funnel');
  console.log('------------------');
  for (const s of STATUSES) console.log(`${s.padEnd(10)} ${counts[s]}`);
  console.log('------------------');
  console.log(`total tracked: ${ledger.length}`);
}

function findJob(ledger, key) {
  return ledger.find((j) => j.id === key || j.url === key);
}

function main() {
  const [cmd, status, note] = process.argv.slice(2);
  const ledger = loadLedger();

  if (cmd === 'stats') {
    stats(ledger);
    return;
  }

  if (!cmd || !status) {
    console.error('Usage: node scripts/update-application.js <id-or-url> <status> [note]');
    console.error('       node scripts/update-application.js stats');
    process.exit(1);
  }

  if (!STATUSES.includes(status)) {
    console.error(`Unknown status "${status}". Valid: ${STATUSES.join(', ')}`);
    process.exit(1);
  }

  const job = findJob(ledger, cmd);
  if (!job) {
    console.error(`No application found with id or URL: ${cmd}`);
    process.exit(1);
  }

  const prev = job.status || 'found';
  if (RANK[status] < RANK[prev]) {
    console.warn(`Note: moving ${job.id} backwards (${prev} -> ${status}). Continuing anyway.`);
  }

  job.status = status;
  job.updatedAt = new Date().toISOString();
  if (note) {
    job.notes = job.notes || [];
    job.notes.push({ at: job.updatedAt, text: note });
  }
  saveLedger(ledger);

  console.log(`${job.id} [${prev} -> ${status}] ${job.title} @ ${job.company || 'unknown company'}`);
  if (note) console.log(`  note: ${note}`);
}

main();
