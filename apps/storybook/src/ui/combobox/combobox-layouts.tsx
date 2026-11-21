import { Button } from '@tc96/ui/button'
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
} from '@tc96/ui/combobox'
import { Field, FieldDescription, FieldLabel } from '@tc96/ui/field'
import { ChevronsUpDownIcon, SearchIcon } from 'lucide-react'
import { Fragment } from 'react'
import {
  type ComboboxControls,
  comboboxControlArgs,
} from './combobox-controls.ts'
import {
  type ComboboxOption,
  type ComboboxOptionGroup,
  comboboxOptionGroups,
  comboboxOptions,
} from './combobox-variants.ts'

interface ComposedComboboxProps extends ComboboxControls {
  defaultValue?: readonly string[]
  name?: string
  onOpenChange?: (open: boolean) => void
  onValueChange?: (value: unknown) => void
}

interface OptionsPopupProps {
  empty: string
}

interface FieldComboboxProps {
  name?: string
  required?: boolean
}

const { empty, label, placeholder } = comboboxControlArgs

const OptionsPopup = ({ empty }: Readonly<OptionsPopupProps>) => (
  <ComboboxPopup>
    {empty ? <ComboboxEmpty>{empty}</ComboboxEmpty> : null}
    <ComboboxList>
      {(item: ComboboxOption) => (
        <ComboboxItem key={item.value} value={item}>
          {item.label}
        </ComboboxItem>
      )}
    </ComboboxList>
  </ComboboxPopup>
)

const selectedOptions = (values: readonly string[] = []) =>
  comboboxOptions.filter((option) => values.includes(option.value))

export const ComposedCombobox = ({
  defaultValue,
  disabled,
  empty,
  invalid,
  label,
  multiple,
  name,
  onOpenChange,
  onValueChange,
  open,
  placeholder,
  showClear,
  showTrigger,
  size,
  startAddon,
}: Readonly<ComposedComboboxProps>) => {
  const addon = startAddon ? <SearchIcon /> : undefined
  const selected = selectedOptions(defaultValue)

  if (multiple) {
    return (
      <Combobox
        defaultOpen={open}
        defaultValue={selected}
        disabled={disabled}
        items={comboboxOptions}
        key={String(open)}
        multiple
        name={name}
        onOpenChange={onOpenChange}
        onValueChange={onValueChange}
      >
        <ComboboxChips startAddon={addon}>
          <ComboboxValue>
            {(value: ComboboxOption[]) => (
              <>
                {value.map((item) => (
                  <ComboboxChip
                    key={item.value}
                    removeProps={{ 'aria-label': `Remove ${item.label}` }}
                  >
                    {item.label}
                  </ComboboxChip>
                ))}
                <ComboboxChipsInput
                  aria-invalid={invalid || undefined}
                  aria-label={label}
                  placeholder={value.length > 0 ? undefined : placeholder}
                  size={size}
                />
              </>
            )}
          </ComboboxValue>
        </ComboboxChips>
        <OptionsPopup empty={empty} />
      </Combobox>
    )
  }

  return (
    <Combobox
      defaultOpen={open}
      defaultValue={selected[0] ?? null}
      disabled={disabled}
      items={comboboxOptions}
      key={String(open)}
      name={name}
      onOpenChange={onOpenChange}
      onValueChange={onValueChange}
    >
      <ComboboxInput
        aria-invalid={invalid || undefined}
        aria-label={label}
        placeholder={placeholder}
        showClear={showClear}
        showTrigger={showTrigger}
        size={size}
        startAddon={addon}
      />
      <OptionsPopup empty={empty} />
    </Combobox>
  )
}

export const GroupedCombobox = () => (
  <Combobox defaultOpen items={comboboxOptionGroups}>
    <ComboboxInput aria-label={label} placeholder={placeholder} />
    <ComboboxPopup>
      <ComboboxEmpty>{empty}</ComboboxEmpty>
      <ComboboxList>
        {(group: ComboboxOptionGroup) => (
          <Fragment key={group.value}>
            <ComboboxGroup items={group.items}>
              <ComboboxGroupLabel>{group.value}</ComboboxGroupLabel>
              <ComboboxCollection>
                {(item: ComboboxOption) => (
                  <ComboboxItem key={item.value} value={item}>
                    {item.label}
                  </ComboboxItem>
                )}
              </ComboboxCollection>
            </ComboboxGroup>
            <ComboboxSeparator />
          </Fragment>
        )}
      </ComboboxList>
    </ComboboxPopup>
  </Combobox>
)

export const InputInsidePopupCombobox = ({
  defaultOpen = true,
}: Readonly<{ defaultOpen?: boolean }>) => (
  <Combobox defaultOpen={defaultOpen} items={comboboxOptions}>
    <ComboboxTrigger
      aria-label={label}
      render={<Button className="w-full justify-between" variant="outline" />}
    >
      <ComboboxValue placeholder={placeholder} />
      <ChevronsUpDownIcon aria-hidden="true" />
    </ComboboxTrigger>
    <ComboboxPopup aria-label={label}>
      <div className="border-b p-2">
        <ComboboxInput
          aria-label={`Search ${label.toLowerCase()}`}
          placeholder="Search…"
          showTrigger={false}
          startAddon={<SearchIcon />}
        />
      </div>
      <ComboboxEmpty>{empty}</ComboboxEmpty>
      <ComboboxList>
        {(item: ComboboxOption) => (
          <ComboboxItem key={item.value} value={item}>
            {item.label}
          </ComboboxItem>
        )}
      </ComboboxList>
    </ComboboxPopup>
  </Combobox>
)

export const FieldCombobox = ({
  name,
  required,
}: Readonly<FieldComboboxProps>) => (
  <Field>
    <FieldLabel>{label}</FieldLabel>
    <Combobox items={comboboxOptions} name={name} required={required}>
      <ComboboxInput placeholder={placeholder} />
      <OptionsPopup empty={empty} />
    </Combobox>
    <FieldDescription>Pick the fruit of the week.</FieldDescription>
  </Field>
)
