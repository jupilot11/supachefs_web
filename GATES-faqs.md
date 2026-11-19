# Gates: FAQs page matches the rest of the site

OWNS: src/components/blocks/faqs-view.tsx, src/components/blocks/faq-accordion.tsx, src/app/faqs/**

Scope: /faqs uses the same white hero (eyebrow, 56px headline, button-pair tabs), white cards on a warm-grey section, and the inset orange closing band as the other pages. Tabs, search, Start here, topic links and JSON-LD keep working.

- [x] G1: Types and lint are clean
  CHECK: npx tsc --noEmit && npx eslint src/components/blocks/faqs-view.tsx src/components/blocks/faq-accordion.tsx src/app/faqs && echo GATE_OK_TYPES
  EXPECT: GATE_OK_TYPES
  EVIDENCE: automatic-evidence=v1; definition-sha256=0b4605bf9aedeb8b5aa6e224cd4a572603724ba8885d26b95f92f7bb78da334b; exit=0; EXPECT=matched; output-sha256=3750c016acead8092a69dd21ae3ab32654bff0d6148df4635891a927850b1ad0; output-bytes=14; shell=/bin/sh; cwd=/Users/juf/Documents/supachefs/supachefs-web; path=0c180dc49cbe/26 entries

- [x] G2: Unit tests pass
  CHECK: npx vitest run src/components/blocks && echo GATE_OK_UNIT
  EXPECT: GATE_OK_UNIT
  EVIDENCE: automatic-evidence=v1; definition-sha256=3f2ab9111398c3f5e3daa0307d642991f562afda2c07ddbe4b0da72e28514d0b; exit=0; EXPECT=matched; output-sha256=131d380a19137985a73ca01a05843c1f3e1f6badb409650af6b43c6fdaa4e8a7; output-bytes=245; shell=/bin/sh; cwd=/Users/juf/Documents/supachefs/supachefs-web; path=0c180dc49cbe/26 entries

- [x] G3: FAQs e2e passes (hash tab, topic link, search, Start here)
  CHECK: npx playwright test -g "/faqs" && echo GATE_OK_E2E
  EXPECT: GATE_OK_E2E
  EVIDENCE: automatic-evidence=v1; definition-sha256=4981a7c9649608045d1e616997250714e24603fa3659b95620d74f9cb73ba7ff; exit=0; EXPECT=matched; output-sha256=23155d12c8e1693deadaae50220ebec42c8658241a50fe8969bc74babb5fbf7c; output-bytes=2820; shell=/bin/sh; cwd=/Users/juf/Documents/supachefs/supachefs-web; path=0c180dc49cbe/26 entries

- [x] G4: The loud one-off styling is gone from the FAQs source
  CHECK: node -e "const s=require('fs').readFileSync('src/components/blocks/faqs-view.tsx','utf8')+require('fs').readFileSync('src/components/blocks/faq-accordion.tsx','utf8');if(/bg-orange-dark text-white|bg-charcoal|112px|data-open:bg-orange-dark/.test(s)){console.log('STILL_LOUD');process.exit(1)}console.log('GATE_OK_CLEAN')"
  EXPECT: GATE_OK_CLEAN
  EVIDENCE: automatic-evidence=v1; definition-sha256=064a8def2da6f2305a21edd1b4d59c37caa9bfb5a44ffddf6af54b77e7f337c5; exit=0; EXPECT=matched; output-sha256=1d38fffab6860d890fc2da4ad8142104b9f91471793852a6f3bded39bb3bc240; output-bytes=14; shell=/bin/sh; cwd=/Users/juf/Documents/supachefs/supachefs-web; path=0c180dc49cbe/26 entries
