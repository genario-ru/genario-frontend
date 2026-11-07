# AGENTS.md - Genario Frontend

This is the canonical working guide for coding agents in `genario-frontend`.
Tool-specific files may add workflow detail, but they must not contradict this
file.

## Project Snapshot

- React 19 + TypeScript SPA built with Vite.
- Package manager: `pnpm` with `pnpm-lock.yaml`.
- Routing: TanStack Router file routes in `src/routes`.
- Server state: TanStack Query, mostly through Kubb-generated product API hooks.
- Forms: TanStack Form through `useAppForm` from `@/lib/tanstack-form`.
- Styling: Tailwind CSS 4, `cn()` from `@/shared/utils/cn`.
- Validation: Zod via `@/lib/zod`, not direct `zod` imports.
- i18next exists, but it is not the default translation layer at this stage.
  Use locale resources only where the code already uses them or when i18next
  pluralization/inflection is needed.
- API codegen: one OpenAPI schema at `deps/api/product.json`, generated to
  `src/codegen/api/product/**`.

There is no standardized `pnpm test` script. Vitest is installed, but do not
claim test coverage exists unless `package.json` adds a real test command.

## Source Of Truth

Read these before making non-trivial changes:

- `package.json` for exact scripts and dependencies.
- `src/README.md` for architecture and placement.
- `src/routes/README.md` for route file boundaries.
- `kubb.config.ts` for API generation behavior.
- `vite.config.ts` for router generation, PWA, aliases, and plugins.
- `.claude/skills/**` for repeatable agent workflows.

If documentation disagrees with code/config, trust code/config first, then
update the documentation in the same change.

## External Reference Baseline

Use these as general background, not as permission to override local project
rules:

- React: `https://react.dev/reference/react/useMemo`,
  `https://react.dev/reference/react/useCallback`,
  `https://react.dev/learn/you-might-not-need-an-effect`.
- TanStack Query:
  `https://tanstack.com/query/latest/docs/framework/react/guides/queries`,
  `https://tanstack.com/query/latest/docs/framework/react/guides/mutations`.
- TanStack Form:
  `https://tanstack.com/form/latest/docs/framework/react/guides/form-composition`.
- Feature-Sliced Design: `https://fsd.how/docs/reference/layers/`.

## Collaboration Contract

- If implementation details are ambiguous, ask the user instead of guessing.
- If several reasonable implementations exist, present the options and wait for
  the user's decision before writing code.
- If a task appears to require a new custom abstraction, new architectural
  pattern, new library, or a construction not already used in this project,
  agree it with the user first.
- Before adding files or new composition, inspect local references and reuse the
  closest existing structure. Do not invent custom code when a local pattern
  already solves the problem.
- Keep documentation and examples honest. If a referenced local file contains
  mojibake in Russian strings/comments, use it for structure only and do not
  copy broken text. Always rewrite user-facing Russian strings explicitly and
  recheck encoding before finishing.

## Architecture Model

`src/` uses a pragmatic Feature-Sliced Design layout. The point is to keep
change impact predictable:

- routes decide navigation, validation, redirects, and route-level preloading;
- entrypoints compose pages;
- widgets own complex domain UI and local interaction behavior;
- features provide reusable domain UI and small domain helpers;
- actions hide generated API/query/mutation details behind project-level hooks;
- shared/lib stay cross-domain and infrastructure-focused.

| Path                    | Purpose                                                             |
| ----------------------- | ------------------------------------------------------------------- |
| `src/routes`            | TanStack route declarations, guards, search validation, preloaders  |
| `src/entrypoints`       | Page-level composition and layout wiring                            |
| `src/widgets/<domain>`  | Complex domain blocks combining UI and behavior                     |
| `src/features/<domain>` | Reusable domain UI and small domain helpers                         |
| `src/actions/<domain>`  | Business hooks wrapping API/query/mutation behavior                 |
| `src/shared`            | Cross-domain UI, hooks, utils, constants, types                     |
| `src/lib`               | Technical infrastructure: API client, auth, i18n, router, form, zod |
| `src/codegen`           | Generated files, read-only                                          |
| `src/globals`           | Global `.d.ts` declarations                                         |

Default dependency direction:

```text
routes -> entrypoints -> widgets -> features/actions -> shared/lib
```

This is a dependency direction, not a ban on all lateral reuse. The practical
rule is: lower-level or generic code must not depend on higher-level product
composition. If a helper becomes useful across domains, move it down into
`shared` or `lib` only after removing domain assumptions from it.

## Local Reference Map

