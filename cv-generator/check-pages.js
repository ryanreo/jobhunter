#!/usr/bin/env node
// Report page count per PDF by counting page objects in the PDF stream.
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..', 'cvs');
let failed = 0;
for (const dir of fs.readdirSync(root)) {
  for (const f of fs.readdirSync(path.join(root, dir))) {
    if (!f.endsWith('.pdf')) continue;
    const buf = fs.readFileSync(path.join(root, dir, f));
    const s = buf.toString('latin1');
    const pageObjs = (s.match(/\/Type\s*\/Page[^s]/g) || []).length;
    const pages = (s.match(/\/Type\s*\/Pages/g) || []).length;
    const count = Math.max(0, pageObjs - pages);
    if (count === 0) failed++;
    console.log(`${count} page(s)  ${dir}/${f}`);
  }
}
console.log(failed ? `WARNING: ${failed} PDF(s) reported 0 pages` : 'All PDFs have countable page objects');
