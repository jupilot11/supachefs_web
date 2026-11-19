# Gates: the apply section photo is set from the admin and shows in preview and live

OWNS: src/lib/cms/schemas.ts, src/lib/cms/fixtures/pages.json, src/lib/cms/cms.test.ts, src/app/become-a-chef/page.tsx, e2e/site.spec.ts

Scope: The "apply" rich_text section gains an optional image_url. The web side shows that image (draft content too, via the existing preview mode) and falls back to the bundled photo when none is set. The CMS contract change is written down for the admin side.

- [x] G1: Types and lint are clean
  CHECK: npx tsc --noEmit && npx eslint src/lib/cms src/app/become-a-chef e2e/site.spec.ts && echo GATE_OK_TYPES
  EXPECT: GATE_OK_TYPES
  EVIDENCE: automatic-evidence=v1; definition-sha256=0f944e563ee30cea6e5668aacdb107d5c666b1f8dc172cc8a6938dc864f22a83; exit=0; EXPECT=matched; output-sha256=3750c016acead8092a69dd21ae3ab32654bff0d6148df4635891a927850b1ad0; output-bytes=14; shell=/bin/sh; cwd=/Users/juf/Documents/supachefs/supachefs-web; path=0c180dc49cbe/26 entries

- [x] G2: Schema and fixture tests pass, including rich_text with, without and null image_url
  CHECK: npx vitest run src/lib/cms src/components/blocks && echo GATE_OK_UNIT
  EXPECT: GATE_OK_UNIT
  EVIDENCE: automatic-evidence=v1; definition-sha256=fa8a906be9288c72f54601a59a51d22126acab808a1744fd07b06932aee7b081; exit=0; EXPECT=matched; output-sha256=39768865b2bf5b1ff2c4d0221063b42b4a4905b3c4d0248a8197f8ed561674f4; output-bytes=247; shell=/bin/sh; cwd=/Users/juf/Documents/supachefs/supachefs-web; path=0c180dc49cbe/26 entries

- [x] G3: e2e passes, including the apply photo coming from the CMS section
  CHECK: npx playwright test -g "Become a Chef|apply photo" && echo GATE_OK_E2E
  EXPECT: GATE_OK_E2E
  EVIDENCE: automatic-evidence=v1; definition-sha256=5ad06b1b78ad8012623e70167261edcb6040d9fe58dfe1fda0915322555e1026; exit=0; EXPECT=matched; output-sha256=230657d233dac59420e3dd1bdc5cdf42e3c7a34e704babe857da513c5fed4742; output-bytes=3608; shell=/bin/sh; cwd=/Users/juf/Documents/supachefs/supachefs-web; path=0c180dc49cbe/26 entries

- [x] G4: The page reads the photo from the section and the contract is documented
  CHECK: node -e "const fs=require('fs');const p=fs.readFileSync('src/app/become-a-chef/page.tsx','utf8'),r=fs.readFileSync('README.md','utf8');const ok=/intro\.image_url/.test(p)&&/rich_text/.test(r)&&/image_url/.test(r);console.log(ok?'GATE_OK_CONTRACT':'CONTRACT_MISSING');process.exit(ok?0:1)"
  EXPECT: GATE_OK_CONTRACT
  EVIDENCE: automatic-evidence=v1; definition-sha256=35521ab2bb524a0306b8417b80d6c077be653b4e1366a4f47c52165b00eb43dc; exit=0; EXPECT=matched; output-sha256=4b7bd31f7722cf60df104638e06e7c7fe0f4b71faf98aaf2db30706043bcab9a; output-bytes=17; shell=/bin/sh; cwd=/Users/juf/Documents/supachefs/supachefs-web; path=0c180dc49cbe/26 entries