Use these files as implementation references before creating new patterns.

| Pattern                               | References                                                                                                                                                                                                                                                                                                                                              |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Route with search params              | `src/routes/_with-auth/_with-subscription/scenarios/$scenarioId.tsx`, `src/routes/_with-auth/_with-subscription/ideas-lists/settings.tsx`                                                                                                                                                                                                               |
| Entrypoint with dynamic body/layout   | `src/entrypoints/scenario/component.tsx`, `src/entrypoints/home/component.tsx`                                                                                                                                                                                                                                                                          |
| GET action hook                       | `src/actions/templates/hooks/use-get-templates.ts`, `src/actions/auth/hooks/use-get-session.ts`, `src/actions/scenario/hooks/use-get-scenario.ts`                                                                                                                                                                                                       |
| Mutation action hook with callbacks   | `src/actions/ideas-lists/hooks/use-create-ideas-list.ts`, `src/actions/ideas/hooks/use-save-idea.ts`, `src/actions/onboarding/hooks/use-hide-onboarding.ts`                                                                                                                                                                                             |
| Widget logic hook                     | `src/widgets/scenario/scenario-app-menubar/hooks/use-scenario-app-menubar.ts`, `src/widgets/scenario/scenario-app-menubar/hooks/use-scenario-app-menubar-save.ts`, `src/widgets/billing/billing-my-subscriptions/hooks/use-billing-my-subscriptions-actions.ts`                                                                                         |
| Widget component using memoized slots | `src/widgets/scenario/scenario-app-menubar/components/scenario-app-menubar.tsx`, `src/widgets/home/home-onboarding/components/home-onboarding.tsx`, `src/widgets/credits/credits-usage-list/components/credits-usage-list.tsx`                                                                                                                          |
| Widget-owned TanStack Form            | `src/widgets/profile-settings-general/hooks/use-profile-settings-general-form.ts`, `src/widgets/profile-settings-general/components/profile-settings-general-form.tsx`, `src/widgets/profile-settings-general/components/profile-settings-general-form-fields.tsx`, `src/widgets/profile-settings-general/components/profile-settings-form-actions.tsx` |
| Composed page/widget skeletons        | `src/widgets/profile-settings-references/components/profile-settings-references.tsx`, `src/widgets/profile-settings-general/components/profile-settings-general.tsx`, `src/widgets/profile-settings-references/components/profile-settings-references-section.tsx`                                                                                      |
| AppMenubar cross-route/page tabs      | `src/widgets/billing/billing-app-menubar/components/billing-app-menubar.tsx`, `src/widgets/profile-settings/profile-settings-app-menubar/components/profile-settings-app-menubar.tsx`, `src/widgets/scenario/scenario-app-menubar/components/scenario-app-menubar.tsx`                                                                                  |
| Mobile swipe row actions              | `src/widgets/billing/billing-my-payment-methods/components/billing-my-payment-methods-list-item.tsx`, `src/widgets/profiles/my-profiles-list/components/my-profiles-list.tsx`, `src/widgets/profile-settings-references/components/profile-settings-reference-attachment.tsx`                                                                           |
| Delete dialog/drawer confirmation     | `src/features/billing/billing-my-payment-methods/components/billing-my-payment-method-delete-dialog.tsx`, `src/widgets/profile-settings-references/components/profile-settings-reference-delete-confirmation.tsx`                                                                                                                                       |
| Edit form no-op submit guard          | `src/widgets/profile-settings-general/hooks/use-profile-settings-general-form.ts`, `src/widgets/settings/settings-forms/hooks/use-settings-change-name-form.ts`                                                                                                                                                                                         |
| Reusable presentational feature       | `src/features/profiles/profile-card/components/profile-card.tsx`, `src/features/templates/template-card/components/template-card.tsx`, `src/features/scenario/scenario-chapter/scenario-chapter-status-select/components/scenario-chapter-status-select.tsx`                                                                                            |
| Infrastructure-only `try/catch`       | `src/lib/api/client/index.ts`, `src/shared/utils/parse-json.ts`, `src/shared/utils/copy-element-content.ts`                                                                                                                                                                                                                                             |
| Codegen and router configuration      | `kubb.config.ts`, `vite.config.ts`, `scripts/download-openapi-schemas.ts`, `src/codegen/api/product/**`, `src/codegen/router/route-tree.gen.ts`                                                                                                                                                                                                         |
| i18n resources and generated types    | `public/locales/en/translation.json`, `public/locales/ru/translation.json`, `src/globals/i18next-resources.d.ts`                                                                                                                                                                                                                                        |

