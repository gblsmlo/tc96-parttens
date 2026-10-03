# Properties pattern

Guide for agents working in `packages/parttens/src/properties`. The repo-wide rules in the root `AGENTS.md` still apply: no comments in code, Biome formatting, `cn` only at the boundary with an external `className`, COSS through `@tc96/ui/<component>`, no business rules inside the pattern. The folder uses `composition/`, `display/`, `shared/`, `types/`, `store/`, `test/` and `core.ts`; `display/` plays the role that `views/` plays in `collection-views`, one folder per property display.

## What it is

A set of controlled property displays (date, date range, editable text, email, flag, icon and label, people, person, phone, reference, select, tags, text, attachments) that render one value each on a shared surface, plus two compositions: `PropertyCollection`, a `fieldset` that shows the visible properties of a catalog and a menu to toggle them, and `AssignedProperty`, a `PersonProperty` with assignee defaults. The consumer passes the value and the options and receives the next value through `onValueChange`, or through `action` with a context that carries the previous value. The only state inside the pattern is popover and combobox open state, the drafts of the email and phone popups, the draft of `EditableText` and the uncontrolled visibility of `PropertyCollection`.

## Files

Top level:

| File | Owns | Public |
| --- | --- | --- |
| `index.ts` | the barrel: re-exports `composition/index.ts`, `display/index.ts` and `shared/index.ts` | yes |
| `core.ts` | the React-free surface: `PropertyIcon`, `PropertyPreset`, `PropertyTone`, `propertyToneClassName`, `PropertyVariant` | workspace only; not reached from the barrel |
| `types/index.ts` | the same type names as `core.ts`, without the class map | not reached from the barrel; nothing imports it |
| `store/index.ts` | an empty module (`export {}`); the pattern has no shared store | no |
| `test/dom.ts` | the JSDOM setup the test files import; the `widgets` tests import this copy too | — |
| `vite-env.d.ts` | the Vite client types reference; legacy from isolated development, nothing imports it and the registry does not ship it | no |

`composition/`, the compounds the consumer mounts:

| File | Owns | Public |
| --- | --- | --- |
| `composition/index.ts` | re-exports `assigned/index.ts`; exports `PropertyCollection`, `PropertyCollectionItem`, `PropertyCollectionProps` | through the barrel |
| `composition/property-collection.tsx` | `PropertyCollection`, `PropertyCollectionItem`, `PropertyCollectionProps`: the `fieldset`, the visible items and the preference `Menu` | yes |
| `composition/property-collection.test.tsx` | JSDOM tests with Testing Library | — |
| `composition/assigned/index.ts` | exports `AssignedProperty`, `AssignedPropertyBadge` and the `AssignedProperty*` types | through the barrel |
| `composition/assigned/assigned-property.tsx` | `AssignedProperty`, `AssignedPropertyBadge`, `AssignedPropertyActionContext`, `AssignedPropertyDropdownPlacement`, `AssignedPropertyOption`, `AssignedPropertyProps`: aliases over `PersonProperty` | yes |
| `composition/assigned/assigned-property.test.tsx` | JSDOM tests | — |

`shared/`, used by every display:

| File | Owns | Public |
| --- | --- | --- |
| `shared/index.ts` | re-exports `property-catalog.ts` and `property-surface.tsx`; `property-select-shell.tsx` stays internal | through the barrel |
| `shared/property-catalog.ts` | `PropertyIcon`, `PropertyTone`, `PropertyPreset`, `propertyToneClassName` | yes |
| `shared/property-surface.tsx` | `PropertySurface`, `PropertySurfaceProps`, `PropertyVariant`, `propertyBadgeClassName`: the badge or plain span every display renders on | yes |
| `shared/property-select-shell.tsx` | `PropertySelectShell`, `PropertySelectShellProps`, `PropertySelectDropdownPlacement`, `propertySelectItemClassName`: the COSS `Select` trigger and popup for single-value displays | no |

`display/`, one folder per property; `display/index.ts` re-exports every folder's `index.ts` except `phone-input/`:

