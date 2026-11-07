---
name: i18n-sync
description: Use when pluralisation, inflection or locale resources change in the Genario frontend, or to audit i18n resources.
---

# i18n / Pluralization Sync

Arguments: `$ARGUMENTS` - optional scope. Defaults to full audit.

Read `AGENTS.md` first.

## Current Policy

i18next is not the default translation layer for every new UI string. Use this
command for existing locale-backed text, explicit i18n tasks, pluralization,
inflection, or fixing locale resource drift.

Do not convert ordinary inline UI text into translation keys without a concrete
reason.

## Workflow

1. Read:
   - `public/locales/en/translation.json`
   - `public/locales/ru/translation.json`
2. Compare keys recursively and report structure mismatches.
3. Add missing keys to both locales with accurate text when those keys are still
   needed.
4. Search components only when the task is about an existing i18n area or
   pluralization/inflection.
5. Run:

```bash
pnpm i18n:resources
pnpm lint:typescript
```

Never edit `src/globals/i18next-resources.d.ts` manually.

Pluralization keys may use `_one`, `_few`, `_many`, and `_other`.

## Reference Examples

- English resources: `public/locales/en/translation.json`.
- Russian resources: `public/locales/ru/translation.json`.
- Generated resource types: `src/globals/i18next-resources.d.ts`.
- Existing usage pattern: `rg -n "useTranslation|t\\(" src`.
