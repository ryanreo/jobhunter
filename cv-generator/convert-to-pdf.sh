#!/usr/bin/env bash
# Convert all generated CV HTML files to PDF with headless Chrome.
# Chrome cannot write into OneDrive-synced folders, so PDFs are written to
# %TEMP% first, then moved into the cvs tree.
set -e
shopt -s nullglob
CHROME="/c/Program Files/Google/Chrome/Application/chrome.exe"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TMPDIR="${TEMP:-/tmp}"
cd "$ROOT/cvs"
count=0
for html in */Ryan_Osagiede_*_CV_*.html; do
  pdf="${html%.html}.pdf"
  fileurl="file:///$(cygpath -m "$ROOT/cvs/$html")"
  tmppdf="$(cygpath -m "$TMPDIR")/osagiede-cv-$$.pdf"
  "$CHROME" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="$tmppdf" "$fileurl" >/dev/null 2>&1
  mv "$(cygpath -u "$tmppdf")" "$pdf"
  count=$((count+1))
done
echo "converted $count HTML files to PDF"