| File | Owns | Public |
| --- | --- | --- |
| `display/index.ts` | the display barrel | through the barrel |
| `display/attachments/index.ts` | exports `AttachmentProperty`, `AttachmentPropertyProps`, `AttachmentType`, `AttachmentsProperty`, `AttachmentsPropertyAction`, `AttachmentsPropertyProps` | through the barrel |
| `display/attachments/attachment-property.tsx` | `AttachmentProperty`, `AttachmentPropertyProps`: a surface wrapping an `a` and an optional remove button | yes |
| `display/attachments/attachments-property.tsx` | `AttachmentsProperty`, `AttachmentsPropertyAction`, `AttachmentsPropertyProps`: the `fieldset` row with one add action | yes |
| `display/attachments/attachment-type.tsx` | `AttachmentType`, `attachmentTypeCatalog`, `AttachmentTypeIcon`, `AttachmentTypeIconProps` | only `AttachmentType` |
| `display/attachments/attachments-property.test.tsx` | JSDOM tests | — |
| `display/date/index.ts` | exports `DateProperty`, `DatePropertyBadge`, `DatePropertyActionContext`, `DatePropertyDropdownPlacement`, `DatePropertyProps`, `formatDateProperty`, `parseDatePropertyValue`, `serializeDatePropertyValue` | through the barrel |
| `display/date/date-property.tsx` | the names above: popover with COSS `Calendar` in `mode="single"` and the clear button | yes |
| `display/date/date-property.test.tsx` | JSDOM tests | — |
| `display/date-range/index.ts` | exports `DateRange`, `DateRangeProperty`, `DateRangePropertyProps`, `formatDateRangeProperty` | through the barrel |
| `display/date-range/date-range-property.tsx` | the names above; `DateRange` is re-exported from `@daypicker/react` | yes |
| `display/date-range/date-range-property.test.tsx` | JSDOM tests | — |
| `display/editable-text/index.ts` | exports `EditableText`, `EditableTextProps`, `EditableTextSize` | through the barrel |
| `display/editable-text/editable-text.tsx` | `EditableText`, `EditableTextProps`, `EditableTextSize`: the in-place `input` or `textarea` with a local draft | yes |
| `display/editable-text/editable-text.test.tsx` | JSDOM tests | — |
| `display/email/index.ts` | exports `EmailProperty`, `EmailPropertyActionContext`, `EmailPropertyProps` | through the barrel |
| `display/email/email-property.tsx` | the names above and the internal `AddTrigger`: chips row, popup form or inline `EditableText` | yes |
| `display/email/email-property.test.tsx` | JSDOM tests | — |
| `display/flag/index.ts` | exports `FlagProperty`, `FlagPropertyIcon`, `FlagPropertyProps` | through the barrel |
| `display/flag/flag-property.tsx` | the names above, over `IconLabelProperty` | yes |
| `display/flag/flag-property.test.tsx` | JSDOM tests | — |
| `display/icon-label/index.ts` | exports `IconLabelProperty`, `IconLabelPropertyIcon`, `IconLabelPropertyProps` | through the barrel |
| `display/icon-label/icon-label-property.tsx` | the names above and `IconLabelPropertyTrailingVisibility`: the base of `TextProperty`, `FlagProperty`, `ReferenceProperty`, the email and phone chips and `AttachmentProperty` | all but `IconLabelPropertyTrailingVisibility` |
| `display/icon-label/icon-label-property.test.tsx` | JSDOM tests | — |
| `display/people/index.ts` | exports `PeopleProperty`, `PeoplePropertyActionContext`, `PeoplePropertyDropdownPlacement`, `PeoplePropertyOption`, `PeoplePropertyProps` | through the barrel |
| `display/people/people-property.tsx` | the names above and the internal `PersonChipContent`: COSS `Combobox` with `multiple` and avatar chips | yes |
| `display/people/people-property.test.tsx` | JSDOM tests | — |
| `display/person/index.ts` | exports `PersonProperty`, `PersonPropertyBadge`, `PersonPropertyActionContext`, `PersonPropertyDropdownPlacement`, `PersonPropertyOption`, `PersonPropertyProps` | through the barrel |
| `display/person/person-property.tsx` | the names above and the internal `PersonPropertyContent`, `findPersonOption`: single person over `PropertySelectShell` | yes |
| `display/person/person-property.test.tsx` | JSDOM tests | — |
| `display/phone/index.ts` | exports `PhoneProperty`, `PhonePropertyActionContext`, `PhonePropertyProps` | through the barrel |
| `display/phone/phone-property.tsx` | the names above: chips row and popup form with `PhoneInput` | yes |
| `display/phone/phone-property.test.tsx` | JSDOM tests | — |
| `display/phone-input/index.ts` | exports `PhoneCountryCode`, `PhoneInput`, `PhoneInputProps`, `defaultPhoneCountry`, `PhoneNumberSchemaOptions`, `phoneNumberSchema` | no; reached by `phone-property.tsx`, so the registry ships it |
| `display/phone-input/phone-input.tsx` | `PhoneInput`, `PhoneInputProps`: country `Combobox` plus `react-phone-number-input` field inside a COSS `InputGroup` | no |
| `display/phone-input/phone-number.ts` | `defaultPhoneCountry` (`'BR'`), `phoneNumberCountry`, `nationalDigits`, `PhoneNumberSchemaOptions`, `phoneNumberSchema` | no |
| `display/phone-input/countries.ts` | `PhoneCountryCode`, `PhoneCountry`, `phoneCountries` (pt-BR names, sorted), `findPhoneCountry` | no |
| `display/phone-input/phone-input.test.tsx` | JSDOM tests, including `phoneNumberSchema` | — |
| `display/reference/index.ts` | exports `ReferenceProperty`, `ReferencePropertyKind`, `ReferencePropertyProps` | through the barrel |
| `display/reference/reference-property.tsx` | the names above: `kind` to icon map over `IconLabelProperty`; no test file | yes |
| `display/select/index.ts` | exports `SelectProperty`, `SelectPropertyActionContext`, `SelectPropertyDropdownPlacement`, `SelectPropertyGroup`, `SelectPropertyOption`, `SelectPropertyProps` | through the barrel |
| `display/select/select-property.tsx` | the names above and `SelectPropertyItems`: consumer catalog over `PropertySelectShell` | all but `SelectPropertyItems` |
| `display/select/select-property.test.tsx` | JSDOM tests | — |
| `display/tags/index.ts` | exports `TagsProperty`, `TagsPropertyActionContext`, `TagsPropertyDropdownPlacement`, `TagsPropertyOption`, `TagsPropertyProps` | through the barrel |
| `display/tags/tags-property.tsx` | the names above: COSS `Combobox` with `multiple`, chips or count | yes |
| `display/tags/tags-property.test.tsx` | JSDOM tests | — |
| `display/text/index.ts` | exports `TextProperty`, `TextPropertyIcon`, `TextPropertyProps` | through the barrel |
| `display/text/text-property.tsx` | the names above and `TextPropertyEditing`: value, fallback, copy button and in-place `EditableText` | all but `TextPropertyEditing` |
| `display/text/text-property.test.tsx` | JSDOM tests | — |

