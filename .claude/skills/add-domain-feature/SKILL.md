---
name: add-domain-feature
description: Add or expand Genario frontend domain functionality across actions, features, widgets, or entrypoints. Use when creating domain hooks, presentational domain UI, composite widgets, forms, or page-level composition in this FSD React app.
---

# Add Domain Feature

Use this skill for domain work that changes app behavior or UI. Read
`AGENTS.md` and `src/README.md` first.

## Why This Workflow Exists

Generated API names are noisy and can change after schema regeneration. Route
files should not accumulate product logic. Shared/lib should stay reusable. This
workflow keeps generated contracts behind action hooks, keeps page composition
in entrypoints, and keeps domain UI in features/widgets where future agents can
find it.

## Step 1: Classify The Change

Choose the narrowest correct layer:

| Change                                                                       | Location                                      |
| ---------------------------------------------------------------------------- | --------------------------------------------- |
| API/query/mutation orchestration, cache invalidation, mutation callbacks     | `src/actions/<domain>/hooks/use-<name>.ts`    |
| Reusable domain UI with data passed by props                                 | `src/features/<domain>/<feature>/components/` |
| Complex domain block with local state, action hooks, dialogs, drawers, lists | `src/widgets/<domain>/<widget>/`              |
| Page-level layout that wires widgets/features together                       | `src/entrypoints/<page>/component.tsx`        |
| URL, search params, guards, redirects, route preloading                      | `src/routes/**`                               |

Do not create a new layer folder just because a task mentions a domain. First
check whether an existing widget, feature, or action hook should be extended.

## Step 2: Inspect Local References

Before writing files, inspect at least 3 similar files in the target layer.
Prefer same-domain examples.

Examples:

- new profile action hook: inspect `src/actions/profiles/hooks/**`;
- new scenario widget subform: inspect nearby `src/widgets/scenario-settings/**`;
- new billing display component: inspect `src/features/billing/**` and
  `src/widgets/billing/**`;
- new page composition: inspect 3 files in `src/entrypoints/**`.

Use the references to copy naming, return shapes, hook/component splits, and
import style. Mention the inspected paths in the final response.

If references conflict, the implementation has several viable compositions, or
the task requires a new custom abstraction/pattern, ask the user before coding.

## Step 3: Use Generated API Contracts Correctly

Look in `src/codegen/api/product/**` for existing contracts.

Use generated network hooks inside action hooks:

```typescript
import { useGetApiV1Templates } from "@/codegen/api/product";

export function useGetTemplates() {
  const {
    data: templatesData,
    isLoading: isTemplatesLoading,
    isError: isTemplatesError,
  } = useGetApiV1Templates();

  return { templatesData, isTemplatesLoading, isTemplatesError };
}
```

Generated types, enums, schemas, query keys, and route query options may be used
outside actions when they are API contract data. Avoid new direct generated
network hook calls in widgets/features.

For backend requests:

- GET hooks expose TanStack Query state; do not add `try/catch`.
- Mutation side effects go through `onSuccess`, `onError`, and `onSettled`
  callbacks either in the action hook or in the per-call `mutate` options.
- Do not use `mutateAsync` plus `try/catch` for ordinary UI flows.

## Step 4: Implement With Local Primitives

- Conditional classes: `cn()` from `@/shared/utils/cn`.
- Forms: `useAppForm` from `@/lib/tanstack-form`.
- Form composition: `withForm` from `@/lib/tanstack-form`, kept inside the
  owning widget.
- Validation: `z` from `@/lib/zod`.
- UI primitives: check `src/shared/components/ui/**` before creating new ones.
- Text: do not add i18n keys by default. Use locale JSON only in existing
  i18n-backed areas, explicit i18n tasks, or when pluralization/inflection needs
  i18next.

Keep feature components presentational unless local precedent shows otherwise.
Put local interaction state in widget hooks when it makes the component easier
to read.

Keep components render-focused. Put handlers in `useCallback`, derived
content/collections in `useMemo`, and non-trivial widget logic in colocated
hooks. Prefer flat props/params and pass functions/hooks/components parameters
as a single object.

## UI Patterns To Match Local Precedent

- Skeletons: page/widget composes child skeleton exports; repeated items use
  `ItemsList`.
- Conditions: extract named boolean variables for multi-check logic.
- Mobile rows: `SwipeActions` + `hideActions`; delete confirms via
  `Dialog`/`Drawer`.
- Cross-page navigation: `AppMenubar` tabs, not `NavigationSteps` in body.
- Edit forms: `createFormMatchValidateFn`, `form.SubmitButton`, `reset` after
  save.
- Parallel mutations: shared lifecycle handlers in action hook `useMutation`,
  not only inline `mutate(..., callbacks)`.

## Step 5: Verify

- Locale JSON changed intentionally: run `pnpm i18n:resources`.
- Route files changed: run `pnpm router:generate`.
- TypeScript/React changed: run `pnpm lint:fix` and `pnpm lint:typescript`.
- Build-impacting infrastructure changed: consider `pnpm build`.

Never edit `src/codegen/**` manually.

## Reference Examples

- GET action hook: `src/actions/templates/hooks/use-get-templates.ts`.
- Mutation action hook:
  `src/actions/ideas-lists/hooks/use-create-ideas-list.ts`.
- Widget hook split:
  `src/widgets/scenario/scenario-app-menubar/hooks/use-scenario-app-menubar.ts`
  and
  `src/widgets/scenario/scenario-app-menubar/components/scenario-app-menubar.tsx`.
- Widget-owned form:
  `src/widgets/profile-settings-general/hooks/use-profile-settings-general-form.ts`
  plus `profile-settings-general-form*.tsx` and
  `profile-settings-form-actions.tsx`.
- Presentational feature:
  `src/features/profiles/profile-card/components/profile-card.tsx`.
