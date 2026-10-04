# Properties pattern

Controlled property displays (date, date range, editable text, email, flag, icon and label, people, person, phone, reference, select, tags, text, attachments) that render one value each on a shared surface, plus two compositions: `PropertyCollection` (a `fieldset` of the visible properties of a catalog and a menu to toggle them) and `AssignedProperty` (a `PersonProperty` with assignee defaults). The consumer passes the value and options and receives the next value through `onValueChange`, or through `action` with a context carrying `previousValue`. The pattern never fetches, filters, persists or ships CSS; its only state is popover and combobox open state, popup drafts, the `EditableText` draft, the uncontrolled visibility of `PropertyCollection` and the chose-the-empty-option flag of `SelectProperty`.

## Map

| Folder | Holds |
| --- | --- |
| `composition/` | `PropertyCollection` and `assigned/` (`AssignedProperty`) |
| `display/<property>/` | one folder per display, each with its own `index.ts`; `display/index.ts` re-exports all but `phone-input/` |
| `hooks/` | `useEntryListEditor`: the popup session (drafts, row errors, save, diff) of email and phone |
| `shared/` | the surface, catalog, select and multi-select shells, calendar popover, entry form, add trigger, row `fieldset` |
| `shared/lib/` | `isEditable`/`emitChange` (handler rule), option lookup and diff, zod entry parser |
| `test/dom.ts` | the JSDOM setup the tests import |
| `core.ts` | React-free surface: catalog types, `propertyToneClassName`, date formatters; workspace only, not reached from the barrel |

Import direction: `composition/` → `display/`, `shared/`; `display/<property>/` → `hooks/`, `shared/`, other display folders; `hooks/` → `shared/lib/`; `shared/` → only COSS, Base UI, `@tc96/utils` and zod types, never a display, hook or composition. `composition/property-collection.tsx` also imports `MenuCheckboxOption` from `packages/parttens/src/shared/components/menu-selection-item.tsx`.

## Dependents

- `checklist` imports by file path, not through the barrel: `display/date/date-property.tsx`, `display/person/person-property.tsx` (`PersonProperty`, `PersonPropertyOption`) and `display/editable-text/editable-text.tsx` (`EditableText`, `EditableTextSize`). Renaming or moving these breaks `checklist`.
- `widgets` tests import `properties/test/dom.ts`. Moving it breaks `widgets`.
- `packages/parttens/src/index.ts` re-exports `properties/index`.

## Invariants

Handlers and surface:

- A display is read-only when `readOnly` is set or it has neither `action` nor `onValueChange` (`onCommit` for `TextProperty` and `EditableText`). With both, `action` runs and `onValueChange` does not. The rule lives in `shared/lib/property-change.ts`; `DateRangeProperty` has no `action` and keeps its own `!onValueChange` gate so the handler stays narrowed.
- `PropertySurface` with `aria-label` and no `role` or `render` gets `role="img"`; with `render={<button />}` the button keeps its role. Select shells render `role="img"` read-only and `role="combobox"` otherwise; tests assert no `select-item-indicator` is rendered.
- `PropertyCollection` reports ids in catalog order, so a property turned back on returns to its place. With `visible` passed, a menu click only calls `onVisibleChange`.

Dates:

- `serializeDatePropertyValue` returns noon UTC of the picked day (`new Date(2026, 5, 19)` gives `2026-06-19T12:00:00.000Z`). Picking the current value closes without emitting.
- An empty `DateProperty` renders the filled badge with `text-muted-foreground`, not the outline badge `muted` gives other empty states, so it sets no `data-empty`.
- `DateRangeProperty` formats without a time zone and stays open after the first click, because the calendar returns `from` and `to` on the same day; only the clear button closes it.

Select:

- A `null` from the consumer is absence (`muted`, `data-empty`, the `placeholder` label). When the user picks `emptyOptionLabel`, even over a `null`, the surface renders filled with that label and a `CircleDashedIcon` until a non-null `value` arrives. The flag is component state, so a remount that returns `null` shows absence again.

Editing:

- `EditableText` commits on blur and reads the draft from a ref, because the blur that Escape triggers would otherwise read unapplied state. Escape with a dirty draft restores and stops propagation; with a clean draft it bubbles, so in a dialog the first Escape cancels the edit and the second closes the dialog. A new `value` is ignored while focused.
- Email and phone popups copy drafts from `value` on open, so a `value` change while open does not overwrite typing. Enter saves and stops propagation, because the Base UI popup closes on Enter. The form sets `noValidate`: the browser bubble would block submit before the pattern's pt-BR message.
- `PhoneInput` takes the country from the number itself, even incomplete (`+551198`), before `defaultCountry`. `phoneNumberSchema` validates with the same library that formats the field; values are E.164.
- `TextProperty` swallows a rejected clipboard promise. With the inline field the accessible name belongs to the field; a labelled `img` around it would announce the value twice.

Markup:

- `AttachmentProperty` puts the link inside the surface: a button inside an anchor is invalid markup. The right-hand affordance is always remove; `action` only decides how the target opens.
- The multi-select add chip resets `[&_svg]:mx-0` because COSS `Button` brings `[&_svg]:-mx-0.5`.
- Default copy is pt-BR; the fallback `ariaLabel`s `Date`, `Person` and `Period` are English.

## Styling

The pattern sets these attributes and styles none of them through a variant:

| Attribute | Where |
| --- | --- |
| `data-slot="property-surface"`, `data-variant="badge\|plain"` | every `PropertySurface` |
| `data-empty="true"` | `PropertySurface` when `muted` |
| `data-slot`, `data-variant` | the row of email, people, phone, tags |
| `data-display="chips\|count"` | `[data-slot=tags-property]` |
| `data-editing="inline\|popover"` | editable `[data-slot=email-property]` |
| `data-attachment-type="audio\|doc\|link\|pdf"` | `[data-slot=attachment-type-icon]` |

- Colors only from theme tokens, never palette classes: `--*-foreground` is 700 in light and 400 in dark, while a literal `text-*-500` lost contrast on the light background.
- Hover-only affordances pair hover with `group-focus-within` and `pointer-coarse:opacity-100` (or `focus-visible:opacity-100` in popup rows).
- `scripts/override-exceptions.json` has one entry here: `AvatarFallback` with `bg-muted/40` in `display/person/person-option-content.tsx`. Changing those classes requires updating the entry.

## Verify

```bash
bun test --isolate packages/parttens/src/properties
bunx biome check packages/parttens/src/properties
bun run typecheck && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
cd apps/storybook && bunx vitest run --project=storybook src/patterns/properties
```

Stories in `apps/storybook/src/patterns/properties/` run axe with `test: 'error'`.

## Pointers

- Public API: `index.ts` and the `properties` entry of `docs/architecture/public-api-exports.json`. Props and defaults are in each display's source. The registry ships every file the barrel reaches; exporting from `shared/property-select-shell.tsx` or `display/phone-input/` needs a reason recorded in the architecture doc.
- Decisions: `docs/architecture/tc96-parttens.md`, section "Acessibilidade dos patterns" (10px avatar fallback as `text-[0.625rem]`, the `EditableText` caret as focus indicator, the calendar `color-contrast` exception in the `DateRangeProperty` stories).
