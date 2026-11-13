# Gates: Run this Next.js app as a Hostinger Node.js app on supachefs.com

OWNS: README.md, GATES-hostinger.md

Scope: Production build and `npm start` work the way Hostinger runs a Node app, and the README tells the owner exactly what to enter in hPanel. waitlist.supachefs.com is not touched.

- [x] G1: Production build then `npm start` on PORT serves / (200), robots.txt (200) and the security headers
  CHECK: node /private/tmp/claude-503/-Users-juf-Documents-supachefs-supachefs-web/bf47ccc0-37a4-45fb-ab97-7f9ead2d8687/scratchpad/verify-start.mjs
  EXPECT: GATE_OK_START
  EVIDENCE: automatic-evidence=v1; definition-sha256=ecb7153533db0d7233397a90191abb24dbe9aaceb9f43c820131ae096af20dfc; exit=0; EXPECT=matched; output-sha256=8a4ef7bf45d05de870672878c24e137e50362344ceeb91fe984ae28542dc2c92; output-bytes=14; shell=/bin/sh; cwd=/Users/juf/Documents/supachefs/supachefs-web; path=343cc91cd654/24 entries

- [x] G2: README documents the Hostinger setup (build/start command, Node version, every env var, DNS, waitlist untouched)
  CHECK: node -e "const t=require('fs').readFileSync('README.md','utf8'); const need=['Hostinger','npm run build','npm start','Node.js 22','API_BASE_URL','waitlist.supachefs.com']; const miss=need.filter(n=>!t.includes(n)); if(miss.length){console.error(miss);process.exit(1)} console.log('GATE_OK_README')"
  EXPECT: GATE_OK_README
  EVIDENCE: automatic-evidence=v1; definition-sha256=14818e4f7433b5c814d3459cc70a9b674d076e39d252641e00c271a6f3310c3d; exit=0; EXPECT=matched; output-sha256=0ca363b5e8630a6b74f084237194b945a2bc73038239bb0bae0b99e403b7bd84; output-bytes=15; shell=/bin/sh; cwd=/Users/juf/Documents/supachefs/supachefs-web; path=343cc91cd654/24 entries

- [x] G3: Lint, types and unit tests stay green
  CHECK: npm run lint >/dev/null && npx tsc --noEmit && npm test >/dev/null && echo GATE_OK_CHECKS
  EXPECT: GATE_OK_CHECKS
  EVIDENCE: automatic-evidence=v1; definition-sha256=bc393d8821535938a55a9a279c2297088fe2cb3599aeebab3d0636b593e8dd42; exit=0; EXPECT=matched; output-sha256=017ae3bb5a17eb3d75e96fe848b7e9bf55bbf8b43ca2096bdf84ff651903f5b3; output-bytes=15; shell=/bin/sh; cwd=/Users/juf/Documents/supachefs/supachefs-web; path=343cc91cd654/24 entries

- [ ] G4: supachefs.com serves the Next.js site over HTTPS and waitlist.supachefs.com still serves the waitlist (needs the owner's hPanel steps and the production API URL)
  EVIDENCE: pending