Only what `index.ts` exports is public, and the current list is the `properties` entry of `docs/architecture/public-api-exports.json`. The registry copies every file this barrel reaches, so a new file must be imported from one of these, and nothing in `shared/property-select-shell.tsx` or `display/phone-input/` should be exported from the barrel without a reason recorded in `docs/architecture/tc96-parttens.md`. `styles/global.css` was removed on 2026-10-03 (patterns carry no CSS), and `vite-env.d.ts` stays only until the pattern's next restructuring. `types/index.ts` and `store/index.ts` hold no code the pattern uses today; a layer is kept only while it has code to hold.

Import direction inside the folder: `composition/` → `display/` and `shared/`; `display/<property>/` → `shared/` and other display folders (`email`, `text` → `editable-text` and `icon-label`; `flag`, `reference`, `attachments` → `icon-label`; `phone` → `phone-input` and `icon-label`; `date-range` → `date` for a type; `assigned` → `person`); `shared/` imports only COSS, Base UI and `@tc96/utils`, never a display or a composition. `composition/property-collection.tsx` also imports `MenuCheckboxOption` from `packages/parttens/src/shared/components/menu-selection-item.tsx`, outside this pattern.

## Public API

```ts
interface PropertyCollectionItem {
  id: string
  label: string                      // name in the preference menu
  icon?: PropertyIcon
  defaultVisible?: boolean
  render: () => React.ReactNode      // the property rendered when visible
}

interface PropertyCollectionProps {
  items: readonly PropertyCollectionItem[]   // catalog, in display order
  ariaLabel?: string
  className?: string
  defaultVisible?: readonly string[]        // uncontrolled; overrides the items' flags
  menuLabel?: string                        // default 'Propriedades'
  readOnly?: boolean                        // hides the preference trigger
  triggerLabel?: string                     // default 'Ajustar propriedades'
  visible?: readonly string[]               // controlled
  onVisibleChange?: (visible: readonly string[]) => void
}

interface AssignedPropertyProps<TValue extends string = string> {
  value: TValue | null
  options: readonly AssignedPropertyOption<TValue>[]   // = PersonPropertyOption
  action?: (value: TValue, context: AssignedPropertyActionContext<TValue>) => void
  ariaLabel?: string                 // default 'Responsável'
  className?: string
  disabled?: boolean
  dropdownPlacement?: AssignedPropertyDropdownPlacement
  placeholder?: string               // default 'Sem responsável'
  readOnly?: boolean
  variant?: PropertyVariant          // 'badge' | 'plain'
  onValueChange?: (value: TValue) => void
}

interface PropertySurfaceProps extends useRender.ComponentProps<'span'> {
  variant?: PropertyVariant          // default 'badge'
  muted?: boolean                    // absence: Badge 'outline' instead of 'secondary'
}

interface DatePropertyProps {
  value: string | null               // ISO string
  action?: (value: string | null, context: DatePropertyActionContext) => void
  allowClear?: boolean               // default true
  ariaLabel?: string                 // default 'Date'
  calendarProps?: Omit<ComponentProps<typeof Calendar>, 'defaultMonth' | 'mode' | 'onSelect' | 'selected'>
  className?: string
  clearLabel?: string                // default 'Limpar data'
  fallback?: string                  // default 'Sem data'
  disabled?: boolean
  displayLabel?: string              // replaces the formatted date
  dropdownPlacement?: DatePropertyDropdownPlacement
  isOverdue?: boolean                // adds font-medium only
  locale?: string                    // default 'en-US'
  readOnly?: boolean
  serializeDate?: (date: Date) => string   // default serializeDatePropertyValue
  timeZone?: string                  // default 'UTC'
  variant?: PropertyVariant
  onValueChange?: (value: string | null) => void
}

interface DateRangePropertyProps {
  value: DateRange | undefined       // the calendar's own type
  allowClear?: boolean
  ariaLabel?: string                 // default 'Period'
  calendarProps?: DatePropertyProps['calendarProps']
  className?: string
  clearLabel?: string                // default 'Limpar período'
  disabled?: boolean
  dropdownPlacement?: DatePropertyDropdownPlacement
  fallback?: string                  // default 'Sem período'
  locale?: string                    // default 'en-US'; no timeZone
  numberOfMonths?: number            // default 2
  readOnly?: boolean
  variant?: PropertyVariant
  onValueChange?: (value: DateRange | undefined) => void
}

interface EditableTextProps {
  ariaLabel: string
  className?: string
  emptyValue?: string                // the entity's literal "empty"; cleared on focus
  multiline?: boolean                // textarea; Enter no longer commits
  placeholder?: string
  readOnly?: boolean                 // renders a span
  revertWhenEmpty?: boolean          // empty draft restores the value instead of committing null
  size?: EditableTextSize            // 'sm' | 'base' | 'lg' | 'xl'
  type?: 'email' | 'text'
  value: string | null
  onCommit: (value: string | null) => void
}

interface EmailPropertyProps {
  value: readonly string[]
  action?: (value: readonly string[], context: EmailPropertyActionContext) => void
  addDisabled?: boolean              // hides the add path; removal stays
  addLabel?: string                  // default 'Adicionar e-mail'
  ariaLabel?: string                 // default 'E-mails'
  className?: string
  disabled?: boolean
  display?: 'chips' | 'trigger'      // default 'chips'
  editing?: 'inline' | 'popover'     // default 'popover'
  entryLabels?: readonly string[]    // default ['Principal', 'Secundário']; its length is the cap
  errorMessage?: string | null       // the consumer's refusal
  inputPlaceholder?: string          // default 'nome@exemplo.com'
  placeholder?: string               // default 'Sem e-mail'
  readOnly?: boolean
  variant?: PropertyVariant          // default 'plain'
  onValueChange?: (value: readonly string[]) => void
}

interface PhonePropertyProps {       // same shape as EmailPropertyProps, minus `editing`
  value: readonly string[]           // E.164
  action?: (value: readonly string[], context: PhonePropertyActionContext) => void
  addDisabled?: boolean
  addLabel?: string                  // default 'Adicionar telefone'
  ariaLabel?: string                 // default 'Telefones'
  className?: string
  defaultCountry?: PhoneCountryCode  // default 'BR'
  disabled?: boolean
  display?: 'chips' | 'trigger'
  entryLabels?: readonly string[]
  errorMessage?: string | null
  inputPlaceholder?: string
  placeholder?: string               // default 'Sem telefone'
  readOnly?: boolean
  variant?: PropertyVariant          // default 'plain'
  onValueChange?: (value: readonly string[]) => void
}

interface FlagPropertyProps {
  active: boolean
  label: string
  activeIcon?: FlagPropertyIcon
  ariaLabel?: string
  className?: string
  iconClassName?: string
  inactiveLabel?: string
  inactiveIcon?: FlagPropertyIcon
  showInactive?: boolean             // default false: inactive renders null
  variant?: PropertyVariant
}

interface IconLabelPropertyProps {
  label: ReactNode
  ariaLabel?: string
  className?: string
  icon?: IconLabelPropertyIcon
  iconClassName?: string
  leading?: ReactNode
  muted?: boolean
  render?: PropertySurfaceProps['render']
  trailing?: ReactNode
  trailingVisibility?: 'always' | 'hover'
  variant?: PropertyVariant
}

interface PeoplePropertyOption<TValue extends string = string> {
  value: TValue
  label: string
  fallback?: string                  // avatar initials
  imageUrl?: string
  supportingLabel?: string
}
interface PeoplePropertyProps<TValue extends string = string> {
  value: readonly TValue[]
  options: readonly PeoplePropertyOption<TValue>[]
  action?: (value: readonly TValue[], context: PeoplePropertyActionContext<TValue>) => void
  ariaLabel?: string                 // default 'Pessoas'
  className?: string
  disabled?: boolean
  dropdownPlacement?: PeoplePropertyDropdownPlacement
  isLoading?: boolean
  placeholder?: string               // default 'Adicionar pessoa'
  readOnly?: boolean
  variant?: PropertyVariant          // default 'plain'
  onValueChange?: (value: readonly TValue[]) => void
}

interface PersonPropertyProps<TValue extends string = string> {
  value: TValue | null
  options: readonly PersonPropertyOption<TValue>[]   // same fields as PeoplePropertyOption
  action?: (value: TValue, context: PersonPropertyActionContext<TValue>) => void
  ariaLabel?: string                 // default 'Person'
  className?: string
  disabled?: boolean
  display?: 'avatar' | 'full'        // default 'full'
  dropdownPlacement?: PersonPropertyDropdownPlacement
  placeholder?: string               // default 'Sem responsável'
  readOnly?: boolean
  variant?: PropertyVariant
  onValueChange?: (value: TValue) => void
}

interface ReferencePropertyProps {
  label: string
  ariaLabel?: string
  className?: string
  kind?: 'account' | 'product' | 'record'   // default 'record'
  variant?: PropertyVariant
}

interface SelectPropertyOption { label: string; value: string; icon?: PropertyIcon; tone?: PropertyTone }
interface SelectPropertyGroup { label: string; options: readonly SelectPropertyOption[] }
type SelectPropertyProps = {
  ariaLabel: string                  // required: no domain to derive a label from
  value: string | null
  action?: (value: string | null, context: SelectPropertyActionContext) => void
  className?: string
  disabled?: boolean
  dropdownPlacement?: SelectPropertyDropdownPlacement
  placeholder?: string               // label of the absent value
  fallback?: string                  // default '—', when value is outside the catalog
  emptyOptionLabel?: string          // adds an item that reports null
  readOnly?: boolean
  variant?: PropertyVariant
  onValueChange?: (value: string | null) => void
} & (
  | { groups?: undefined; options: readonly SelectPropertyOption[] }
  | { groups: readonly SelectPropertyGroup[]; options?: undefined }
)

interface TagsPropertyProps<TValue extends string = string> {
  value: readonly TValue[]
  options: readonly TagsPropertyOption<TValue>[]   // { label, value }
  action?: (value: readonly TValue[], context: TagsPropertyActionContext<TValue>) => void
  ariaLabel?: string                 // default 'Tags'
  className?: string
  disabled?: boolean
  display?: 'chips' | 'count'        // default 'chips'
  dropdownPlacement?: TagsPropertyDropdownPlacement
  isLoading?: boolean
  placeholder?: string               // default 'Adicionar uma tag'
  readOnly?: boolean
  variant?: PropertyVariant          // default 'plain'
  onValueChange?: (value: readonly TValue[]) => void
}

interface TextPropertyProps {
  value: string | null
  addLabel?: string                  // name of the fill trigger; falls back to `fallback`
  ariaLabel?: string
  className?: string
  copyLabel?: string                 // absent: no copy button
  disabled?: boolean                 // keeps onCommit but renders read-only
  editing?: 'inline' | 'trigger'     // default 'trigger'
  fallback?: string                  // default 'Não informado'
  icon?: TextPropertyIcon
  inputPlaceholder?: string
  iconClassName?: string
  trailingVisibility?: 'always' | 'hover'
  variant?: PropertyVariant
  onCommit?: (value: string | null) => void   // absent: read-only
}

interface AttachmentPropertyProps extends Omit<ComponentPropsWithoutRef<'a'>, 'children' | 'download'> {
  action?: 'anchor' | 'download'     // default 'anchor'
  label: ReactNode
  onRemove?: () => void              // absent: no remove button
  removeLabel?: string               // default 'Remover anexo'
  type?: AttachmentType              // 'audio' | 'doc' | 'link' | 'pdf'
}
interface AttachmentsPropertyAction { label: string; onSelect: () => void; disabled?: boolean; icon?: ComponentType<SVGProps<SVGSVGElement>> }
interface AttachmentsPropertyProps { children?: ReactNode; action?: AttachmentsPropertyAction; ariaLabel?: string; className?: string }
```

