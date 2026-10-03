# Editable pattern

Guide for agents working in `packages/parttens/src/editable`. The repo-wide rules in the root `AGENTS.md` still apply: no comments in code, Biome formatting, `cn` only where an external `className` comes in (here every part accepts one), COSS through `@tc96/ui/<component>`, no business rules inside the pattern. The folder follows the pattern structure described there (`composition/`, `store/`, `types/`, `test/`, `core.ts`), the same layout as `collection-views`, `detail-sheet` and `checklist`.

## What it is

A compound for inline editing of one string: the consumer mounts `Editable` and composes `EditableLabel`, `EditableArea` with `EditablePreview` and `EditableInput`, `EditableTrigger`, and `EditableToolbar` with `EditableSubmit` and `EditableCancel`. Value and editing state are each controlled or uncontrolled; the parts share them through a React context and render themselves only in the state they belong to. It uses no COSS component: every part is a native element rendered through Base UI's `useRender`, so the consumer can swap the tag with `render`.

## Files

| File | Owns | Public |
| --- | --- | --- |
| `index.ts` | the barrel: re-exports `composition/editable/index.ts` | yes |
| `core.ts` | the React-free surface: the nine `*Props` types, re-exported from `composition/editable/index.ts` | workspace only; not reached from the barrel |
| `composition/index.ts` | re-exports `composition/editable/index.ts` | workspace only; `index.ts` goes straight to `composition/editable/index.ts` |
| `composition/editable/index.ts` | exports the nine parts and their props types | through the barrel |
| `composition/editable/editable.tsx` | `Editable`, `EditableLabel`, `EditableArea`, `EditablePreview`, `EditableInput`, `EditableTrigger`, `EditableToolbar`, `EditableCancel`, `EditableSubmit` and their props; the private `assignRef`, `dataAttributes` and `useComposedRefs` | yes |
| `composition/editable/editable.test.tsx` | JSDOM tests with Testing Library | — |
| `store/editable-store.ts` | `EditableContextValue`, `EditableContext`, `useEditableContext(consumerName)` | no; shipped because `editable.tsx` imports it, never exported from the barrel |
| `store/index.ts` | re-exports the store | workspace only; `editable.tsx` imports `store/editable-store` directly |
| `types/index.ts` | re-exports the nine `*Props` types from `composition/editable` | workspace only; not reached from the barrel |
| `views/README.md` | marks the empty `views/` layer; an entry is added only when Editable gains an independently usable view | — |
| `vite-env.d.ts` | `/// <reference types="vite/client" />`; legacy from isolated development, nothing imports it and the registry does not ship it | — |
| `test/dom.ts` | the JSDOM setup the test file imports; a copy owned by this pattern | — |

Only what `index.ts` exports is public. The registry (`packages/registry/src/build-registry.ts`) starts at `index.ts` and copies every file it reaches through imports, so today the item is `index.ts`, `composition/editable/index.ts`, `editable.tsx` and `store/editable-store.ts`; a new file must be imported from one of these. `core.ts`, `types/index.ts`, `composition/index.ts` and `store/index.ts` exist for the workspace layout and are not shipped. Nothing in `store/` should be exported from the barrel without a reason recorded in `docs/architecture/tc96-parttens.md`. `styles/global.css` was removed on 2026-10-03 (patterns carry no CSS).

Import direction inside the folder: `composition/` → `store/`; `store/` imports only from `react`; `types/` and `core.ts` import only from `composition/editable`.

Consumers: `packages/parttens/src/index.ts` re-exports the barrel, and the CLI in `packages/registry` lists `editable` as an installable pattern. No other pattern imports from `editable/`; the `EditableText` of `properties` is a separate display and does not use this compound.

## Public API

