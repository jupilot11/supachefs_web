# Gates: chef form client-side validation

OWNS: src/features/chef-lead/**, e2e/site.spec.ts

Scope: The chef application form validates every field in the browser with the shared schema (on blur, and on submit before any server call), while the server stays the source of truth.

- [x] G1: Types and lint are clean
  CHECK: npx tsc --noEmit && npx eslint src/features/chef-lead e2e/site.spec.ts && echo GATE_OK_TYPES
  EXPECT: GATE_OK_TYPES
  EVIDENCE: automatic-evidence=v1; definition-sha256=96512d691a1fd2ce3fae3b989584996a2f4664aa6e819dead1551983f04625a7; exit=0; EXPECT=matched; output-sha256=3750c016acead8092a69dd21ae3ab32654bff0d6148df4635891a927850b1ad0; output-bytes=14; shell=/bin/sh; cwd=/Users/juf/Documents/supachefs/supachefs-web; path=343cc91cd654/24 entries

- [x] G2: Unit tests pass, including the shared form parser
  CHECK: npx vitest run src/features/chef-lead && echo GATE_OK_UNIT
  EXPECT: GATE_OK_UNIT
  EVIDENCE: automatic-evidence=v1; definition-sha256=84764cb37cb3b09cc30d8841a6b534aad324f5255a26f94bac03d60544bcd250; exit=0; EXPECT=matched; output-sha256=3d84338b28830cf22e49ecf7a10aaef0dfa7611a55cd88d58a447a6d0273e62d; output-bytes=243; shell=/bin/sh; cwd=/Users/juf/Documents/supachefs/supachefs-web; path=343cc91cd654/24 entries

- [x] G3: Become a Chef e2e passes (blur errors, invalid submit sends no server action, existing server-error paths intact)
  CHECK: npx playwright test -g "Become a Chef form" && echo GATE_OK_E2E
  EXPECT: GATE_OK_E2E
  EVIDENCE: automatic-evidence=v1; definition-sha256=5ca0b5c7206701f5dcaef3aa8adf0376e38f653670254130cfaa45e30b22841d; exit=0; EXPECT=matched; output-sha256=78e7b30930506a7243f0be4db86572ce722657d8d3e1c8f60cabff0b171aaa8a; output-bytes=2435; shell=/bin/sh; cwd=/Users/juf/Documents/supachefs/supachefs-web; path=343cc91cd654/24 entries