Every `*ActionContext` carries `previousValue`; the single-value ones add `option` (person, assigned) or `date` (date), and the multi-value ones add `added` and `removed`. The free functions are `formatDateProperty(value, fallback, locale, timeZone)`, `parseDatePropertyValue`, `serializeDatePropertyValue`, `formatDateRangeProperty(value, fallback, locale)` and the `propertyToneClassName` map.

Other code that depends on this pattern: `packages/parttens/src/index.ts` re-exports the barrel; `checklist` imports `EditableText` and `EditableTextSize` from `display/editable-text/editable-text.tsx`, `DateProperty` from `display/date/date-property.tsx` and `PersonProperty`, `PersonPropertyOption` from `display/person/person-property.tsx` by file path, not through the barrel; the `widgets` tests import `properties/test/dom.ts`. Renaming or moving any of those files breaks `checklist` and `widgets`.

Behavior worth knowing before changing it:

- Every display is controlled and becomes read-only when it has no handler: `readOnly` or the absence of both `action` and `onValueChange` (or of `onCommit` in `TextProperty` and `EditableText`) renders the value on a `PropertySurface` with no trigger. When both handlers exist, `action` runs and `onValueChange` does not.
- `PropertySurface` renders the COSS `Badge` (`secondary` for a value, `outline` when `muted`) or, with `variant="plain"`, a `span`. A surface that receives `aria-label` without `role` or `render` gets `role="img"`; with `render={<button />}` the button keeps its role. The badge metric is `propertyBadgeClassName` (24px); color and radius stay with the consumer's `Badge`.
- `PropertySelectShell` (person, select, assigned) renders the surface with `role="img"` when read-only and a COSS `Select` trigger with `role="combobox"` otherwise; `propertySelectItemClassName` hides the item check indicator, and the tests assert that no `select-item-indicator` is rendered.
- `PropertyCollection` is uncontrolled unless `visible` is passed; the initial set is `defaultVisible` or the items flagged `defaultVisible`. Toggling always reports ids in catalog order, so a property that is turned back on returns to its place. With `visible`, clicking a menu item calls `onVisibleChange` and changes nothing on its own. The menu items are `menuitemcheckbox` and do not close the menu on click.
- `DateProperty` formats with `formatShortDate` (day and short month, no year) in `locale` `'en-US'` and `timeZone` `'UTC'` by default. `serializeDatePropertyValue` returns noon UTC of the picked day (`new Date(2026, 5, 19)` gives `2026-06-19T12:00:00.000Z`). Picking the current value closes the popover without emitting; the clear button emits `null`. `DatePropertyBadge` is the read-only rendering.
- `DateRangeProperty` keeps the calendar's `DateRange`, formats without a time zone (local day markers) and labels an open range as `A partir de <from>` or `Até <to>`. The popover stays open after the first click, because the calendar returns `from` and `to` on the same day there; only the clear button closes it.
- `EditableText` keeps a local draft and commits on blur. Enter blurs a single-line field (one commit, from the blur); in `multiline` Enter inserts a line break. Escape with a dirty draft restores the confirmed value, stops propagation and blurs; with a clean draft it bubbles, so inside a dialog the first Escape cancels the edit and the second closes the dialog. An empty draft commits `null`, or restores the value under `revertWhenEmpty`. `emptyValue` is cleared on focus and does not count as an edit. A new `value` is ignored while the field is focused. Sizes map to `text-sm`, `text-base`, `text-2xl`, `text-[2rem]`.
- `TextProperty` with an empty value and `editing="trigger"` renders a `+ fallback` button that swaps to the inline field; `editing="inline"` renders the field whenever editable. `copyLabel` with a value adds a copy button over `copyToClipboard`; a rejected clipboard promise is swallowed.
- `EmailProperty` and `PhoneProperty` share one anatomy: a `fieldset` of chips with a remove button named `Remover e-mail <x>` / `Remover telefone <x>`, and an add trigger that reads `placeholder` when empty and collapses to `+` with `addLabel` as accessible name once there are values. The popup edits the whole list: `entryLabels` caps the rows, `Adicionar outro` is enabled only when every draft is valid and the cap is not reached, blank rows are skipped, invalid or duplicate rows get a `role="alert"` message, `errorMessage` is the consumer's refusal, and Enter inside a field saves and stops propagation because the Base UI popup closes on Enter. `display="trigger"` replaces the chips by one trigger that keeps naming the property. `addDisabled` removes the add path and keeps removal. Email format is `z.email`; phone format is `phoneNumberSchema` and values are E.164. `EmailProperty` also offers `editing="inline"`, where the trigger becomes an `EditableText` that stays open with the message when the address is rejected.
- `PhoneInput` takes the country from the number itself before `defaultCountry` (`'BR'`), rewrites the calling code and keeps the national digits when the country changes, disables both the field and the country selector under `readOnly`, and fires `onKeyDown` only from the number field. Country names come from `react-phone-number-input/locale/pt-BR.json`.
- `TagsProperty` and `PeopleProperty` wrap the COSS `Combobox` with `multiple`: a labelled chip opens the list when empty (`Adicionar tag`, `placeholder` for people) and collapses to `+` with an `aria-label` once there are values; the popup is `w-64`, aligned `end` by default and has no search field; `isLoading` shows a `ComboboxStatus`. A value missing from `options` is rendered with the value as its label. `display="count"` on tags shows the count in a ghost button. Default `variant` is `plain`, and the chips are the COSS `ComboboxChip` without pattern styling.
- `PersonProperty` with `display="avatar"` hides the name but keeps `ariaLabel: label` as accessible name, and shows a `UserIcon` in the fallback when there is no person. The avatar is 16px on a badge and 28px on a plain surface; `supportingLabel` is hidden below `sm`.
- `SelectProperty` takes `options` or `groups`, never both. `emptyOptionLabel` adds an item with value `''` that reports `null`; a value outside the catalog shows `fallback`; with `null` the accessible name is `ariaLabel` alone, otherwise `ariaLabel: label`.
- `FlagProperty` returns `null` when inactive unless `showInactive`. `ReferenceProperty` maps `kind` to `Building2Icon`, `PackageIcon` or `BoxIcon`. `IconLabelProperty` with `trailing` and `ariaLabel` takes `role="group"` so the trailing button stays in the accessibility tree.
- `AttachmentProperty` is a surface wrapping an `a` (`download` attribute only with `action="download"`) and an optional remove button; the type icon sits on the left. `AttachmentsProperty` renders its children and a single `action` trigger that shows `action.label` when empty and collapses to `+` once it has children; `action.disabled` disables the button.
- Default copy is pt-BR (`Sem data`, `Limpar período`, `Adicionar telefone`, `Carregando tags…`); the fallback `ariaLabel`s `Date`, `Person` and `Period` are English.