## Layer Placement

Use this placement logic before creating files:

1. Is this only a URL/guard/search/preload concern? Put it in `src/routes`.
2. Is this page composition with existing widgets/features? Put it in
   `src/entrypoints`.
3. Does it combine API behavior, local state, and UI for one domain block? Put
   it in `src/widgets/<domain>`.
4. Is it reusable domain UI or a small display helper? Put it in
   `src/features/<domain>`.
5. Is it business orchestration around generated API/query/mutation behavior?
   Put it in `src/actions/<domain>/hooks`.
6. Is it generic UI, a cross-domain hook, or a utility? Put it in `src/shared`.
7. Is it an adapter/configuration around infrastructure or a third-party
   library? Put it in `src/lib`.

When unsure, inspect 3 similar local examples before writing code. Prefer the
same domain; otherwise use nearby domains with the same shape.

## Generated API Usage

`src/codegen/api/product/**` is generated. Never edit it manually.

Prefer this flow for network behavior:

```text
codegen hook -> action hook -> widget/feature/entrypoint usage
```

Allowed imports from generated API outside `actions`:

- types and enums;
- API-derived Zod schemas;
- query keys for invalidation;
- query options in route guards/loaders/preloaders.

Avoid introducing new generated network hook calls directly in widgets or
feature UI. The action layer exists so generated naming, signatures, cache
details, and mutation behavior do not leak through the app.

## Server State And Error Handling

- Do not use `try/catch` in components, widgets, features, or ordinary action
  hooks for backend requests.
- GET requests rely on TanStack Query state (`data`, `isLoading`/`isPending`,
  `isError`, `error`, `refetch`). Render loading/error/empty/success states
  from these fields.
- Mutations handle side effects through callbacks:
  - define common side effects in the action hook's `mutation.onSuccess`,
    `mutation.onError`, and `mutation.onSettled`;
  - use `mutate`, not `mutateAsync`, for ordinary UI flows unless a real
    promise contract is required;
  - do not pair backend mutations with `await`/`try-catch` in widget logic;
  - keep mutation callback typing exact; do not degrade callback args to
    `unknown` when codegen/react-query types already exist;
  - for consecutive or parallel mutations where every request must trigger the
    same lifecycle handlers, configure callbacks in the action hook /
    `useMutation` declaration, not only in inline `mutate(..., { onSuccess })`
    call options, because inline `mutate` callbacks are not reliable for every
    consecutive mutation completion.
- `try/catch` is reserved for foundational infrastructure and utilities such as
  API client normalization, JSON parsing, clipboard/browser APIs, or similar
  non-query boundaries.

## Route Rules

Route files may contain:

- `createFileRoute(...)` and `Route` export;
- route-local search schemas and exported search types;
- guards, redirects, and route-level preloading in `beforeLoad`;
- `loader` logic when the data is truly route-level;
- references to entrypoint components.

Route files must not contain page JSX, domain component implementations, widget
logic, or ad hoc business hooks. Page composition belongs in `src/entrypoints`.

After route file changes, run `pnpm router:generate`.

## Forms, Validation, Styling, And i18n

- Use `useAppForm` from `@/lib/tanstack-form`, not bare `useForm`.
- Forms belong to widgets and widget hooks. Keep `useAppForm`, `withForm`
  subforms, form schemas, form types, and form helpers under the owning widget.
- Form validator factories and reusable submit/normalization helpers belong in
  the widget's `utils/**`, not inside hook files.
- Shared reusable form controls belong in `src/shared/components/ui/**` and, if
  they integrate with TanStack Form, also in `src/lib/tanstack-form/components/**`.
- Do not move `withForm` children into `src/features/**`. Only non-form
  presentational pieces may live in features.
- Use `z` from `@/lib/zod`, not direct imports from `"zod"`.
- Use `cn()` from `@/shared/utils/cn` for conditional class names.
- When using `cn()` for dynamic classes, pass object syntax like
  `cn("base", { "modifier": condition })` instead of boolean `&&` fragments.
- Prefer `src/shared/components/ui/**` primitives before creating new UI.
- Do not convert ordinary new UI text to i18n keys by default.
- Use i18n only when working in an already-i18n area, when the task explicitly
  asks for locale resources, or when i18next pluralization/inflection is useful
  for correct Russian/English word forms.
- Never manually edit `src/globals/i18next-resources.d.ts`; run
  `pnpm i18n:resources` after locale JSON changes.
- For edit/update forms, use `createFormMatchValidateFn` on
  `validators.onSubmit` so unchanged values cannot be saved again after the
  first submit attempt.
