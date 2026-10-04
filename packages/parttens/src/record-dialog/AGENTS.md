# Record dialog pattern

Guide for agents working in `packages/parttens/src/record-dialog`. The repo-wide rules in the root `AGENTS.md` still apply: no comments in code, Biome formatting, COSS through `@tc96/ui/<component>`, no business rules inside the pattern. The folder follows the pattern structure described there (`composition/`, `hooks/`, `test/`, `core.ts`).

## What it is

Two dialogs for acting on a record. `RecordDialog` covers create and edit: an internal shell on the COSS `Dialog` (header with an optional icon and a breadcrumb-style trail `ancestor › title`, optional actions row, optional panel, error slot, footer), a COSS `Form` that holds the consumer's fields, and a footer with an optional cancel and the submit. `SurfaceStates` covers confirm and delete: the same shell in its `alertdialog` branch (COSS `AlertDialog`, same header trail, no close button, so `actions` would sit at `end-2`), a footer and an error slot. Fields, validation, mutation and error text belong to the consumer; there is no form library in the pattern.

## Files

| File | Owns | Public |
| --- | --- | --- |
| `index.ts` | the barrel: re-exports `composition/index.ts` and the types from `core.ts` | yes |
| `core.ts` | the React-free surface: `RecordDialogProps`, `SurfaceStatesProps`, `RecordDialogSettlement` | types through the barrel |
| `composition/index.ts` | re-exports both compounds | through the barrel |
| `components/dialog-shell.tsx` | `DialogShell`: popup with the size scale, actions, header trail, panel, error and footer, in a `dialog` and an `alertdialog` branch; used by both compounds | no |
| `composition/record-dialog/record-dialog.tsx` | `RecordDialog` | yes |
| `composition/record-dialog/record-dialog.test.tsx` | JSDOM tests: settle rule, pending lock, alert, submit prevention | — |
| `composition/surface-states/surface-states.tsx` | `SurfaceStates` | yes |
| `composition/surface-states/surface-states.test.tsx` | JSDOM tests: settle rule, pending lock, alert, destructive variant | — |
| `hooks/use-settled-action.ts` | `useSettledAction`: pending state, re-entry guard and the settle rule | no |
| `test/dom.ts` | the JSDOM setup the test files import; a copy owned by this pattern | — |

Import direction: `composition/` → `components/` and `hooks/` → `core.ts`.

## Use cases

`RecordDialog` has two documented bodies on the same shell, both with the `actions` open-as-page shortcut, the `Create more` switch in `footerStart` bound to `keepOpenOnSuccess`, and `submitOnModEnter`:

- `CreateRecord` (inline): borderless title and description, property chips pinned to the bottom with `stretchBody`. Use it for quick capture where the fields are few and the properties are optional.
- `CreateRecordWithForm` (form): the same fields and payload as labeled COSS `Field` rows, scrolling in the panel without `stretchBody`. Use it for explicit entry, long bodies or required fields that need a visible label.

The stories are in `apps/storybook/src/patterns/record-dialog/`; the shared lists, the zod schema and the payload shape live in `project-record.ts` there.

## Public API

```ts
type RecordDialogSettlement = boolean | Promise<boolean>

interface RecordDialogProps {
  actions?: ReactNode                // consumer-owned header shortcuts, left of the close button
  cancelLabel?: string               // no cancel button when absent
  children?: ReactNode               // the consumer's fields; no panel renders without it
  className?: string                 // forwarded to the popup
  description?: ReactNode
  errorMessage?: ReactNode           // rendered with role="alert" above the footer
  footerStart?: ReactNode            // slot before the footer buttons, e.g. a "Create more" switch
  keepOpenOnSuccess?: boolean        // on true: form.reset() and focus the first field instead of closing
  onOpenChange: (open: boolean) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => RecordDialogSettlement
  open: boolean
  size?: 'small' | 'default' | 'large'   // default 'default'; see Sizes below
  stretchBody?: boolean              // the shell's own body wrapper (data-stretch) is a flex column filling the popup; mt-auto works inside
  submitDisabled?: boolean
  submitLabel: string
  submitOnModEnter?: boolean         // Cmd/Ctrl+Enter requests the submit and the button shows a Kbd hint
  submittingLabel?: string           // shown with the spinner while pending
  title: ReactNode
  titleAncestor?: string             // muted ancestor before a chevron; no trail when absent
}

interface SurfaceStatesProps {
  cancelLabel: string
  className?: string
  confirmLabel: string
  confirmingLabel?: string
  description?: ReactNode
  destructive?: boolean              // destructive button variant
  errorMessage?: ReactNode
  onConfirm: () => RecordDialogSettlement
  onOpenChange: (open: boolean) => void
  open: boolean
  size?: 'small' | 'default' | 'large'   // default 'small'
  title: ReactNode
  titleAncestor?: string             // same trail as RecordDialog
}
```

Behavior the tests fix:

