# Editable pattern

A compound for inline editing of one string: the consumer mounts `Editable` and composes `EditableLabel`, `EditableArea` with `EditablePreview` and `EditableInput`, `EditableTrigger`, and `EditableToolbar` with `EditableSubmit` and `EditableCancel`. Each part renders only in the state it belongs to. It uses no COSS component: every part is a native element rendered through Base UI's `useRender`, so the consumer can swap the tag with `render`. The pattern never fetches, validates, persists or ships CSS; its only state is the uncontrolled value and editing flag (each controlled when its prop is defined) and the snapshot taken when editing starts, shared with the parts through a React context.

## Map

| Folder | Holds |
| --- | --- |
| `composition/editable/` | the nine parts in `editable.tsx`, their barrel and the JSDOM tests |
| `store/` | `EditableContext` and `useEditableContext`; internal, shipped only because `editable.tsx` imports it |
| `types/` | re-exports the nine `*Props` types; workspace only, not reached from the barrel |
| `views/` | empty layer; `README.md` marks it until Editable gains an independently usable view |
| `test/dom.ts` | the JSDOM setup the tests import, with a `requestAnimationFrame` polyfill |
| `core.ts` | React-free surface: the nine `*Props` types; workspace only, not reached from the barrel |

Import direction: `composition/` → `store/`; `store/` imports only `react`; `types/` and `core.ts` import only from `composition/editable`. `index.ts` goes straight to `composition/editable/index.ts`, so `composition/index.ts` and `store/index.ts` are workspace only too.

## Dependents

- `packages/parttens/src/index.ts` re-exports `editable/index`.
- `packages/registry/src/manifest.ts` (`patternNames`) and `scripts/test-patterns.ts` list the folder by name. Renaming the folder requires updating both.
- The registry starts at `index.ts` and ships every file it reaches through imports: today `index.ts`, `composition/editable/index.ts`, `editable.tsx` and `store/editable-store.ts`. A new file ships only if one of these imports it.
- No other pattern imports from `editable/`. The `EditableText` of `properties` is a separate display and does not use this compound.

## Invariants

State and handlers:

- `setValue` and `setEditing` touch internal state only when uncontrolled and always call `onValueChange` or `onEditingChange`. `onValueChange` fires on every keystroke and again on cancel.
- With `disabled` or `readOnly`, `beginEditing`, `cancelEditing` and `submitValue` do nothing.
- On `EditablePreview` and `EditableInput` the consumer's `onClick`, `onDoubleClick`, `onFocus`, `onKeyDown`, `onBlur` and `onChange` run first, and `event.defaultPrevented` stops the pattern's reaction. On `EditableTrigger`, `EditableCancel` and `EditableSubmit` the handlers merge through Base UI `mergeProps`: the consumer's runs first and only `event.preventBaseUIHandler()` stops the pattern.
- `onEnterKeyDown` and `onEscapeKeyDown` receive the native event; `preventDefault()` on it blocks the submit, cancel or edit start.

Editing lifecycle:

- Editing starts from `EditablePreview` on the `triggerMode` event (click, double click or focus) or Enter, and from `EditableTrigger` on click or double click matching `triggerMode`; with `focus` the trigger does nothing. `beginEditing` snapshots the current value before setting editing and calling `onEdit`.
- Commit happens on Enter, on `EditableSubmit`, and on blur unless `relatedTarget` is inside `[data-slot="editable-trigger"]`, `[data-slot="editable-cancel"]` or `[data-slot="editable-submit"]`. `submitValue` leaves editing and calls `onSubmit(value)`; it never touches the value.
- Cancel (Escape or `EditableCancel`) writes the snapshot back through `setValue`, so `onValueChange` receives the restored value (the test asserts `['Draft', 'Alpha']`), then leaves editing and calls `onCancel`.

Mounting and focus:

- `EditablePreview` renders when not editing and not read-only; `EditableInput` renders when editing or read-only; `EditableTrigger` hides while editing or read-only unless `forceMount`; the toolbar, submit and cancel render only while editing.
- When editing starts, `EditableInput` focuses and selects its content inside a `requestAnimationFrame`, which is why `test/dom.ts` polyfills it. With `autosize` the width is set to `scrollWidth + 4px` then and on every change, and the input gets `w-auto min-w-8` instead of `w-full`.
- `disabled`, `readOnly`, `required` and `maxLength` passed to `EditableInput` combine with the root's (`||` for the booleans, `??` for `maxLength`).

Accessibility and forms:

- The root id is `id` or `useId()`. `EditableLabel` points `htmlFor` at the input, the input uses `aria-labelledby` the label, and the trigger, cancel and submit set `aria-controls` to the root id.
- `EditableArea` is `role="group"` with `dir`; `EditablePreview` is `role="button"` with `tabIndex={0}` unless disabled; `EditableToolbar` is `role="toolbar"` with `aria-orientation`. The trigger uses `aria-disabled`, not `disabled`.
- `name` renders `<input type="hidden">` with the value, `disabled` and `readOnly` as a sibling of the root inside the provider, so native forms read it (test `exposes the value to native forms`).
- Every part passes the same flags it sets as `data-*` to `render` callbacks as `state` (`slot`, `editing`, `disabled`, `invalid`, `required`, `readonly`, `empty`, `orientation`).

## Styling

State lives in `data-*` attributes and is styled by their variants, never by a parallel class:

| Attribute | Where | Styled by the pattern |
| --- | --- | --- |
| `data-editing` | `editable`, `editable-area` | no |
| `data-disabled` | `editable`, `editable-label`, `editable-area`, `editable-preview`, `editable-trigger` | `cursor-not-allowed opacity-50` on the label, area and preview |
| `data-invalid` | `editable`, `editable-label` | no; the input carries `aria-invalid` instead |
| `data-required` | `editable-label` | the `*` after the label, in `text-destructive-foreground` |
| `data-empty` | `editable-preview` | `text-muted-foreground` |
| `data-readonly` | `editable-trigger` | no |
| `data-orientation="horizontal\|vertical"` | `editable-toolbar` | no; the layout classes come from the prop |

- The `data-slot` names `editable-trigger`, `editable-cancel` and `editable-submit` are load-bearing: the blur commit looks them up with `closest`, so renaming one changes behavior, not only styling.
- No `cva` and no `lib/variants.ts`: every class string sits complete in `editable.tsx`, so the Tailwind scanner always sees it.
- Colors only from theme tokens, never palette classes.
- `scripts/override-exceptions.json` has no entry for this pattern, and it overrides no COSS component.

## Verify

```bash
bun test --isolate packages/parttens/src/editable
bunx biome check packages/parttens/src/editable
bun run typecheck && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
```

There is no story for this compound: `Patterns/Properties/Display/Editable Text` covers the `EditableText` of `properties`, and the `Editable` story in `apps/storybook/src/ui/input.stories.tsx` is a COSS `Input` story. The six tests in `composition/editable/editable.test.tsx` are the only automated coverage.

## Pointers

- Public API: `index.ts` and the `editable` entry of `docs/architecture/public-api-exports.json`. Props and defaults are in `editable.tsx`. Exporting anything from `store/` through the barrel needs a reason recorded in the architecture doc.
- Decisions: `docs/architecture/tc96-parttens.md`, section "Estrutura interna dos patterns" (the empty `views/` layer, `store/` on React Context rather than Zustand, the removal of `styles/global.css`).
