import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import {
  Autocomplete,
  AutocompleteCollection,
  AutocompleteEmpty,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  AutocompletePopup,
  AutocompleteSeparator,
  AutocompleteStatus,
  useAutocompleteFilter,
} from '@tc96/ui/autocomplete'
import { Field, FieldDescription, FieldLabel } from '@tc96/ui/field'
import { Fragment, useState } from 'react'
import {
  type AutocompleteControls,
  autocompleteControlArgs,
} from './autocomplete-controls.ts'
import {
  type AutocompleteOption,
  type AutocompleteOptionGroup,
  autocompleteOptionGroups,
  autocompleteOptions,
  clearLabel,
  moreResultsText,
  triggerLabel,
} from './autocomplete-variants.ts'

type AutocompleteMode = 'list' | 'both' | 'inline' | 'none'

interface ComposedAutocompleteProps extends AutocompleteControls {
  autoHighlight?: boolean
  defaultValue?: string
  limit?: number
  mode?: AutocompleteMode
  name?: string
  onOpenChange?: (open: boolean) => void
  onValueChange?: (value: string) => void
}

interface OptionsPopupProps {
  empty: string
}

interface FieldAutocompleteProps {
  name?: string
  required?: boolean
}

interface LimitedAutocompleteProps {
  defaultOpen?: boolean
  limit?: number
}

const { empty, label, placeholder } = autocompleteControlArgs

const OptionsPopup = ({ empty }: Readonly<OptionsPopupProps>) => (
  <AutocompletePopup>
    {empty ? <AutocompleteEmpty>{empty}</AutocompleteEmpty> : null}
    <AutocompleteList>
      {(item: AutocompleteOption) => (
        <AutocompleteItem key={item.value} value={item}>
          {item.label}
        </AutocompleteItem>
      )}
    </AutocompleteList>
  </AutocompletePopup>
)

export const ComposedAutocomplete = ({
  autoHighlight,
  defaultValue,
  disabled,
  empty,
  invalid,
  label,
  limit,
  mode,
  name,
  onOpenChange,
  onValueChange,
  open,
  placeholder,
  showClear,
  showTrigger,
  size,
  startAddon,
}: Readonly<ComposedAutocompleteProps>) => (
  <Autocomplete
    autoHighlight={autoHighlight}
    defaultOpen={open}
    defaultValue={defaultValue}
    disabled={disabled}
    items={autocompleteOptions}
    key={String(open)}
    limit={limit}
    mode={mode}
    name={name}
    onOpenChange={onOpenChange}
    onValueChange={onValueChange}
  >
    <AutocompleteInput
      aria-invalid={invalid || undefined}
      aria-label={label}
      clearProps={{ 'aria-label': clearLabel }}
      placeholder={placeholder}
      showClear={showClear}
      showTrigger={showTrigger}
      size={size}
      startAddon={
        startAddon ? <MagnifyingGlassIcon aria-hidden="true" /> : undefined
      }
      triggerProps={{ 'aria-label': triggerLabel }}
    />
    <OptionsPopup empty={empty} />
  </Autocomplete>
)

export const GroupedAutocomplete = () => (
  <Autocomplete defaultOpen items={autocompleteOptionGroups}>
    <AutocompleteInput aria-label={label} placeholder={placeholder} />
    <AutocompletePopup>
      <AutocompleteEmpty>{empty}</AutocompleteEmpty>
      <AutocompleteList>
        {(group: AutocompleteOptionGroup) => (
          <Fragment key={group.value}>
            <AutocompleteGroup items={group.items}>
              <AutocompleteGroupLabel>{group.value}</AutocompleteGroupLabel>
              <AutocompleteCollection>
                {(item: AutocompleteOption) => (
                  <AutocompleteItem key={item.value} value={item}>
                    {item.label}
                  </AutocompleteItem>
                )}
              </AutocompleteCollection>
            </AutocompleteGroup>
            <AutocompleteSeparator />
          </Fragment>
        )}
      </AutocompleteList>
    </AutocompletePopup>
  </Autocomplete>
)

export const LimitedAutocomplete = ({
  defaultOpen = false,
  limit = 3,
}: Readonly<LimitedAutocompleteProps>) => {
  const [value, setValue] = useState('')
  const { contains } = useAutocompleteFilter({ sensitivity: 'base' })
  const query = value.trim()
  const matches = query
    ? autocompleteOptions.filter((item) => contains(item.label, query)).length
    : autocompleteOptions.length
  const more = matches - limit

  return (
    <Autocomplete
      defaultOpen={defaultOpen}
      items={autocompleteOptions}
      limit={limit}
      onValueChange={setValue}
      value={value}
    >
      <AutocompleteInput aria-label={label} placeholder={placeholder} />
      <AutocompletePopup>
        <AutocompleteEmpty>{empty}</AutocompleteEmpty>
        <AutocompleteList>
          {(item: AutocompleteOption) => (
            <AutocompleteItem key={item.value} value={item}>
              {item.label}
            </AutocompleteItem>
          )}
        </AutocompleteList>
        <AutocompleteStatus>
          {more > 0 ? moreResultsText(more) : null}
        </AutocompleteStatus>
      </AutocompletePopup>
    </Autocomplete>
  )
}

export const FieldAutocomplete = ({
  name,
  required,
}: Readonly<FieldAutocompleteProps>) => (
  <Field>
    <FieldLabel>{label}</FieldLabel>
    <Autocomplete items={autocompleteOptions} name={name} required={required}>
      <AutocompleteInput placeholder={placeholder} />
      <OptionsPopup empty={empty} />
    </Autocomplete>
    <FieldDescription>Any fruit, even one not on the list.</FieldDescription>
  </Field>
)
