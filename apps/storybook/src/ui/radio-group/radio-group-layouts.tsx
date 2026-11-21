import {
  Field,
  FieldDescription,
  FieldError,
  FieldItem,
  FieldLabel,
} from '@tc96/ui/field'
import { Fieldset, FieldsetLegend } from '@tc96/ui/fieldset'
import { Label } from '@tc96/ui/label'
import { Radio, RadioGroup } from '@tc96/ui/radio-group'
import { useId } from 'react'
import type { RadioGroupControls } from './radio-group-controls.ts'
import {
  disabledFramework,
  frameworks,
  type RadioOption,
} from './radio-group-variants.ts'

interface ComposedRadioGroupProps
  extends Omit<RadioGroupControls, 'defaultValue'> {
  defaultValue: string
  name?: string
  onValueChange?: (value: string) => void
  options?: readonly RadioOption[]
  readOnly?: boolean
}

interface CardRadioGroupProps {
  defaultValue?: string
  label?: string
  options?: readonly RadioOption[]
}

interface FieldRadioGroupProps {
  defaultValue?: string
  description?: string
  error?: string
  legend?: string
  name?: string
  onValueChange?: (value: string) => void
  options?: readonly RadioOption[]
  required?: boolean
}

export const captionClassName =
  'font-medium text-base/4.5 text-foreground sm:text-sm/4'

export const ComposedRadioGroup = ({
  defaultValue,
  description,
  disabled,
  disabledItem,
  invalid,
  label,
  name,
  onValueChange,
  options = frameworks,
  readOnly,
}: Readonly<ComposedRadioGroupProps>) => {
  const id = useId()
  const captionId = `${id}-caption`
  const group = (
    <RadioGroup
      aria-labelledby={label ? captionId : undefined}
      defaultValue={defaultValue === 'none' ? undefined : defaultValue}
      disabled={disabled}
      key={defaultValue}
      name={name}
      onValueChange={onValueChange}
      readOnly={readOnly}
    >
      {options.map((option) => {
        const radio = (
          <Radio
            aria-describedby={
              description ? `${id}-${option.value}-description` : undefined
            }
            aria-invalid={invalid || undefined}
            disabled={disabledItem && option.value === disabledFramework}
            id={description ? `${id}-${option.value}` : undefined}
            value={option.value}
          />
        )
        if (!description) {
          return (
            <Label key={option.value}>
              {radio}
              {option.label}
            </Label>
          )
        }
        return (
          <div className="flex items-start gap-2" key={option.value}>
            {radio}
            <div className="flex flex-col gap-1">
              <Label htmlFor={`${id}-${option.value}`}>{option.label}</Label>
              <p
                className="text-muted-foreground text-xs"
                id={`${id}-${option.value}-description`}
              >
                {option.description}
              </p>
            </div>
          </div>
        )
      })}
    </RadioGroup>
  )

  if (!label) return group

  return (
    <div className="flex max-w-xs flex-col gap-3">
      <div className={captionClassName} id={captionId}>
        {label}
      </div>
      {group}
    </div>
  )
}

export const CardRadioGroup = ({
  defaultValue = 'next',
  label = 'Framework',
  options = frameworks,
}: Readonly<CardRadioGroupProps>) => {
  const captionId = useId()
  return (
    <div className="flex w-80 flex-col gap-3">
      <div className={captionClassName} id={captionId}>
        {label}
      </div>
      <RadioGroup aria-labelledby={captionId} defaultValue={defaultValue}>
        {options.map((option) => (
          <Label
            className="flex items-start gap-3 rounded-lg border p-3 has-data-checked:bg-accent/50"
            key={option.value}
          >
            <Radio value={option.value} />
            <span className="flex flex-col gap-1">
              {option.label}
              <span className="font-normal text-muted-foreground text-xs">
                {option.description}
              </span>
            </span>
          </Label>
        ))}
      </RadioGroup>
    </div>
  )
}

export const FieldRadioGroup = ({
  defaultValue = 'next',
  description = 'Pick the framework the project starts on.',
  error = 'Choose a framework to continue.',
  legend = 'Framework',
  name = 'framework',
  onValueChange,
  options = frameworks,
  required = false,
}: Readonly<FieldRadioGroupProps>) => (
  <Field name={name} render={<Fieldset />}>
    <FieldsetLegend>{legend}</FieldsetLegend>
    <RadioGroup
      defaultValue={required ? undefined : defaultValue}
      onValueChange={onValueChange}
      required={required}
    >
      {options.map((option) => (
        <FieldItem key={option.value}>
          <FieldLabel>
            <Radio value={option.value} />
            {option.label}
          </FieldLabel>
        </FieldItem>
      ))}
    </RadioGroup>
    <FieldDescription>{description}</FieldDescription>
    <FieldError match="valueMissing">{error}</FieldError>
  </Field>
)