## Styling contract

State lives in `data-*` attributes; this pattern sets them for consumers and tests and styles none of them through a variant:

| Attribute | Where | Styled by |
| --- | --- | --- |
| `data-slot="property-surface"`, `data-variant="badge\|plain"` | every `PropertySurface` | consumers; the pattern picks the `Badge` variant and `text-muted-foreground` in code |
| `data-empty="true"` | `PropertySurface` when `muted` | consumers |
| `data-slot`, `data-variant` | the `fieldset` or `div` of `email-property`, `people-property`, `phone-property`, `tags-property` | consumers; tests read `dataset.variant` |
| `data-display="chips\|count"` | `[data-slot=tags-property]` | consumers |
| `data-editing="inline\|popover"` | the editable `[data-slot=email-property]` | consumers |
| `data-attachment-type="audio\|doc\|link\|pdf"` | `[data-slot=attachment-type-icon]` | consumers; the tone comes from `propertyToneClassName` |

There is no `cva` in this pattern; the class maps are `propertyBadgeClassName` and the plain-surface string in `shared/property-surface.tsx`, `propertyToneClassName` in `shared/property-catalog.ts` (`danger`, `info`, `neutral`, `success`, `warning` → `text-destructive-foreground`, `text-info-foreground`, `text-muted-foreground`, `text-success-foreground`, `text-warning-foreground`), `propertySelectItemClassName` in `shared/property-select-shell.tsx`, and `sizeClassName` and `fieldClassName` in `display/editable-text/editable-text.tsx`. Hover-only affordances pair `group-hover/property:opacity-100` with `group-focus-within/property:opacity-100` and `pointer-coarse:opacity-100` (`icon-label-property`) or `group-hover/entry` with `group-focus-within/entry` and `focus-visible:opacity-100` (email and phone popup rows). Colors come only from theme tokens (`text-muted-foreground`, `text-foreground`, `text-destructive-foreground`, `bg-muted/40`, `bg-input`, `hover:bg-accent`, `ring-ring`, `ring-offset-background`); no palette colors.

