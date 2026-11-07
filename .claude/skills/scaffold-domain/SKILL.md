---
name: scaffold-domain
description: Use when creating the folders of a new domain in the Genario frontend.
---

# Scaffold New Domain

Arguments: `$ARGUMENTS` - domain name in kebab-case.

Read `AGENTS.md` first.

## Workflow

1. Pick 2 similar existing domains and inspect their structure.
2. Create only folders/files that are needed for the current task. Avoid empty
   scaffolding unless the next implementation step requires it.
3. Use:
   - `src/actions/<domain>/hooks/` for business hooks
   - `src/features/<domain>/` for reusable domain UI
   - `src/widgets/<domain>/` for composite blocks
   - `src/entrypoints/<page>/` only when there is a page
4. Add the new domain to `AGENTS.md` only after real code exists there.

Ask the user before creating a domain structure that does not match existing
local domains or requires a new custom abstraction.

Forms belong in widgets. Reusable non-form display components may go to
features; widget orchestration and `withForm` children must not.

## Verify

```bash
pnpm lint:fix
pnpm lint:typescript
```
