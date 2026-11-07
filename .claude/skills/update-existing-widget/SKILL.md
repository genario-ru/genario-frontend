---
name: update-existing-widget
description: Make focused changes to existing Genario frontend widgets while preserving FSD boundaries. Use when modifying widget UI, local widget behavior, widget hooks, forms, dialogs, drawers, lists, or widget integration with action hooks.
---

# Update Existing Widget

Use this skill for focused changes under `src/widgets/**`. Read `AGENTS.md`
first.

## Why This Workflow Exists

Widgets are where UI, local interaction, action hooks, dialogs, drawers, and
lists often meet. They are easy to over-refactor. The goal is to make the
requested change while preserving the existing widget structure and keeping API
behavior in actions.

## Step 1: Understand The Existing Widget

Before editing, read:

1. the widget main component under
   `src/widgets/<domain>/<widget>/components/`;
2. local hooks under `src/widgets/<domain>/<widget>/hooks/`, if present;
3. schemas/types/utils/constants colocated with the widget;
4. action hooks imported from `src/actions/<domain>/hooks/`;
5. similar sibling widgets if the local pattern is unclear.

## Step 2: Put The Change In The Right Place

| Change                                                         | Location                 |
| -------------------------------------------------------------- | ------------------------ |
| Class names, markup, layout, small conditional rendering       | Widget component         |
| Local interaction state, derived state, handlers, navigation   | Widget hook              |
| API call, mutation callback, cache invalidation, business rule | Action hook              |
| Reusable domain display component                              | `src/features/<domain>/` |
| Generic primitive or utility                                   | `src/shared/**`          |

Do not move code between layers unless the requested change requires it.
Ask the user before introducing a new composition pattern, custom abstraction,
or significant layer move.

## Step 3: Preserve Local Conventions

- Keep filenames and export style consistent with sibling files.
- Use `cn()` for conditional class names.
- Use `useAppForm` for forms.
- Keep `withForm` subcomponents, form schemas, form types, and form helpers in
  the owning widget.
- Use `z` from `@/lib/zod`.
- Use action hooks for generated network behavior.
- Do not add i18n keys for ordinary new UI text by default. Use locale files
  only in existing i18n-backed areas, explicit i18n tasks, or
  pluralization/inflection cases.

Generated types, schemas, and query keys may be imported where contract data is
needed. Avoid adding direct generated network hook calls inside widget UI.

Do not add routine request `try/catch` in widget code. GET states come from
TanStack Query flags; mutation effects use `onSuccess`/`onError` callbacks.

Keep widget components render-focused. Use `useMemo` for dynamic body/layout
content, `useCallback` for handlers, and colocated hooks for non-trivial logic.
Prefer flat props/params and one object parameter.

When touching loading states, skeletons, mobile row actions, delete flows, or
cross-page navigation, match local precedent:

- compose child skeleton exports; use `ItemsList` for repeated skeleton items;
- extract named boolean variables for complex conditions;
- use `SwipeActions` with `hideActions` on touch; confirm delete via
  `Dialog`/`Drawer`;
- use `AppMenubar` tabs for related pages;
- for edit forms, use `createFormMatchValidateFn`, `form.SubmitButton`, and
  `formApi.reset(value)` after save.

## Step 4: Verify

- Locale JSON changed intentionally for existing i18n/pluralization:
  `pnpm i18n:resources`.
- TypeScript/React changed: `pnpm lint:fix` and `pnpm lint:typescript`.
- Route files changed as part of the widget task: `pnpm router:generate`.

Final response should mention the widget files changed, local references read,
and validation commands run.

## Reference Examples

- Widget component with memoized slots:
  `src/widgets/scenario/scenario-app-menubar/components/scenario-app-menubar.tsx`.
- Widget hook:
  `src/widgets/scenario/scenario-app-menubar/hooks/use-scenario-app-menubar.ts`.
- Per-call mutation callback:
  `src/widgets/scenario/scenario-app-menubar/hooks/use-scenario-app-menubar-save.ts`.
- Widget-owned form:
  `src/widgets/profile-settings-general/components/profile-settings-general-form.tsx`.
- Reusable feature component:
  `src/features/templates/template-card/components/template-card.tsx`.
