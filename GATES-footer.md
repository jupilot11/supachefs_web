# Gates: footer redesign (rounded dark panel, brand gradient, link columns, app badges)

OWNS: src/components/layout/footer.tsx, src/components/layout/footer-lead.tsx, src/components/layout/footer.test.tsx

Scope: The footer is a rounded near-black to deep-orange panel with arcs top-right: wordmark and tagline left, three link columns (customers, chefs, company), a "Get the app" column with store badges, a divider, then legal links, copyright and social links. The /faqs contact prompt still sits at the top of the same panel. No fake newsletter form: the site has no subscribe endpoint.

- [x] G1: Types and lint are clean
  CHECK: npx tsc --noEmit && npx eslint src/components/layout && echo GATE_OK_TYPES
  EXPECT: GATE_OK_TYPES
  EVIDENCE: automatic-evidence=v1; definition-sha256=b255fdaf04720f116f677cbad329f8be39a41835033eff44d456bf6039a7ac38; exit=0; EXPECT=matched; output-sha256=3750c016acead8092a69dd21ae3ab32654bff0d6148df4635891a927850b1ad0; output-bytes=14; shell=/bin/sh; cwd=/Users/juf/Documents/supachefs/supachefs-web; path=0c180dc49cbe/26 entries

- [x] G2: Footer tests pass (columns and badges render, /faqs prompt kept, missing email/social drop out)
  CHECK: npx vitest run src/components/layout && echo GATE_OK_UNIT
  EXPECT: GATE_OK_UNIT
  EVIDENCE: automatic-evidence=v1; definition-sha256=bf90036ff546762c9454d9dc54d8ed6219681d6b009429c1486ef29fbaf1aae6; exit=0; EXPECT=matched; output-sha256=97a5d0be4c31ffe0febcb4b4843a0d932d7ea6628012c536b8e88dd0e2e19884; output-bytes=243; shell=/bin/sh; cwd=/Users/juf/Documents/supachefs/supachefs-web; path=0c180dc49cbe/26 entries

- [x] G3: Rendered footer at 1280 and 390 wide matches the reference layout in brand colours, with no overflow and readable contrast
  EVIDENCE: 2026-11-19 viewed Playwright screenshots of the live dev server at 1280 (/about, /faqs) and 390 (/about): near-black to deep-orange gradient, ember arcs top-right, wordmark and tagline left, four columns (customers, chefs, company, app badges), divider, legal / copyright, /faqs prompt on top of the same panel. documentElement.scrollWidth <= innerWidth at all three. Not checked: iOS badge (dev browser UA showed only Google Play), real devices.
