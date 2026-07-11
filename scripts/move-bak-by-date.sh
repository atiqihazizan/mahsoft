#!/usr/bin/env bash
# Pindah semua *.bak ke backup/ dan susun ikut tarikh cipta fail (YYYY-MM-DD)
set -e
cd "$(dirname "$0")/.."
ROOT="$(pwd)"

# Kumpul senarai penuh dahulu supaya jangan proses fail yang baru dipindah
list=$(mktemp)
find "$ROOT" -name "*.bak" -type f > "$list" 2>/dev/null || true

while IFS= read -r abspath; do
  [ -z "$abspath" ] || [ ! -f "$abspath" ] && continue
  # Path relatif dari root projek (buang leading ./)
  rel="${abspath#$ROOT/}"
  rel="${rel#./}"
  [ -z "$rel" ] && continue

  # Tarikh cipta (macOS: %B = birth, Linux: %W = birth, fallback %Y = mtime)
  birth=$(stat -f %B "$abspath" 2>/dev/null || stat -c %W "$abspath" 2>/dev/null || stat -c %Y "$abspath" 2>/dev/null)
  if [ -z "$birth" ]; then
    datefolder="unknown"
  else
    datefolder=$(date -r "$birth" +%Y-%m-%d 2>/dev/null || date -d "@$birth" +%Y-%m-%d 2>/dev/null || echo "unknown")
  fi

  destdir="$ROOT/backup/$datefolder"
  dest="$destdir/$rel"
  mkdir -p "$(dirname "$dest")"

  # Jangan overwrite atau pindah ke diri sendiri
  if [ "$abspath" != "$dest" ]; then
    mv "$abspath" "$dest" 2>/dev/null || true
  fi
done < "$list"
rm -f "$list"
echo "Selesai: semua .bak telah dipindah ke backup/YYYY-MM-DD/"