- Settle rule: the handler returning `true` calls `onOpenChange(false)`. `false`, a rejection or a synchronous throw keeps the dialog open and the field values untouched. Errors are swallowed; the consumer reports them through `errorMessage`.
- Pending belongs to one open session. When `open` becomes false the pattern resets pending and ignores any settlement still in flight, so a late `true` never closes a reopened dialog, and nothing runs after unmount.
- Pending is tracked by the pattern. While pending, Escape, outside press and the close button do not close, the cancel and submit or confirm buttons are disabled, a second submit is ignored, and the submit or confirm button shows `Spinner` and `submittingLabel` or `confirmingLabel` when given.
- The consumer clears `errorMessage` at the start of the handler; the pattern never clears it.
- `event.currentTarget` is null after the first `await`, so `onSubmit` reads `FormData` (or the form elements) synchronously, before awaiting anything.
- Base UI `Form` renders `noValidate`: native constraints such as `required` or `type="email"` do not block the submit. Validation is the consumer's job inside `onSubmit`, returning `false` to keep the dialog open. The pattern does not call `checkValidity`.
- `RecordDialog` calls `preventDefault` on the submit event before it calls `onSubmit`. Base UI `Form` blocks the submit first when a Base UI `Field` is invalid.
- Sizes, set on the popup as `data-size`:
  - `small`: `max-w-md` (448px), for confirmations and state surfaces. It is the default of `SurfaceStates`.
  - `default`: `max-w-2xl` (672px), for create and edit forms. It is the default of `RecordDialog`.
  - `large`: `max-w-4xl sm:min-h-136` (896px, Lemind's 920x540), for long or dense bodies.
  Below the `sm` breakpoint the popup is full width whatever the size. With `stretchBody` the default size gets `sm:min-h-96` so there is height to stretch; `large` already has `min-h-136`.
- `stretchBody` replaces the COSS `DialogPanel` (which has no stretch support) with a shell-owned `div[data-slot=dialog-panel][data-stretch]`, `flex min-h-0 flex-1 flex-col overflow-y-auto`, and the form is a flex column inside it. The COSS panel scroll fade does not apply in this mode.
- `actions` are consumer-owned header shortcuts, for example a button that opens the single (full record) view; navigation stays with the consumer and the pattern has no prop for it.
- Labels have no defaults; the consumer passes them. `cancelLabel` is optional and means no cancel button.
- The header is `ancestor › title`. The ancestor is outside `DialogTitle`, so the accessible name is the title only, and the trail is not a `nav`.
- Without `children` there is no panel; an empty native form still hosts the footer submit through the `form` attribute.
- The submit button sits outside the panel and points at the form with `form={id}`.
- `submitOnModEnter` blocks while pending or `submitDisabled`. The hint shows `⌘` on Apple platforms and `Ctrl` elsewhere, decided after mount; it is `aria-hidden` and the button carries `aria-keyshortcuts="Meta+Enter Control+Enter"`.
- `keepOpenOnSuccess` calls `form.reset()`, which does not touch React-controlled inputs: controlled fields reset their own state inside `onSubmit`. The generation and unmount guards still apply.
- `SurfaceStates` is an `alertdialog`: outside press never closes it and it has no close button. Its header, `titleAncestor` and `size` behave as in `RecordDialog`, and its accessible name is the title only.

## Styling contract

`data-slot` names on the popups are left to COSS (`dialog-popup`, `alert-dialog-popup`), because COSS selectors depend on them.

| Attribute | Where | Meaning |
| --- | --- | --- |
| `data-pending` | the popup | the handler has not settled |
| `data-size` | the popup | `small`, `default` or `large` |
| `data-stretch` | the body wrapper | `stretchBody` is set |
| `data-slot=dialog-actions` | the actions row | `absolute end-11 top-2` |
| `data-slot=dialog-title-trail` | the ancestor and title wrapper | only with `titleAncestor` |
| | `data-slot=dialog-footer-start` | the `footerStart` wrapper | only with `footerStart` |
| `data-destructive` | the `SurfaceStates` popup | `destructive` is set |
| `aria-busy` | the form | the handler has not settled |

`data-slot` names: `record-dialog-form`, `dialog-error`, `record-dialog-submit-hint`, `record-dialog-cancel`, `record-dialog-submit`, `surface-states-error`, `surface-states-cancel`, `surface-states-confirm`.

## Verify

```bash
bun test --isolate packages/parttens/src/record-dialog
bunx biome check packages/parttens/src/record-dialog
bun run typecheck && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
cd apps/storybook && bunx vitest run --project=storybook src/patterns/record-dialog
```

The stories are `Patterns/RecordDialog` (Default, Sizes, CreateRecord, CreateRecordWithForm), `Patterns/SurfaceStates` and `Patterns/RecordDialog Kanban` in `apps/storybook/src/patterns/record-dialog/`, with a `!dev` `<Story>Interaction` twin for each, and run axe with `test: 'error'`.