```ts
interface EditableProps
  extends Omit<
    React.ComponentProps<'div'> & useRender.ComponentProps<'div'>,
    'defaultValue' | 'onSubmit'
  > {
  defaultValue?: string              // default ''
  value?: string
  onValueChange?: (value: string) => void   // fires on every keystroke and on cancel
  defaultEditing?: boolean           // default false
  editing?: boolean
  onEditingChange?: (editing: boolean) => void
  onCancel?: () => void
  onEdit?: () => void
  onSubmit?: (value: string) => void
  onEscapeKeyDown?: (event: KeyboardEvent) => void   // native event; preventDefault() blocks the cancel
  onEnterKeyDown?: (event: KeyboardEvent) => void    // native event; preventDefault() blocks the submit or the edit start
  dir?: 'ltr' | 'rtl'
  maxLength?: number
  name?: string                      // renders a hidden input for native forms
  placeholder?: string
  triggerMode?: 'click' | 'dblclick' | 'focus'   // default 'click'
  autosize?: boolean                 // input width follows its content
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  invalid?: boolean
}

interface EditableLabelProps extends React.ComponentProps<'label'>, useRender.ComponentProps<'label'> {}
interface EditableAreaProps extends React.ComponentProps<'div'>, useRender.ComponentProps<'div'> {}
interface EditablePreviewProps extends React.ComponentProps<'div'>, useRender.ComponentProps<'div'> {}
interface EditableInputProps extends React.ComponentProps<'input'>, useRender.ComponentProps<'input'> {}
interface EditableCancelProps extends React.ComponentProps<'button'>, useRender.ComponentProps<'button'> {}
interface EditableSubmitProps extends React.ComponentProps<'button'>, useRender.ComponentProps<'button'> {}

interface EditableTriggerProps extends React.ComponentProps<'button'>, useRender.ComponentProps<'button'> {
  forceMount?: boolean               // keeps the trigger mounted while editing or read-only
}

interface EditableToolbarProps extends React.ComponentProps<'div'>, useRender.ComponentProps<'div'> {
  orientation?: 'horizontal' | 'vertical'   // default 'horizontal'
}
```

The context is internal. `useEditableContext(consumerName: string): EditableContextValue` lives in `store/editable-store.ts`, throws `` `<consumerName>` must be used within `Editable` `` when there is no provider, and is not exported from the barrel. `EditableContextValue` holds `rootId`, `inputId`, `labelId`, `value`, `editing`, `dir`, `maxLength`, `placeholder`, `triggerMode`, `autosize`, `disabled`, `readOnly`, `required`, `invalid`, the actions `beginEditing`, `cancelEditing`, `submitValue`, `setValue`, and the two key callbacks.

Behavior worth knowing before changing it:

- `value` and `editing` are each controlled when the prop is defined and uncontrolled otherwise; `setValue` and `setEditing` only touch internal state in the uncontrolled case and always call `onValueChange` or `onEditingChange`.
- Editing starts from `EditablePreview` according to `triggerMode` (click, double click or focus) or with Enter on the focused preview, and from `EditableTrigger` on click or double click. `beginEditing` snapshots the current value, sets editing and calls `onEdit`. With `disabled` or `readOnly`, `beginEditing`, `cancelEditing` and `submitValue` do nothing.
- Commit happens on Enter in the input, on `EditableSubmit`, and on blur when `relatedTarget` is not inside `[data-slot="editable-trigger"]`, `[data-slot="editable-cancel"]` or `[data-slot="editable-submit"]`. `submitValue` leaves editing and calls `onSubmit(value)`; it does not touch the value.
- Cancel happens on Escape or `EditableCancel`: `cancelEditing` writes the snapshot back through `setValue`, so `onValueChange` receives the restored value (the test asserts `['Draft', 'Alpha']`), then leaves editing and calls `onCancel`.
- Consumer handlers passed to a part (`onClick`, `onDoubleClick`, `onFocus`, `onKeyDown`, `onBlur`, `onChange`) run first; `event.defaultPrevented` stops the pattern's reaction. `onEnterKeyDown` and `onEscapeKeyDown` receive the native event and `preventDefault()` on it blocks the default submit, cancel or edit start.
- Mounting by state: `EditablePreview` renders when not editing and not read-only; `EditableInput` renders when editing or read-only; `EditableTrigger` hides while editing or read-only unless `forceMount`; `EditableToolbar`, `EditableSubmit` and `EditableCancel` render only while editing.
- Focus: when editing turns on, `EditableInput` focuses and selects its content inside a `requestAnimationFrame`; `test/dom.ts` polyfills `requestAnimationFrame` for JSDOM. With `autosize` the input width is set to `scrollWidth + 4px` on focus and on every change, and its classes are `w-auto min-w-8` instead of `w-full`.
- Accessibility wiring: the root id is `id` or `useId()`; `EditableLabel` uses `htmlFor` the input id and the input uses `aria-labelledby` the label id; `EditableTrigger`, `EditableCancel` and `EditableSubmit` set `aria-controls` to the root id; `EditableArea` is `role="group"` with `dir`; `EditablePreview` is `role="button"` with `tabIndex={0}` unless disabled; `EditableToolbar` is `role="toolbar"` with `aria-orientation`. The trigger uses `aria-disabled`, not `disabled`.
- `name` renders `<input type="hidden">` with the current value, `disabled` and `readOnly`, as a sibling of the root inside the provider, so native forms read it (test `exposes the value to native forms`).
- `disabled`, `readOnly`, `required` and `maxLength` passed to `EditableInput` combine with the root's (`||` for the booleans, `??` for `maxLength`).
- Every part accepts Base UI's `render`; the same flags that become `data-*` attributes are passed as `state` (`slot`, `editing`, `disabled`, `invalid`, `required`, `readonly`, `empty`, `orientation`) for `render` callbacks.

