#!/usr/bin/env bash
# Enforces the safety contract in README.md: no payload may reach the network,
# read cookies or storage, capture input, or execute dynamic code.
#
# Only executable content is scanned. Comments, and the prose on the landing
# page describing the APIs these payloads avoid, are excluded so that
# documenting a banned API does not read as using one.
#
# Run before every commit.
set -uo pipefail
cd "$(dirname "$0")"

FILES=(p.js a.js t.js c.js m.js x.svg f.html index.html)
BANNED='fetch\(|XMLHttpRequest|sendBeacon|WebSocket|EventSource|\beval\(|new Function|document\.cookie|localStorage|sessionStorage|indexedDB|navigator\.clipboard|serviceWorker|\.submit\(|onkeydown|onkeyup|onkeypress'

# Reduce a file to the code a browser would actually run.
executable_parts() {
  case "$1" in
    *.html)
      # <script> bodies, on*= handlers, and javascript: URIs only.
      perl -0777 -ne '
        while (/<script\b[^>]*>(.*?)<\/script>/gsi) { print "$1\n" }
        while (/\son[a-z]+\s*=\s*(["\x27])(.*?)\1/gsi) { print "$2\n" }
        while (/javascript:([^"\x27>]*)/gi) { print "$1\n" }
      ' "$1"
      ;;
    *)
      cat "$1"
      ;;
  esac | perl -0777 -pe 's{/\*.*?\*/}{}gs; s{<!--.*?-->}{}gs; s{^\s*//.*$}{}gm'
}

fail=0
for f in "${FILES[@]}"; do
  [ -f "$f" ] || { echo "MISSING  $f"; fail=1; continue; }
  if hits=$(executable_parts "$f" | grep -nEi "$BANNED"); then
    echo "FAIL     $f"
    echo "$hits" | sed 's/^/           /'
    fail=1
  else
    echo "ok       $f"
  fi
done

# index.html loads p.js for its live demo; no payload may pull in remote code.
if grep -nE '\.src\s*=' p.js a.js t.js c.js m.js >/dev/null 2>&1; then
  echo "FAIL     a payload assigns .src (possible remote load)"
  fail=1
fi

if [ "$fail" -eq 0 ]; then
  echo
  echo "Safety contract holds across ${#FILES[@]} files."
else
  echo
  echo "Safety contract VIOLATED. Do not publish."
fi
exit "$fail"