Two entries in `scripts/override-exceptions.json` belong to this pattern: `AvatarFallback` with `bg-muted/40` in `display/people/people-property.tsx` and in `display/person/person-property.tsx`. Any change to those classes must update the entry, or `bun run overrides:check` fails.

Decisions recorded on 2026-10-03 in `docs/architecture/tc96-parttens.md`, section "Acessibilidade dos patterns", that apply here: the 10px avatar fallback uses the single spelling `text-[0.625rem]` (people and person) until the consumer declares a `--text-2xs: 0.625rem` token, which is a note to the consumer and not a change in `packages/ui`; the `EditableText` field keeps `w-full bg-transparent outline-none placeholder:text-muted-foreground` with the caret as the focus indicator, which the audit lists as not a finding; `icon-label-property` already followed the hover, focus-within and coarse-pointer pair.

`data-slot` names set by this pattern: `property-collection`, `property-surface`, `property-trailing`, `editable-text`, `email-property`, `people-property`, `phone-property`, `phone-input`, `tags-property`, `text-property-copy`, `attachment-property`, `attachment-property-link`, `attachment-property-remove`, `attachment-type-icon`, `attachments-property`. The tests also query COSS slots (`combobox-chip`, `combobox-positioner`, `select-item-indicator`), which belong to `packages/ui`.