## Styling contract

State lives in `data-*` attributes and is styled by their variants, never by a parallel class:

| Attribute | Where | Styled by |
| --- | --- | --- |
| `data-editing` | `[data-slot=editable]`, `[data-slot=editable-area]` | consumers |
| `data-disabled` | `[data-slot=editable]`, `editable-label`, `editable-area`, `editable-preview`, `editable-trigger` | `data-disabled:cursor-not-allowed data-disabled:opacity-50` on the label, the area and the preview; consumers on the root and the trigger |
| `data-invalid` | `[data-slot=editable]`, `[data-slot=editable-label]` | consumers; the input carries `aria-invalid` instead |
| `data-required` | `[data-slot=editable-label]` | `data-required:after:ml-0.5 data-required:after:text-destructive data-required:after:content-['*']` on the label |
| `data-empty` | `[data-slot=editable-preview]` | `data-empty:text-muted-foreground` on the preview |
| `data-readonly` | `[data-slot=editable-trigger]` | consumers |
| `data-orientation="horizontal\|vertical"` | `[data-slot=editable-toolbar]` | consumers; the pattern picks `flex-row items-center` or `flex-col items-stretch` from the prop |

There are no `cva` variants and no `lib/variants.ts`: every class string sits in `editable.tsx`, complete, so the Tailwind scanner always sees it. The input uses the `disabled:` and `placeholder:` pseudo variants, the preview `hover:bg-accent/50`, and focus is `focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30` on the preview, the input and the three buttons. Colors come only from theme tokens (`border-input`, `bg-background`, `bg-accent`, `border-ring`, `ring-ring/30`, `text-muted-foreground`, `text-destructive`, `bg-primary`, `border-primary`, `text-primary-foreground`, `shadow-xs`); no palette colors. `scripts/override-exceptions.json` has no entry for this pattern, and it overrides no COSS component.

`data-slot` names: `editable`, `editable-label`, `editable-area`, `editable-preview`, `editable-input`, `editable-trigger`, `editable-toolbar`, `editable-cancel`, `editable-submit`. The last three are load-bearing: the blur commit in `EditableInput` looks them up with `closest`, so renaming one changes behavior, not only styling.

## Verify

```bash
bun test --isolate packages/parttens/src/editable
bunx biome check packages/parttens/src/editable
bun run typecheck && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
```

There is no story for this compound under `apps/storybook/src/`; `Patterns/Properties/Display/Editable Text` covers the `EditableText` of `properties`, and the `Editable` story in `apps/storybook/src/ui/input.stories.tsx` is a COSS `Input` story. The six JSDOM tests in `composition/editable/editable.test.tsx` are the only automated coverage.
