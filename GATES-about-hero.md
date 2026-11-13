# Gates: About hero matches the design, admin CMS drives it

OWNS: src/components/blocks/hero.tsx, src/components/blocks/hero.test.tsx, src/components/blocks/registry.tsx, src/lib/cms/fixtures/pages.json

Scope: The About hero shows the eyebrow, a large two-line headline, then a wide rounded photo slot (peach X tile with a bottom-left "PHOTO · caption" chip when no photo, the real photo with its caption chip when set). The admin CMS (sibling repo ../web: launch seed + hero field labels) describes that photo and caption.

- [x] G1: Types and lint are clean
  CHECK: npx tsc --noEmit && npx eslint src/components/blocks src/lib/cms && echo GATE_OK_TYPES
  EXPECT: GATE_OK_TYPES
  EVIDENCE: automatic-evidence=v1; definition-sha256=06b02a03618985c9695ed087c87cf6e54511240e3cf2ddd421ce237539041f4e; exit=0; EXPECT=matched; output-sha256=3750c016acead8092a69dd21ae3ab32654bff0d6148df4635891a927850b1ad0; output-bytes=14; shell=/bin/sh; cwd=/Users/juf/Documents/supachefs/supachefs-web; path=343cc91cd654/24 entries

- [x] G2: Hero tests pass (banner variant: placeholder tile + PHOTO chip with no image, real photo + plain caption with image, no photo slot for other variants)
  CHECK: npx vitest run src/components/blocks src/lib/cms && echo GATE_OK_UNIT
  EXPECT: GATE_OK_UNIT
  EVIDENCE: automatic-evidence=v1; definition-sha256=2f1b737de13614e9026c6f75d21a6c8ed41d00612ff76b18a11a2aa063ef5291; exit=0; EXPECT=matched; output-sha256=71d9c982a059d601bccd250eee973a5a073b51d7dfd224b79398c9e8697a2bdc; output-bytes=246; shell=/bin/sh; cwd=/Users/juf/Documents/supachefs/supachefs-web; path=343cc91cd654/24 entries

- [x] G3: The About fixture carries the caption and no hero button (primary_cta null), and still parses against the page schema
  CHECK: node -e "const p=require('./src/lib/cms/fixtures/pages.json').about.sections[0].data; if(p.image_caption!=='The team sharing lunch from three different chefs'||p.primary_cta!==null||p.image_url!==null) process.exit(1); console.log('GATE_OK_FIXTURE')"
  EXPECT: GATE_OK_FIXTURE
  EVIDENCE: automatic-evidence=v1; definition-sha256=3c2905ec5ee42fe122825e32ff9e252167ec730281663f19de7595f107b62b59; exit=0; EXPECT=matched; output-sha256=535f6e67c096cab2ab1d8d4fdf243e226e570ac336dd02a0954c03757d97452d; output-bytes=16; shell=/bin/sh; cwd=/Users/juf/Documents/supachefs/supachefs-web; path=343cc91cd654/24 entries

- [x] G4: Laravel seed carries the caption and no button, and the admin API saves the About page (also with a photo URL)
  CHECK: cd ../web && php artisan test --filter="seeded About hero" 2>&1 | grep -E "^ +Tests: +1 passed" | sed 's/.*/GATE_OK_SEED/'
  EXPECT: GATE_OK_SEED
  EVIDENCE: automatic-evidence=v1; definition-sha256=f99a0e0c1bac22d1fae40551f65ca4ec26a57355d4db2b4e20821799e8e713d5; exit=0; EXPECT=matched; output-sha256=eac3967036e651436a3f915a4125609e03beae84caa6d4c867f1083dec8943ef; output-bytes=13; shell=/bin/sh; cwd=/Users/juf/Documents/supachefs/supachefs-web; path=343cc91cd654/24 entries

- [x] G5: The admin editor still typechecks with the new field labels
  CHECK: cd ../web && npx tsc --noEmit -p . && echo GATE_OK_ADMIN_TYPES
  EXPECT: GATE_OK_ADMIN_TYPES
  EVIDENCE: automatic-evidence=v1; definition-sha256=7227ade02e43415f90247e91687b471248d1ddd991a01e70ecd6ceae2f786994; exit=0; EXPECT=matched; output-sha256=20eab65a7109ba545c717b0a731254b869ddb26a5c250d0b0d373e2a621c8e25; output-bytes=185; shell=/bin/sh; cwd=/Users/juf/Documents/supachefs/supachefs-web; path=343cc91cd654/24 entries

- [x] G6: Rendered About page at desktop and phone width looks like the screenshot (eyebrow, two-line headline, wide rounded peach X tile, bottom-left PHOTO chip)
  EVIDENCE: 2026-11-13 viewed Chromium screenshots at 1280 and 390 wide. Placeholder state (fixture, rendered with the site CSS): eyebrow, 2-line headline at 1280, 460px rounded peach tile with X lines, "PHOTO · The team sharing lunch from three different chefs" chip bottom-left. Photo state (live dev server on :3000, real CMS page): eyebrow, 2-line headline, full-width rounded photo. Not shown: web font in the static render (serif fallback), real-font phone wrap.
