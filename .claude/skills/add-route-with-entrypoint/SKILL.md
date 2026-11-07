---
name: add-route-with-entrypoint
description: Add or change TanStack Router routes in the Genario frontend while keeping route files route-focused and moving page composition into src/entrypoints. Use for new pages, route guards, search params, redirects, preloaders, and route tree changes.
---

# Add Route With Entrypoint

Use this skill for route additions or route behavior changes. Read `AGENTS.md`
and `src/routes/README.md` first.

## Why This Workflow Exists

TanStack file routes are easy to overfill with UI and business logic. In this
project, routes own navigation concerns only. Keeping page composition in
entrypoints makes route tree generation predictable and keeps domain behavior
testable through widgets/actions.

## Step 1: Inspect Existing Routes

Read 2-3 route files in the same layout group and their entrypoints. Check:

- path naming;
- search schema style;
- redirect behavior;
- query preloading pattern;
- entrypoint component naming.

If the route needs a guard, loader, or layout composition pattern not present in
local references, ask the user before implementing it.

## Step 2: Choose The Layout Group

| Scenario                                    | Folder                                         |
| ------------------------------------------- | ---------------------------------------------- |
| Requires session and active subscription    | `src/routes/_with-auth/_with-subscription/`    |
| Requires session but no active subscription | `src/routes/_with-auth/_without-subscription/` |
| Sign-in or OTP flow                         | `src/routes/_auth/`                            |
| Public page                                 | `src/routes/_without-auth/`                    |

If the route needs page UI, create or update
`src/entrypoints/<page>/component.tsx`.

## Step 3: Keep Route Files Focused

Route files may contain:

- `createFileRoute(...)`;
- route-local search schemas and exported search types;
- `beforeLoad` guards, redirects, and `ensureQueryData` preloading;
- route-level loader logic when it is truly route-specific;
- imported entrypoint component references.

Route files must not define page JSX, widgets, domain components, or business
hooks.

## Step 4: Example Shape

```typescript
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";

import { MyPageComponent } from "@/entrypoints/my-page/component";
import { z } from "@/lib/zod";

const searchSchema = z.object({
  q: z.string().optional(),
});

export type MyPageSearch = z.infer<typeof searchSchema>;

export const Route = createFileRoute("/_with-auth/_with-subscription/my-page")({
  validateSearch: zodValidator(searchSchema),
  beforeLoad: async ({ context }) => {
    // route-level preload only if needed
  },
  component: MyPageComponent,
});
```

## Step 5: Verify

Run after adding, removing, moving, or renaming route files:

```bash
pnpm router:generate
pnpm lint:fix
pnpm lint:typescript
```

Never edit `src/codegen/router/route-tree.gen.ts` manually.

## Reference Examples

- Route with search params:
  `src/routes/_with-auth/_with-subscription/scenarios/$scenarioId.tsx`.
- Route with settings search:
  `src/routes/_with-auth/_with-subscription/ideas-lists/settings.tsx`.
- Entrypoint with memoized dynamic body:
  `src/entrypoints/scenario/component.tsx`.
