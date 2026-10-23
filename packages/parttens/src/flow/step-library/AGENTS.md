# Flow step library pattern

The panel on the left of the flow editors: step types grouped by `group`, each one a draggable button that writes the step type to `dataTransfer` on drag start and calls `onAdd` on click, plus a footer for the last run (`FlowRunCard`). The consumer passes the groups, the icons, the labels and the loading flag, and receives `onAdd`; the pattern never fetches, persists, sorts or runs anything. Its only state is the `useId` ids of the descriptions and titles. It ships no CSS: the layout is Tailwind classes over tokens, and `collapsed` keeps the icons only.

## Map

| Folder | Holds |
| --- | --- |
| `composition/step-library/` | `FlowStepLibrary`: title, hint, `ScrollArea` of groups, the `Empty` and the skeletons, `children` in the footer |
| `composition/step-library-group/` | `FlowStepLibraryGroup`: a `fieldset` whose `legend` is the group label |
| `composition/step-library-item/` | `FlowStepLibraryItem`: the draggable `button`, the drag payload, the click |
| `composition/flow-run-card/` | `FlowRunCard`: the COSS `Card` region with the status `Badge` and the `Progress` |
| `components/` | `step-library-skeleton.tsx`, the loading placeholder |
| `lib/` | `variants.ts`: the class strings and the item `cva` (`collapsed`) |
| `types/` | the props of the components |
| `test/dom.ts` | the JSDOM setup the tests import; this pattern's own copy |
| `core.ts` | React-free surface: `FlowStepGroup`, `groupStepTypes`, the label types and their pt-BR defaults, with `core.test.ts` |

Import direction: `composition/` → `components/`, `lib/`, `types/`, `core.ts`; `components/` → `lib/`, `core.ts`, `@tc96/ui`, `@tc96/elements/icon-frame`. Imports into the canvas go only to `../../../canvas/core` (or `../canvas/core` from `core.ts`) and only for types, `FLOW_STEP_TRANSFER_TYPE` and `serializeStepTransfer`; nothing else from `flow/canvas` and never `@xyflow/react`.

## Dependents

- `packages/registry/src/manifest.ts` lists the folder for the item `flow-step-library`. The item ships `flow/canvas/core.ts` by import, so `d3-hierarchy` comes with it, but no React Flow.
- `packages/parttens/src/index.ts` re-exports `flow/step-library/index`.
- `flow/canvas/core.ts` is the contract of the family. A change there (a new step field, a new transfer shape) changes this pattern and the templates; `parseStepTransfer` is what the canvas drop reads, so keep the two in step.
- The templates (T5) import `FlowStepLibrary` and `FlowRunCard` by file path, not through the barrel.

## Invariants

- The item is a `button` named by `type.label` (`aria-label`), `draggable`, with `aria-describedby` for the description. `onDragStart` writes `serializeStepTransfer(type)` under `FLOW_STEP_TRANSFER_TYPE`, the label as `text/plain` and `effectAllowed = 'copy'`. A click calls `onAdd(type)` with the same object; keyboard use goes through the click.
- Each group is a `fieldset` with a `legend`, so its name is the group label. Groups keep the order of `groups`, and steps keep the order of their group. `groupStepTypes` groups by `group` in order of first appearance.
- `loading` puts `aria-busy` on the section and renders the skeleton instead of the groups; with no groups and no loading it renders `Empty`.
- `FlowRunCard` is a `role="region"` named by `labels.title`. Its progress is `completed / total` rounded, zero when `total` is zero, and its `Progress` is named `<title>: <n>%`. The description is the `note` when there is one, otherwise the `summary` label with `{completed}` and `{total}`.
- `collapsed` hides the title, the hint, the group labels and the item text, but the names stay on the buttons and the groups through `sr-only` and `aria-label`. The panel is 3.5rem wide (`data-collapsed`); the footer is still rendered, so the consumer decides whether to pass one.
- `labels` are pt-BR by default; a consumer `labels` object merges with the defaults key by key, and the run card `statuses` merge one level down.

## Styling

| Attribute | Where |
| --- | --- |
| `data-slot="flow-step-library"`, `data-collapsed` | the root `section` |
| `data-slot="flow-step-library-groups"`, `flow-step-library-group`, `flow-step-library-item`, `flow-step-library-footer`, `flow-step-library-skeleton` | the groups container, each group, each item, the footer and the skeleton |
| `data-kind="trigger\|action\|condition"` | each item; the icon is `IconFrame` with the `icons` entry for the type id or the Lucide icon of its `kind` |
| `data-slot="flow-run-card"`, `data-status` | the run card, with the run status |

- The run card uses the COSS `Card` with its default border and shadow; the pattern does not restate them. The `Badge` variant maps the status: `success` for success, `destructive` for failed, `info` for running, `outline` for the rest.
- No class here overrides a border, radius, colour or shadow of a COSS part, so `scripts/override-exceptions.json` has no entry for this pattern.

## Verify

```bash
bun test packages/parttens/src/flow/step-library
bunx biome check packages/parttens/src/flow/step-library apps/storybook/src/patterns/flow/step-library
cd apps/storybook && bunx vitest run --project=storybook --project=storybook-dark src/patterns/flow/step-library
bun run build:registry
```

The tests are in `composition/step-library/step-library.test.tsx` (groups, click, drag payload, loading, empty, footer) and `composition/flow-run-card/flow-run-card.test.tsx` (status, progress, zero steps). The stories are in `apps/storybook/src/patterns/flow/step-library/` (`Patterns/Flow/Step Library`); `Default`'s `play` clicks an item and asserts `onAdd`. A drag in `play` is not covered: Storybook's events do not carry a `dataTransfer`, so the payload is asserted only in `bun test`.

## Pointers

- Public API: `index.ts` and the `flow-step-library` entry of `docs/architecture/public-api-exports.json`.
- Decisions and contrast audit: `docs/architecture/tc96-parttens.md`, section "Patterns: Flow Step Library".
- The family decisions: `.specs/adr/0006-flow-family-on-react-flow.md` (D2, D7, D10) and `.specs/flow-editors/user-experience.md` §2 and §4.