- Use `form.SubmitButton` (via `withForm` + `form.AppForm`) so the button
  respects `canSubmit`.
- After a successful update, call `formApi.reset(value)` to refresh the form
  baseline.
- For submit buttons rendered outside the `<form>` element, pass `form={formId}`
  to `form.SubmitButton`.

These rules exist because this project has app-level wrappers for validation
messages, form fields, class merging, and typed locale resources. Bypassing the
wrappers creates inconsistent UI and type drift; overusing i18n creates needless
translation churn.

## React Component And Hook Rules

- Components should primarily render. Put non-trivial local state, handlers,
  derived values, mutation calls, navigation, and data preparation into a
  colocated hook named after the component, for example `useScenarioForm` for
  `ScenarioForm`.
- If a child widget component contains its own non-trivial logic, give it its
  own file and its own hook, for example `ScenarioFormFields` and
  `useScenarioFormFields`.
- Use `useMemo` for dynamic body/layout/slot content and derived collections
  when conditional rendering or calculations would otherwise clutter the
  component body.
- When conditional rendering has more than one branch, extract it into
  `useMemo` with early `if / else` returns instead of stacking ternaries or
  boolean branches directly in JSX.
- When a render branch contains several mutually exclusive UI states, prefer one
  `useMemo` with early `if / else` returns over stacking many boolean branches
  directly in JSX.
- Define callbacks inside components/hooks with `useCallback`; pass stable
  handlers to child components.
- Avoid inline functions, inline conditions, and multiline ternaries in JSX or
  object literals when the value can be named once with a variable,
  `useCallback`, or `useMemo`.
- Do not pass inline ternaries or inline conditions through props or function
  parameters. Name the value in a local variable first. The only exception is
  `className`, where inline `cn()` object syntax is allowed.
- When a condition combines multiple boolean checks, extract named variables
  instead of nesting parentheses in `if` statements or JSX, for example
  `hasOverlayActions` and `shouldShowOverlayActions`.
- Do not move `className` strings into standalone variables unless the value is
  reused or the expression is materially complex enough to improve readability.
- Avoid `useEffect` for actions that can happen imperatively in an event
  handler, mutation callback, router callback, or form submit handler. Use
  `useEffect` only for synchronization with external systems or local library
  integration.
- Keep component files focused. A `.tsx` component file may contain only the
  main component plus its skeletons, plugs, and simple loading/empty states.
  Move meaningful child components into separate files.
- Do not put constants, broad utility logic, validators, or multiple unrelated
  types in component or hook files. Use colocated `constants`, `utils`,
  `types`, or `schemas` folders instead.
- Do not reach for `ref`-driven coordination when ordinary state plus mutation
  lifecycle callbacks can express the same flow clearly.
- If a file needs more than one meaningful local type or shared type aliases,
  move them into a colocated `types/**` file instead of keeping them inside
  `constants` or component files.
- Do not use TypeScript type assertions (`as`) unless there is a real
  necessity, such as narrowing after a validated boundary or working around a
  known third-party typing gap. Prefer explicit type annotations on
  declarations and typed factories instead of force casts. Do not use
  `satisfies`.
- Do not add one-line wrapper utilities that only rename or forward a value
  without real normalization or reuse.
- Do not trim or otherwise mutate URL values before rendering them in `img src`
  or similar preview props unless the task explicitly requires it.
- Feature components should stay presentational and reusable: pass data and
  callbacks in, but keep widget-specific orchestration in widget hooks.
- Reusable dumb presentational domain components belong in `src/features/**`,
  not in widgets. Generic reusable UI primitives belong in
  `src/shared/components/ui/**`.
- Widgets compose features and own complex UI behavior. Do not clutter widgets
  with small reusable display pieces that belong in `features`.
- For lists where each item has its own request/mutation behavior, prefer a
  dedicated widget item component plus colocated hook instead of lifting remove,
  pending, and mutation state to the parent list and passing callbacks like
  `isItemRemoving?.(id)`.
- When one component needs materially different props under a condition, prefer
  rendering it twice with separate prop sets over one call with many ternary
  props.
- Different page or tab layouts need different skeletons. Do not reuse one
  generic skeleton for materially different forms or steps.
- Page and widget loading skeletons should compose exported child skeletons from
  the same components they render in the success state. Do not build one
  monolithic inline skeleton in the page component.
- Each meaningful child component that needs a loading state should export its
  skeleton from the same file as the component, for example
  `ProfileSettingsReferencesSectionSkeleton`.
