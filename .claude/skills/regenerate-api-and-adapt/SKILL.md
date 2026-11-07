---
name: regenerate-api-and-adapt
description: Regenerate the Genario frontend Kubb product API output from deps/api/product.json and adapt handwritten code. Use when backend OpenAPI schema changes, generated hooks/types are stale, or TypeScript errors point to changed API contracts.
---

# Regenerate API And Adapt

Use this skill when product API generated code must change. Read `AGENTS.md`
and `kubb.config.ts` first.

## Why This Workflow Exists

`src/codegen/api/product/**` is generated and can be overwritten at any time.
Manual fixes there disappear on the next generation and hide the real contract
change. The stable app-facing boundary is handwritten code: action hooks,
routes, widgets, features, and schemas that consume generated contracts.

## Step 1: Refresh Schema Only When Needed

Run only if the backend schema source must be fetched:

```bash
pnpm api:download
```

If `deps/api/product.json` is already current, skip this step.

## Step 2: Regenerate

```bash
pnpm api:generate
```

Generated output:

```text
src/codegen/api/product/
  clients/
  models/
  tanstack/
  zod/
```

Do not edit any generated file manually.

## Step 3: Review The Contract Change

Check what changed before adapting handwritten code:

- renamed hooks, types, schemas, or query keys;
- changed required params;
- changed request body shape;
- changed response fields;
- removed endpoints;
- new endpoints that replace older local workarounds.

## Step 4: Adapt In Dependency Order

1. `src/actions/**`: update generated imports, params, mutation callbacks, cache
   invalidation, and return shapes.
2. `src/routes/**`: update route-level query options, guards, redirects, and
   preloading.
3. `src/widgets/**` and `src/features/**`: update props, generated contract
   type imports, schemas, and action hook usage.
4. `src/entrypoints/**`: update page wiring only if public component contracts
   changed.

If generated output looks wrong, fix `kubb.config.ts` or
`deps/api/product.json`, then regenerate.

Keep generated network calls behind action hooks. Do not push generated query or
mutation hooks directly into widgets/features while adapting the schema. Do not
replace callback-based mutation handling with `mutateAsync`/`try-catch` unless
the user has approved a custom flow.

## Step 5: Verify

```bash
pnpm lint:fix
pnpm lint:typescript
```

If many generated names changed, expect TypeScript to be the main feedback
loop. Do not silence errors with broad casts.

## Reference Examples

- Kubb configuration: `kubb.config.ts`.
- Generated API root: `src/codegen/api/product/**`.
- GET action wrapper: `src/actions/templates/hooks/use-get-templates.ts`.
- Mutation action wrapper:
  `src/actions/ideas-lists/hooks/use-create-ideas-list.ts`.
- Widget consumer after action boundary:
  `src/widgets/scenario/scenario-app-menubar/hooks/use-scenario-app-menubar.ts`.
