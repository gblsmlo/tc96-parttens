# Record dialog pattern

Guide for agents working in `packages/parttens/src/records/dialog`. The repo-wide rules in the root `AGENTS.md` still apply: no comments in code, Biome formatting, COSS through `@tc96/ui/<component>`, no business rules inside the pattern. The folder follows the pattern structure described there (`composition/`, `hooks/`, `core.ts`).

## What it is

A dialog for creating a record. `RecordDialog` is the create step: an internal shell on the COSS `Dialog` (header with an optional icon and a breadcrumb-style trail `ancestor › title`, optional actions row, optional panel, error slot, footer), a COSS `Form` that holds the consumer's fields, and a footer with an optional cancel and the submit. Fields, validation, mutation and error text belong to the consumer; there is no form library in the pattern. Two optional parts ship with it for the bodies below: `RecordDialogHeadline`, the borderless title and description, and `RecordDialogCreateMore`, the switch meant for `footerStart` with `keepOpenOnSuccess`.

A confirmation before an action that is hard to undo is the COSS `AlertDialog` (`UI/AlertDialog`), not a compound of this pattern: `RecordConfirmDialog` duplicated it and was removed on 2026-11-23.

## Files

| File | Owns | Public |
| --- | --- | --- |
| `index.ts` | the barrel: re-exports `composition/index.ts` and the types from `core.ts` | yes |
| `core.ts` | the React-free surface: `RecordDialogProps`, `RecordDialogSettlement`, `RecordDialogHeadlineProps`, `RecordDialogCreateMoreProps`, `RecordDialogSize` | types through the barrel |
| `composition/index.ts` | re-exports the compounds | through the barrel |
| `components/dialog-shell.tsx` | `DialogShell`: popup with the size scale, actions, header trail, panel, error and footer, on the COSS `Dialog` | no |
| `components/dialog-error.tsx` | `DialogError`: the `role="alert"` line above the footer | no |
| `composition/record-dialog/record-dialog.tsx` | `RecordDialog` | yes |
| `composition/record-dialog/record-dialog-headline.tsx` | `RecordDialogHeadline`: borderless title and optional description on COSS `Field`, `Input` and `Textarea` | yes |
| `composition/record-dialog/record-dialog-create-more.tsx` | `RecordDialogCreateMore`: COSS `Switch` with its label | yes |
| `hooks/use-settled-action.ts` | `useSettledAction`: pending state, re-entry guard, the settle rule and the focus return after a failure | no |
| `hooks/use-record-draft.ts` | `useRecordDraft`: the consumer's draft as state plus a `latest` ref written in `update`, so a Mod+Enter submit in the same event as a blur commit reads the committed value | yes |

Import direction: `composition/` → `components/` and `hooks/` → `core.ts`.

## Use cases

The bodies are documented on `Patterns/Records/RecordDialog`, on the five component pages of the `storybook-write` skill (API Reference, Playground, Layouts, Behavior, Usages), and a body appears on one page only:

- `Layouts` holds the formations that serve more than one case, with the generic project content of `ComposedRecordDialog`, in `record-dialog-layouts.tsx`: `Default` (the headline, title and description, and nothing else in the body; it is also the Playground's render), `InlineProperties` (the properties as chips pinned to the bottom, with `stretchBody`), `RowProperties` (one `RecordGroupRow` per property), `PropertyBarOverBody` (without the headline description, a bar of `plain` chips 8px under the title, and a free body 24px below, here a `RichTextEditor`, that fills a `large` popup with `stretchBody` in the `readable` column, as `Note`) and `DescriptionOverBody` (no headline: the trail with the dialog `description` under it, and a body free for content, here one `RecordGroupRow` per project property). `ComposedRecordDialog` always renders the headline of `Default`, and each `<Name>Formation`, passed as its `children`, only adds what comes after it: a layout never replaces or restyles the title and the description, and drops the headline or its description only through the `headline` and `headlineDescription` controls. Turning a part on or off is a Playground control and a Behavior guarantee, not a layout; a body that only arranges fields for one case is a Usage on `Default`.
- `Usages` holds one create case per record, with real content, and each links the layout it fills: `Projects` and `Contacts` on Inline Properties (`Contacts` without `stretchBody`), `Leads` and `Events` on Row Properties, `Note` on Property Bar Over Body (the headline without a description), and `Project Setup` on Description Over Body (accordion sections, each holding a `RecordGroup` with `collapsible={false}` and selectable properties). Editing and confirmations are not cases of this pattern.

`Events` renders `CreateEventDialog` (`create-event-dialog.tsx`, fixtures in `event-record.ts`), the only copy of the event body, prefilled with the clicked slot. The row order goes from what places the event to what classifies it: Date (a `ScheduleProperty` that owns the day, times, all day, repeat and reminders), Guests, Location (an inline `TextProperty`), Type (Event or Appointment), Calendar and Availability. Type and Calendar are separate selects because they are independent choices, and the title follows Type. An inline `TextProperty` commits on blur, and Mod+Enter submits in the same event, so the draft lives in `useRecordDraft` and `onSubmit` reads `latest.current`; `reset` pairs with `keepOpenOnSuccess`. It is the documented use of `errorMessage`: an end time before the start, or a failed save, keeps the dialog open with the message.

`Contacts` renders `CreateContactDialog` (`create-contact-dialog.tsx`): name as title, a description textarea, and every other field as a property chip. Cargo and Empresa share `CreatableProperty` (`creatable-property.tsx`), a COSS `Combobox` with search, the existing values and a footer button that creates the typed value. `Leads` renders `LeadDialog` (`lead-dialog.tsx`, fixtures in `lead-record.ts`), which resets its fields when it closes. `Note` renders `NoteDialog` (`note-dialog.tsx`, fixtures in `note-record.ts`) with `note={null}`; its bar holds Status, Prioridade and Responsável, the properties of the layout. `NoteDialog` also edits an existing note for `Patterns/Records/Group/Usages`, which is not documented here. Focus does not return to the opener on close: the title autofocuses before Base UI records the element focused before open, as in every body here that autofocuses a field (issue #210).

## Public API

```ts
type RecordDialogSettlement = boolean | Promise<boolean>

interface RecordDialogProps {
  actions?: ReactNode                // consumer-owned header shortcuts, left of the close button
  bodyWidth?: 'fill' | 'readable'    // default 'fill'; 'readable' centers the form in a 672px column
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
  properties?: ReactNode             // property chips at the end of the header, outside the form
  size?: 'small' | 'default' | 'large'   // default 'default'; see Sizes below
  stretchBody?: boolean              // the shell's own body wrapper (data-stretch) is a flex column filling the popup; mt-auto works inside
  submitDisabled?: boolean
  submitLabel: string
  submitOnModEnter?: boolean         // Cmd/Ctrl+Enter requests the submit and the button shows a Kbd hint
  submittingLabel?: string           // shown with the spinner while pending
  title: ReactNode
  titleAncestor?: string             // muted ancestor before a chevron; no trail when absent
}

interface RecordDialogHeadlineProps {
  description?: string               // controlled when given; uncontrolled otherwise, read through FormData
  descriptionLabel?: string          // sr-only label; no description field when absent
  descriptionName?: string           // default 'description'
  descriptionPlaceholder?: string
  onDescriptionChange?: (description: string) => void
  onTitleChange: (title: string) => void
  title: string
  titleLabel: string                 // sr-only label
  titleName?: string                 // default 'title'
  titlePlaceholder?: string
}

interface RecordDialogCreateMoreProps {
  checked: boolean
  disabled?: boolean
  label: string
  onCheckedChange: (checked: boolean) => void
}
```

Behavior the tests fix:

- Settle rule: the handler returning `true` calls `onOpenChange(false)`. `false`, a rejection or a synchronous throw keeps the dialog open and the field values untouched. Errors are swallowed; the consumer reports them through `errorMessage`.
- Pending belongs to one open session. When `open` becomes false the pattern resets pending and ignores any settlement still in flight, so a late `true` never closes a reopened dialog, and nothing runs after unmount.
- Pending is tracked by the pattern. While pending, Escape, outside press and the close button do not close, the cancel and submit buttons are disabled, a second submit is ignored, and the submit button shows `Spinner` and `submittingLabel` when given.
- Focus: when the submit button had focus at submit and the handler settles `false` or rejects, the pattern refocuses it once it is enabled again, because the disabled button drops focus while pending. The hook owns it: `run(action, focusTarget)` focuses `focusTarget` when pending ends without an accept, and `RecordDialog` passes the submit button only when it had focus. A synchronous throw never renders the pending state, so the button keeps focus on its own. A submit from a field (Mod+Enter) leaves focus where it was.
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
- `bodyWidth="readable"` puts `mx-auto w-full max-w-2xl` on the form, not on the panel, so the panel keeps scrolling at the popup's width while the fields keep a reading measure. It is a prop and not a formation's own wrapper so every formation in a `large` popup reuses it.
- `DialogHeader` holds two groups: `div[data-slot=dialog-heading]` (`flex flex-col gap-2`) with the title trail and the description, and, with `properties`, the bar after it as `div[data-slot=dialog-properties]` with `mt-2 flex flex-wrap items-center gap-2`. It is in the header and not in `children` so the bar stays in view while the panel scrolls, which leaves the body free. It is outside the form, so the consumer keeps its values in state and reads them in `onSubmit`.
- `actions` are consumer-owned header shortcuts, for example a button that opens the single (full record) view; navigation stays with the consumer and the pattern has no prop for it.
- Labels have no defaults; the consumer passes them. `cancelLabel` is optional and means no cancel button.
- The header is `ancestor › title`. The ancestor is outside `DialogTitle`, so the accessible name is the title only, and the trail is not a `nav`.
- Without `children` there is no panel; an empty native form still hosts the footer submit through the `form` attribute.
- The submit button sits outside the panel and points at the form with `form={id}`.
- `submitOnModEnter` blocks while pending or `submitDisabled`. The hint shows `⌘` on Apple platforms and `Ctrl` elsewhere, decided after mount; it is `aria-hidden` and the button carries `aria-keyshortcuts="Meta+Enter Control+Enter"`.
- `keepOpenOnSuccess` calls `form.reset()`, which does not touch React-controlled inputs: controlled fields reset their own state inside `onSubmit`. The generation and unmount guards still apply.
- `RecordDialogHeadline` always autofocuses the title, with no prop to turn it off: the Base UI `Dialog` focuses the first tabbable field on open anyway. The title is controlled so the consumer can drive `submitDisabled`; an uncontrolled description is cleared by the `form.reset()` above.
- `RecordDialogCreateMore` only renders the switch; the consumer passes its state to `keepOpenOnSuccess` and resets its fields after a save.

## Styling contract

`data-slot` names on the popup are left to COSS (`dialog-popup`), because COSS selectors depend on them.

| Attribute | Where | Meaning |
| --- | --- | --- |
| `data-pending` | the popup | the handler has not settled |
| `data-size` | the popup | `small`, `default` or `large` |
| `data-stretch` | the body wrapper | `stretchBody` is set |
| `data-body-width` | the form | `fill` or `readable` |
| `data-slot=dialog-actions` | the actions row | `absolute end-11 top-2` |
| `data-slot=dialog-title-trail` | the ancestor and title wrapper | only with `titleAncestor` |
| `data-slot=dialog-heading` | the title and description group in the header | always |
| `data-slot=dialog-properties` | the property bar in the header | only with `properties` |
| | `data-slot=dialog-footer-start` | the `footerStart` wrapper | only with `footerStart` |
| `aria-busy` | the form | the handler has not settled |

`data-slot` names: `record-dialog-form`, `dialog-error`, `record-dialog-submit-hint`, `record-dialog-cancel`, `record-dialog-submit`, `record-dialog-headline`, `record-dialog-create-more`.

Override exceptions, registered in `scripts/override-exceptions.json`:

- `DialogTitle` in `components/dialog-shell.tsx`: `text-foreground`, so the title matches the muted ancestor in size and keeps the theme's text token.
- The title `Input` and description `Textarea` in `record-dialog-headline.tsx`: `placeholder:text-muted-foreground/60`, back to `muted-foreground` on focus. The fields are `unstyled`, so the placeholder is the only sign of an empty field and recedes behind the content until focus.
- The submit hint `Kbd` (`record-dialog-submit-hint`) in `record-dialog.tsx`: `bg-primary-foreground/16 text-primary-foreground`. The hint sits on the `bg-primary` submit button, and the COSS `Kbd` pair `bg-muted text-muted-foreground` is meant for `background` and `muted`: on `primary` it measured 2.69:1 in light and 3.00:1 in dark, and axe failed the dialog stories that end with the submit enabled. `primary-foreground` is the pair the theme promises for `primary`, the same as the button label. The ratios are in `docs/accessibility.md`, under Registros de contraste (`RecordDialog`).

## Verify

```bash
bunx biome check packages/parttens/src/records/dialog
bun run typecheck && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
cd apps/storybook && bunx vitest run --project=storybook src/patterns/records/dialog
```

Run both Storybook projects (`storybook` and `storybook-dark`): color contrast differs per theme, and the submit hint failed only in `storybook-dark`.

The stories are in `apps/storybook/src/patterns/records/dialog/`, on the five component pages of `Patterns/Records/RecordDialog`, and all run axe with `test: 'error'`. The pattern has no bun tests.

- `Behavior`: the interface tests, one `play` per guarantee, in `behavior.stories.tsx`: the settle rule, the pending lock, focus return, reopen and unmount, Mod+Enter, `keepOpenOnSuccess`, the form, the alert, the header trail, the slots, the sizes, which widen the viewport with `page.viewport()` and restore it, and `stretchBody`, the headline and create-more parts, and `useRecordDraft`.
- `Behavior` renders only the formations of `record-dialog-layouts.tsx`: `Default` for the shell guarantees, `InlinePropertiesFormation` for `stretchBody`, `PropertyBarOverBodyFormation` for `bodyWidth`, `DescriptionOverBodyFormation` with `headline` off for the body under the dialog description, `Default` with `properties` for the header bar, and `RowPropertiesFormation` with `useRecordDraft` for the same-event commit. The reopen and unmount guarantees wrap `Default` in a harness whose `Open as page` action closes or unmounts the dialog, as a navigation would. Every value of `size`, `bodyWidth`, `stretchBody`, `submitDisabled` and `submitOnModEnter` has its own story, since there is no `Stories` page.
- `Layouts`: `layouts.stories.tsx`, `Default` first, then one story per formation.
- `Usages`: `usages.stories.tsx` holds `Contacts`, `Leads`, `Note`, `Project Setup` and `Events`; `usages/projects.stories.tsx` holds `Projects`, written inline in its story so the Code panel shows the whole body. `Note` sets `parameters.docs.source.inlineLimit` to 250. `records/group/usages.stories.tsx` imports `note-dialog.tsx` and `note-record.ts` by path for its Notes story. `collection/usages/contacts.stories.tsx`, `collection/fixtures/contacts-usage.tsx` and `collection/usages/calendar.stories.tsx` import `create-contact-dialog.tsx`, `create-event-dialog.tsx` and `event-record.ts` by path for the Contacts and Calendar usages of `Patterns/Collection`.
