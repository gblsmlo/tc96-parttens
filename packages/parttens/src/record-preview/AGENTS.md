# Record preview pattern

A controlled, modal right-side sheet that previews a record (`RecordPreview`), plus an icon action for its header (`RecordPreviewAction`). It has no content of its own. The consumer owns the open state, the URL, the record lookup, loading and error states, widgets and any confirmation; the pattern never fetches or ships CSS and keeps no state besides a ref to its popup.

## Map

| Folder | Holds |
| --- | --- |
| `core.ts` | React-free surface: the prop types |
| `composition/record-preview/` | `RecordPreview` on the COSS `Sheet`, its test and barrel |
| `composition/record-preview-action/` | `RecordPreviewAction` on the COSS `Button` and `Tooltip`, its test and barrel |
| `test/dom.ts` | the JSDOM setup the tests import; a copy owned by this pattern |

Import direction: `composition/` → `core.ts`. Composition imports only COSS (`button`, `sheet`, `tooltip`) and `lucide-react`.

## Dependents

- `packages/parttens/src/index.ts` re-exports `record-preview/index`.
- `packages/registry/src/manifest.ts` lists `record-preview` in `patternNames`, and `scripts/test-patterns.ts` in its folder list.
- Nothing else imports this pattern by file path. It replaced the former detail sheet pattern; see the break note in `docs/architecture/tc96-parttens.md`.

## Invariants

- The props do not extend `Dialog.Root.Props`, so the Base UI surface stays out of the public API baseline.
- The title is the accessible name of the dialog and wraps instead of truncating. The close button is always rendered and its label has no default.
- The COSS `SheetPopup` renders its own close button by default; the pattern passes `showCloseButton={false}` so there is exactly one.
- Initial focus goes to the popup (`initialFocus` on its ref, `tabIndex={-1}`). Opened by keyboard, the focus otherwise stayed on the trigger and `Escape` went to the trigger's tooltip, leaving no way to close.
- The sheet is modal: `Escape` and an outside press call `onOpenChange(false)`. Closing returns focus to the element that was focused on open.
- When the trigger is unmounted while the preview is open (a card that moves to another column), Base UI returns focus to the detached node and focus falls to `body`. The consumer resolves the target at close time through `finalFocus`; a `null` return keeps the Base UI default. Covered by the `finalFocus` tests in `record-preview.test.tsx`. Decided in D27 of the plan. Below `md` the Kanban renders only the active column, so the moved card may not be in the DOM; the recommended fallback is the moved card's column option, `[data-kanban-column-option="<column id>"]` (always rendered on mobile, survives an empty column), after the visible `[data-record-id]` trigger. There is no Kanban story for this (D33 of the plan); the `finalFocus` fallback test in `record-preview.test.tsx` is the proof.
- The footer renders only with `footer`, in a COSS `SheetFooter` outside the scrolling panel. The pattern never confirms a destructive action; confirmation belongs to the consumer.
- `actions` is a slot; `RecordPreviewAction` is the suggested item and does not extend the COSS `Button` props, for the same baseline reason.
- `side="right"` and `variant="inset"` are COSS props, not overrides, and `className` goes to the popup. There is no size prop; the width is the COSS one.
- Default copy does not exist: every label is a prop.

## Styling

| Attribute | Where |
| --- | --- |
| `data-slot="record-preview-header-actions"` | the wrapper of `actions`, only when `actions` is passed |

- `data-slot` names on the popup, panel, footer and title are left to COSS (`sheet-popup`, `sheet-panel`, `sheet-footer`, `sheet-title`).
- No class overrides a COSS border or radius; `scripts/override-exceptions.json` has no entry for this pattern. Changing that requires a new entry.
- Colors come from theme tokens. Measured contrast is in `docs/architecture/tc96-parttens.md`.

## Verify

```bash
bun test --isolate packages/parttens/src/record-preview
bunx biome check packages/parttens/src/record-preview
bun run typecheck && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
cd apps/storybook && bunx vitest run --project=storybook src/patterns/record-preview
```

The stories are in `apps/storybook/src/patterns/record-preview/`, with a `!dev` `<Story>Interaction` twin each, and run axe with `test: 'error'`.

## Pointers

- Public API: `index.ts` and the `record-preview` entry of `docs/architecture/public-api-exports.json`. Props are in `core.ts`.
- Decisions, contrast and the break note: `docs/architecture/tc96-parttens.md`; plan: `docs/plans/2026-10-04-record-preview.md`.