## Verify

```bash
bun test --isolate packages/parttens/src/properties
bunx biome check packages/parttens/src/properties
bun run typecheck && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
cd apps/storybook && bunx vitest run --project=storybook src/patterns/properties
```

The stories live in `apps/storybook/src/patterns/properties/` and run axe with `test: 'error'`: `composition/property-collection.stories.tsx` (`Patterns/Properties/Groups`), `composition/assigned-property.stories.tsx` (`Patterns/Properties/Display/Assigned`), and under `display/`: `attachments-property` (`Patterns/Properties/Display/Attachments`), `date-property` (`Patterns/Properties/Display/Date`), `date-range-property` (`Patterns/Properties/Display/DateRange`), `editable-text` (`Patterns/Properties/Display/Editable Text`), `email-property` (`Patterns/Properties/Display/Email`), `flag-property` (`Patterns/Properties/Display/Flag`), `people-property` (`Patterns/Properties/Display/People`), `person-property` (`Patterns/Properties/Display/Person`), `phone-property` (`Patterns/Properties/Display/Phone`), `reference-property` (`Patterns/Properties/Display/Reference`), `select-property` (`Patterns/Properties/Display/Select`), `tags-property` (`Patterns/Properties/Display/Tags`), `text-property` (`Patterns/Properties/Display/Text`). The `Trigger` and `CalendarLocale` stories of `DateRangeProperty` disable the `color-contrast` rule for the COSS calendar, as recorded in the architecture doc.
