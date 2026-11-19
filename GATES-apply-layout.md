# Gates: apply section fills and pins its left column

OWNS: src/app/become-a-chef/page.tsx, src/features/chef-lead/form.tsx

Scope: On /become-a-chef the left column of the apply section gains a kitchen-visit photo and three reassurance points, and stays pinned beside the form on desktop. The duplicate "We'll text you within 3 days" line under the button is removed. The form still validates and submits as before.

- [x] G1: Types and lint are clean
  CHECK: npx tsc --noEmit && npx eslint src/app/become-a-chef src/features/chef-lead && echo GATE_OK_TYPES
  EXPECT: GATE_OK_TYPES
  EVIDENCE: automatic-evidence=v1; definition-sha256=c86fc3f9d1a473149913fbfe3542fd99839f894034ad84fbaf2bf600be82306b; exit=0; EXPECT=matched; output-sha256=3750c016acead8092a69dd21ae3ab32654bff0d6148df4635891a927850b1ad0; output-bytes=14; shell=/bin/sh; cwd=/Users/juf/Documents/supachefs/supachefs-web; path=0c180dc49cbe/26 entries

- [x] G2: Unit tests pass
  CHECK: npx vitest run src/features/chef-lead src/components/blocks && echo GATE_OK_UNIT
  EXPECT: GATE_OK_UNIT
  EVIDENCE: automatic-evidence=v1; definition-sha256=aa607e0a9c24bc54d54a2abca8a2292a2a68009cb815253499ec951a81c01654; exit=0; EXPECT=matched; output-sha256=935e34953f0a308f825fcbca0bd349af1370400076ceb3539b33dd584fdf7da2; output-bytes=247; shell=/bin/sh; cwd=/Users/juf/Documents/supachefs/supachefs-web; path=0c180dc49cbe/26 entries

- [x] G3: Become a Chef e2e passes (form validation and submit paths intact)
  CHECK: npx playwright test -g "Become a Chef" && echo GATE_OK_E2E
  EXPECT: GATE_OK_E2E
  EVIDENCE: automatic-evidence=v1; definition-sha256=5527205018a2462de9f5ce856bb5c1cd7356a5aabe51d17648a6f42f4646b922; exit=0; EXPECT=matched; output-sha256=39881d327f65544f09ae6f7ed681b93570bdbb11bfdea85b7dfa6bea7c331869; output-bytes=3322; shell=/bin/sh; cwd=/Users/juf/Documents/supachefs/supachefs-web; path=0c180dc49cbe/26 entries

- [x] G4: The left column is pinned, has the photo and the three points, and the duplicate line is gone
  CHECK: node -e "const fs=require('fs');const p=fs.readFileSync('src/app/become-a-chef/page.tsx','utf8'),f=fs.readFileSync('src/features/chef-lead/form.tsx','utf8');const ok=/lg:sticky/.test(p)&&/trust-and-safety\.jpg/.test(p)&&/A 10-minute form/.test(p)&&/We text you within 3 days/.test(p)&&/No commitment/.test(p)&&!/text you within 3 days\. Applying/.test(f);console.log(ok?'GATE_OK_LAYOUT':'LAYOUT_MISSING');process.exit(ok?0:1)"
  EXPECT: GATE_OK_LAYOUT
  EVIDENCE: automatic-evidence=v1; definition-sha256=cedf82ecd4a2136adc0c8a67aca180c82167a37fd38b8213ae9d135438c4e722; exit=0; EXPECT=matched; output-sha256=b0fde17c9944927edc854a37aac8b20c017c5eb766f95bf37c075b387bc5ac07; output-bytes=15; shell=/bin/sh; cwd=/Users/juf/Documents/supachefs/supachefs-web; path=0c180dc49cbe/26 entries