- The page/widget skeleton only wires layout and composes those child skeletons.
- For repeated skeleton items inside a component, use `ItemsList` from
  `@/shared/components/common/items-list` instead of
  `Array.from({ length }).map(...)`.
- Reusable skeletons and empty-state plugs belong in `src/features/**`.
  Widget-only skeletons stay in the component file as a named export below the
  main component.
- Widget components with a matching colocated hook should call that hook
  directly instead of receiving the same logic through props.
- For create/update flows where the user should see progress immediately,
  prefer TanStack Query cache optimistic updates in action hooks
  (`onMutate` / `setQueryData` / rollback in `onError`) instead of parallel
  local list state and upload spinners on the whole section.

## Mobile Row Actions And Delete Confirmation

- For list/card rows with remove or secondary actions on touch devices, use
  `SwipeActions` from `@/shared/components/ui/swipe-actions` when
  `!isDesktop && checkTouchScreen()`.
- Hide inline row/card actions with a `hideActions` prop while swipe is active.
- Put swipe action buttons in a colocated widget component.
- Destructive row actions should open a confirmation flow first: desktop uses
  `Dialog`, mobile uses `Drawer`.
- Open confirmation from `handleDeleteButtonClick`; perform delete in
  `handleConfirmDelete`.

## Page Navigation In AppMenubar

- For navigation between related pages or sections, prefer tabs in `AppMenubar`
  instead of `NavigationSteps` inside page content.
- Desktop: tabs in `right`; mobile: same tabs in `bottom` with `expand`.
- Cross-route tabs follow the billing/scenario/profile-settings menubar pattern
  with `RadioCardsGroup` and pathname- or route-based active state.

## Params And Props

- Function, hook, and component parameters are passed as a single object, not as
  positional arguments.
- Prefer flat props/params. Pass only the fields the component or hook needs.
- Passing a full entity object is acceptable only when the child truly needs the
  whole entity or local precedent already uses that shape.
- Keep public prop and hook param types close to the component/hook only when
  they are small. If a file needs several exported or shared types, move them to
  a colocated `types` file/folder.

## Common Workflows

### New or changed route

1. Read 2-3 nearby route files in the same layout group.
2. Add/update the route under `src/routes/**`.
3. Put page composition under `src/entrypoints/<page>/component.tsx`.
4. Put domain UI/behavior in widgets/features/actions, not in the route file.
5. Run `pnpm router:generate`.
6. Run `pnpm lint:fix` and `pnpm lint:typescript`.

### Domain feature

1. Identify the target layer using the placement logic above.
2. Read at least 3 similar files in that layer.
3. Check `src/codegen/api/product/**` for existing contracts.
4. Create or update action hooks before wiring generated network behavior into
   UI.
5. Add i18n keys only if the touched area already uses i18n, the task asks for
   locale resources, or pluralization/inflection requires i18next.
6. Run the relevant generators and validation commands.

### API schema update

1. Run `pnpm api:download` only when the backend schema must be refreshed.
2. Run `pnpm api:generate`.
3. Review generated changes without editing `src/codegen/**`.
4. Adapt handwritten code in this order:
   - `src/actions/**`;
   - `src/routes/**`;
   - `src/widgets/**` and `src/features/**`.
5. Run `pnpm lint:typescript`; run `pnpm lint:fix` if imports/formatting
   changed.

### i18n / pluralization update

1. Use this workflow only for existing locale-backed text, explicit i18n tasks,
   or pluralization/inflection work.
2. Update both `public/locales/en/translation.json` and
   `public/locales/ru/translation.json` when locale resources are changed.
3. Keep nesting identical across locales.
4. Run `pnpm i18n:resources`.
5. Run `pnpm lint:typescript`.

## Commands

```bash
pnpm dev
pnpm build
pnpm lint:fix
pnpm lint:typescript
pnpm router:generate
pnpm api:download
pnpm api:generate
pnpm api:generate:hey-api
pnpm i18n:resources
```

## Pull Requests

- Agents may create a feature branch and open a pull request for owner review.
- Use branch names like `agent/TASK-XXX-short-slug` when working from orchestrator tasks.
- Never force-push to `main`.
- Owner merges after review; do not merge your own PR unless explicitly asked.

## Completion Checklist

Before finishing a code task, report:

- files changed;
- local reference files inspected;
- generators run, if any;
- validation commands run and their result;
- validation skipped, if any, with the reason.

Do not report completion if generated files are stale, locale resource types are
stale, or TypeScript validation failed for changes you made.
