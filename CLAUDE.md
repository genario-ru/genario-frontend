@AGENTS.md

# Claude Code Notes

Use `AGENTS.md` as the shared project contract, but do not stop at reading it.
For any non-trivial code task, inspect the relevant local files before editing.

## Default Task Flow

1. Identify the requested behavior and likely FSD layer.
2. Read the nearest docs:
   - `src/README.md` for placement;
   - `src/routes/README.md` for route work;
   - `kubb.config.ts` for API generation work.
3. Inspect at least 3 similar local implementations before creating new domain
   files.
4. Ask the user before coding if references conflict, several compositions are
   viable, or the task requires a new custom abstraction/pattern/library.
5. Make the smallest change that satisfies the request.
6. Run generators when needed:
   - route files changed -> `pnpm router:generate`;
   - locale JSON changed -> `pnpm i18n:resources`;
   - API schema changed -> `pnpm api:generate`.
7. Run validation for code changes:
   - `pnpm lint:fix`;
   - `pnpm lint:typescript`.

## Frontend-Specific Rules

- Do not use routine request `try/catch` in components, widgets, features, or
  action hooks. GET errors come from TanStack Query state; mutation side effects
  use `onSuccess`/`onError`/`onSettled` callbacks.
- Prefer `mutate` over `mutateAsync`. Use `mutateAsync` only when a real promise
  contract is required.
- Do not `await` backend mutations in widget logic for ordinary flows.
- Keep mutation callback types exact; do not replace available typed callback
  args with `unknown`.
- For consecutive or parallel mutations where every request must trigger the
  same handlers, configure those handlers in the action hook / `useMutation`
  declaration instead of relying only on inline `mutate(..., callbacks)`.
- Keep non-trivial widget logic in colocated hooks. Components should mostly
  render loading/error/empty/success states.
- Use `useMemo` for dynamic body/layout/slot content and derived collections.
- When conditional rendering has more than one branch, extract it into
  `useMemo` with early returns instead of ternaries or boolean branches in JSX.
- For mutually exclusive render states, prefer a single `useMemo` with early
  returns instead of piling boolean branches directly in JSX.
- Use `useCallback` for handlers.
- Avoid inline functions, inline conditional class fragments, and multiline
  ternaries when you can name the value once with a variable, `useCallback`, or
  `useMemo`.
- Do not pass inline ternaries or inline conditions through props or function
  parameters. Name the value in a local variable first. The only exception is
  `className`.
- When a condition combines multiple boolean checks, extract named variables
  instead of nesting parentheses in `if` statements or JSX.
- Do not extract `className` into a variable unless the computed class set is
  reused or significantly improves readability.
- Forms, validators, submit helpers, and normalizers stay in the owning widget,
  but validators and helpers belong in `utils/**`, not inside hook/component
  files.
- Keep features presentational and reusable. Do not move `withForm` children or
  widget orchestration into features.
- Reusable dumb domain UI belongs in `src/features/**`. Generic reusable UI
  primitives belong in `src/shared/components/ui/**` and, for form integration,
  in `src/lib/tanstack-form/components/**`.
- A component file may contain only the main component plus skeletons/plugs.
  Split meaningful child components into separate files.
- Utilities do not live in the same file as hooks or components.
- Prefer state and mutation lifecycle callbacks over `ref`-based orchestration
  when both can solve the same async UI flow.
- If a file needs several meaningful types, move them into a colocated
  `types/**` file.
- Do not use TypeScript type assertions (`as`) unless there is a real
  necessity. Prefer explicit type annotations on declarations and typed
  factories instead of force casts. Do not use `satisfies`.
- Do not add one-line wrapper utilities without real normalization or reuse.
- Do not trim or mutate URL values before rendering previews unless explicitly
  required.
- With `cn()`, use object syntax for dynamic classes.
- Recheck Russian strings for encoding before finishing a change.
- Prefer flat props/params and a single object parameter for functions, hooks,
  and components.
- For list items with their own mutations, use a widget item component plus
  colocated hook instead of parent-level remove/pending callbacks.
- When props differ materially by condition, render the component twice with
  separate prop sets instead of ternary props.
- Use TanStack Query optimistic cache updates in action hooks for immediate
  list feedback; avoid blocking whole upload areas with loading state.
- Page/widget skeletons compose exported child skeletons from the same
  components they render in the success state. Each child exports its skeleton
  from the same file; the page only wires layout.
- For repeated skeleton items, use `ItemsList` from
  `@/shared/components/common/items-list` instead of
  `Array.from({ length }).map(...)`.
- Reusable skeletons/plugs go to `features/**`; widget-only ones export from
  the component file below the main component.
- For edit/update forms, use `createFormMatchValidateFn` on submit validation,
  `form.SubmitButton` for `canSubmit`, and `formApi.reset(value)` after a
  successful update.
- For list/card row actions on touch devices, use `SwipeActions` with
  `hideActions` on the card. Destructive actions open `Dialog` on desktop and
  `Drawer` on mobile before delete.
- For navigation between related pages, prefer `AppMenubar` tabs instead of
  `NavigationSteps` inside page content.
- Widget components with a matching hook should call it directly, not via props.

## Claude-Specific Guidance

- Prefer the project skills in `.claude/skills/**` for repeatable workflows and
  focused reviews.
- Do not add personal machine permissions or local preferences to committed
  project files. Use local settings for that.
