# Record dialog pattern

Guide for agents working in `packages/parttens/src/record-dialog`. The repo-wide rules in the root `AGENTS.md` still apply: no comments in code, Biome formatting, COSS through `@tc96/ui/<component>`, no business rules inside the pattern. The folder follows the pattern structure described there (`composition/`, `hooks/`, `test/`, `core.ts`).

## What it is

A dialog for acting on a record. `RecordDialog` covers create and edit: an internal shell on the COSS `Dialog` (header with an optional icon and a breadcrumb-style trail `ancestor › title`, optional actions row, optional panel, error slot, footer), a COSS `Form` that holds the consumer's fields, and a footer with an optional cancel and the submit. Fields, validation, mutation and error text belong to the consumer; there is no form library in the pattern.

## Files

| File | Owns | Public |
| --- | --- | --- |
| `index.ts` | the barrel: re-exports `composition/index.ts` and the types from `core.ts` | yes |
| `core.ts` | the React-free surface: `RecordDialogProps`, `RecordDialogSettlement` | types through the barrel |
| `composition/index.ts` | re-exports the compound | through the barrel |
| `components/dialog-shell.tsx` | `DialogShell`: popup with the size scale, actions, header trail, panel, error and footer, on the COSS `Dialog` | no |
| `composition/record-dialog/record-dialog.tsx` | `RecordDialog` | yes |
| `composition/record-dialog/record-dialog.test.tsx` | JSDOM tests: settle rule, pending lock, alert, submit prevention | — |
| `hooks/use-settled-action.ts` | `useSettledAction`: pending state, re-entry guard and the settle rule | no |
| `test/dom.ts` | the JSDOM setup the test files import; a copy owned by this pattern | — |

Import direction: `composition/` → `components/` and `hooks/` → `core.ts`.

## Use cases

`RecordDialog` has two documented bodies on the same shell, both with the `actions` open-as-page shortcut, the `Create more` switch in `footerStart` bound to `keepOpenOnSuccess`, and `submitOnModEnter`:

- `CreateRecord` (inline): borderless title and description, property chips pinned to the bottom with `stretchBody`. Use it for quick capture where the fields are few and the properties are optional.
- `CreateRecordWithForm` (form): the same fields and payload as labeled COSS `Field` rows, scrolling in the panel without `stretchBody`. Use it for explicit entry, long bodies or required fields that need a visible label.

`CreateEvent` is a third body for a calendar event or appointment, prefilled with a clicked slot: icon rows for when, guests, location and description, then a chip row where one grouped select holds the type (Event, Appointment) and the calendar. It has no `actions` shortcut and no `Create more`. It is the documented use of `errorMessage`: an end time before the start keeps the dialog open with the message.

The stories are in `apps/storybook/src/patterns/record-dialog/`; the shared lists, the zod schema and the payload shape live in `project-record.ts` there, and in `event-record.ts` for `CreateEvent`.

Usages sit under `Patterns/RecordDialog/Usages` in `usages/`. `Contacts` is the `CreateRecord` body for the Contacts collection: name as title, a description textarea, and every other field as a property chip, without `stretchBody` so the popup keeps the height of its content. Cargo and Empresa share `CreatableProperty` (`creatable-property.tsx`), a COSS `Combobox` with search, the existing values and a footer button that creates the typed value. `CreateContactDialog` (`create-contact-dialog.tsx`) is controlled, and the Contacts usage of `Patterns/CollectionViews` mounts the same component from Novo contato.

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
```

Behavior the tests fix:

- Settle rule: the handler returning `true` calls `onOpenChange(false)`. `false`, a rejection or a synchronous throw keeps the dialog open and the field values untouched. Errors are swallowed; the consumer reports them through `errorMessage`.
- Pending belongs to one open session. When `open` becomes false the pattern resets pending and ignores any settlement still in flight, so a late `true` never closes a reopened dialog, and nothing runs after unmount.
- Pending is tracked by the pattern. While pending, Escape, outside press and the close button do not close, the cancel and submit buttons are disabled, a second submit is ignored, and the submit button shows `Spinner` and `submittingLabel` when given.
- Focus: when the submit button had focus at submit and the handler settles `false`, rejects or throws, the pattern refocuses it once it is enabled again, because the disabled button drops focus while pending. A submit from a field (Mod+Enter) leaves focus where it was.
- The consumer clears `errorMessage` at the start of the handler; the pattern never clears it.
- `event.currentTarget` is null after the first `await`, so `onSubmit` reads `FormData` (or the form elements) synchronously, before awaiting anything.
- Base UI `Form` renders `noValidate`: native constraints such as `required` or `type="email"` do not block the submit. Validation is the consumer's job inside `onSubmit`, returning `false` to keep the dialog open. The pattern does not call `checkValidity`.
- `RecordDialog` calls `preventDefault` on the submit event before it calls `onSubmit`. Base UI `Form` blocks the submit first when a Base UI `Field` is invalid.
- Sizes, set on the popup as `data-size`:
  - `small`: `max-w-md` (448px), for short bodies.
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

## Styling contract

`data-slot` names on the popup are left to COSS (`dialog-popup`), because COSS selectors depend on them.

| Attribute | Where | Meaning |
| --- | --- | --- |
| `data-pending` | the popup | the handler has not settled |
| `data-size` | the popup | `small`, `default` or `large` |
| `data-stretch` | the body wrapper | `stretchBody` is set |
| `data-slot=dialog-actions` | the actions row | `absolute end-11 top-2` |
| `data-slot=dialog-title-trail` | the ancestor and title wrapper | only with `titleAncestor` |
| | `data-slot=dialog-footer-start` | the `footerStart` wrapper | only with `footerStart` |
| `aria-busy` | the form | the handler has not settled |

`data-slot` names: `record-dialog-form`, `dialog-error`, `record-dialog-submit-hint`, `record-dialog-cancel`, `record-dialog-submit`.

## Verify

```bash
bun test --isolate packages/parttens/src/record-dialog
bunx biome check packages/parttens/src/record-dialog
bun run typecheck && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
cd apps/storybook && bunx vitest run --project=storybook src/patterns/record-dialog
```

The stories are `Patterns/RecordDialog` (Default, Sizes, CreateRecord, CreateRecordWithForm, CreateEvent) in `apps/storybook/src/patterns/record-dialog/`, with a `!dev` `<Story>Interaction` twin for each (`FailedSubmit` and `ThrowingSubmit` check the focus rule above; `Sizes` widens the viewport with `page.viewport()` and restores it), and `Patterns/RecordDialog/Usages/Contacts` (Default, CreateContact, CreateMore) in `usages/`; all run axe with `test: 'error'`.
