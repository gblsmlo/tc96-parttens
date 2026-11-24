import { MagnifyingGlassIcon, PuzzlePieceIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import {
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  ComboboxTrigger,
  ComboboxValue,
} from '@tc96/ui/combobox'
import { Field, FieldDescription, FieldError, FieldLabel } from '@tc96/ui/field'
import { Form } from '@tc96/ui/form'
import {
  Select,
  SelectButton,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectLabel,
  SelectPopup,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@tc96/ui/select'
import { type FormEvent, Fragment } from 'react'
import { type SelectControls, selectControlArgs } from './select-controls.ts'
import {
  type SelectOption,
  selectOptionGroups,
  selectOptions,
} from './select-variants.ts'

type ChangeHandler<Value> = (value: Value, details: unknown) => void

interface ComposedSelectProps extends SelectControls {
  defaultValue?: readonly string[]
  onOpenChange?: ChangeHandler<boolean>
  onValueChange?: ChangeHandler<unknown>
}

type PopupProps = Pick<
  SelectControls,
  'align' | 'alignItemWithTrigger' | 'groups' | 'side'
>

type TriggerProps = Pick<
  SelectControls,
  'icon' | 'invalid' | 'label' | 'multiple' | 'placeholder' | 'size'
>

interface FieldSelectProps {
  name?: string
  required?: boolean
}

interface ProjectFormProps {
  onSubmit?: (framework: FormDataEntryValue | null) => void
}

const { label, placeholder } = selectControlArgs

const labelOf = (value: string) =>
  selectOptions.find((option) => option.value === value)?.label ?? value

const summarize = (values: readonly string[], placeholder: string) => {
  const [first] = values
  if (!first) return placeholder
  const more = values.length > 1 ? ` (+${values.length - 1} more)` : ''
  return labelOf(first) + more
}

const OptionItems = ({ items }: Readonly<{ items: SelectOption[] }>) =>
  items.map((item) => (
    <SelectItem key={item.value} value={item.value}>
      {item.label}
    </SelectItem>
  ))

const OptionsPopup = ({
  align,
  alignItemWithTrigger,
  groups,
  side,
}: Readonly<PopupProps>) => (
  <SelectPopup
    align={align}
    alignItemWithTrigger={alignItemWithTrigger}
    side={side}
  >
    {groups ? (
      selectOptionGroups.map((group, index) => (
        <Fragment key={group.label}>
          {index > 0 ? <SelectSeparator /> : null}
          <SelectGroup>
            <SelectGroupLabel>{group.label}</SelectGroupLabel>
            <OptionItems items={group.items} />
          </SelectGroup>
        </Fragment>
      ))
    ) : (
      <OptionItems items={selectOptions} />
    )}
  </SelectPopup>
)

const OptionsTrigger = ({
  icon,
  invalid,
  label: text,
  multiple,
  placeholder,
  size,
}: Readonly<TriggerProps>) => (
  <SelectTrigger
    aria-invalid={invalid || undefined}
    aria-label={text ? undefined : label}
    size={size}
  >
    {icon ? <PuzzlePieceIcon aria-hidden="true" /> : null}
    {multiple ? (
      <SelectValue>
        {(value: string[]) => summarize(value, placeholder)}
      </SelectValue>
    ) : (
      <SelectValue placeholder={placeholder} />
    )}
  </SelectTrigger>
)

export const ComposedSelect = ({
  defaultValue,
  disabled,
  label,
  multiple,
  onOpenChange,
  onValueChange,
  open,
  value,
  ...parts
}: Readonly<ComposedSelectProps>) => {
  const initial = defaultValue
    ? [...defaultValue]
    : value === 'none'
      ? []
      : [value]
  const key = [open, multiple, ...initial].join('-')
  const content = (
    <>
      {label ? <SelectLabel>{label}</SelectLabel> : null}
      <OptionsTrigger {...parts} label={label} multiple={multiple} />
      <OptionsPopup {...parts} />
    </>
  )

  if (multiple) {
    return (
      <Select
        defaultOpen={open}
        defaultValue={initial}
        disabled={disabled}
        items={selectOptions}
        key={key}
        multiple
        onOpenChange={onOpenChange}
        onValueChange={onValueChange}
      >
        {content}
      </Select>
    )
  }

  return (
    <Select
      defaultOpen={open}
      defaultValue={initial[0] ?? null}
      disabled={disabled}
      items={selectOptions}
      key={key}
      onOpenChange={onOpenChange}
      onValueChange={onValueChange}
    >
      {content}
    </Select>
  )
}

export const SelectButtonCombobox = ({
  defaultValue,
}: Readonly<{ defaultValue?: string }>) => (
  <Combobox
    defaultValue={
      selectOptions.find((option) => option.value === defaultValue) ?? null
    }
    items={selectOptions}
  >
    <ComboboxTrigger aria-label={label} render={<SelectButton />}>
      <ComboboxValue placeholder={placeholder} />
    </ComboboxTrigger>
    <ComboboxPopup aria-label={label}>
      <div className="border-b p-2">
        <ComboboxInput
          aria-label={`Search ${label.toLowerCase()}`}
          placeholder="Search…"
          showTrigger={false}
          startAddon={<MagnifyingGlassIcon aria-hidden="true" />}
        />
      </div>
      <ComboboxEmpty>No framework found.</ComboboxEmpty>
      <ComboboxList>
        {(item: SelectOption) => (
          <ComboboxItem key={item.value} value={item}>
            {item.label}
          </ComboboxItem>
        )}
      </ComboboxList>
    </ComboboxPopup>
  </Combobox>
)

export const FieldSelect = ({ name, required }: Readonly<FieldSelectProps>) => (
  <Field>
    <FieldLabel>{label}</FieldLabel>
    <Select items={selectOptions} name={name} required={required}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectPopup>
        <OptionItems items={selectOptions} />
      </SelectPopup>
    </Select>
    <FieldDescription>The stack the new project starts from.</FieldDescription>
    <FieldError>Choose a framework to create the project.</FieldError>
  </Field>
)

export const ProjectForm = ({ onSubmit }: Readonly<ProjectFormProps>) => (
  <Form
    className="flex w-full flex-col items-start gap-4"
    onSubmit={(event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      onSubmit?.(new FormData(event.currentTarget).get('framework'))
    }}
  >
    <FieldSelect name="framework" required />
    <Button type="submit">Create project</Button>
  </Form>
)
