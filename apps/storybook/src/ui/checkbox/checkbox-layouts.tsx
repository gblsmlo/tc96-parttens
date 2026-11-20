import { Checkbox } from '@tc96/ui/checkbox'
import { Field, FieldDescription, FieldError, FieldLabel } from '@tc96/ui/field'
import { Label } from '@tc96/ui/label'
import { useId } from 'react'
import type { CheckboxControls } from './checkbox-controls.ts'

interface ComposedCheckboxProps extends CheckboxControls {
  onCheckedChange?: (checked: boolean) => void
}

interface FieldCheckboxProps {
  required?: boolean
}

export const ComposedCheckbox = ({
  checked,
  description,
  disabled,
  indeterminate,
  invalid,
  label,
  onCheckedChange,
}: Readonly<ComposedCheckboxProps>) => {
  const id = useId()
  const descriptionId = `${id}-description`
  return (
    <div className="flex max-w-xs items-start gap-2">
      <Checkbox
        aria-describedby={description ? descriptionId : undefined}
        aria-invalid={invalid || undefined}
        defaultChecked={checked}
        disabled={disabled}
        id={id}
        indeterminate={indeterminate}
        onCheckedChange={onCheckedChange}
      />
      <div className="flex flex-col gap-1">
        <Label htmlFor={id}>{label}</Label>
        {description ? (
          <p className="text-muted-foreground text-xs" id={descriptionId}>
            {description}
          </p>
        ) : null}
      </div>
    </div>
  )
}

export const WrappedLabelCheckbox = () => (
  <Label>
    <Checkbox />
    Label text
  </Label>
)

export const AriaLabelCheckbox = () => <Checkbox aria-label="Select item" />

export const CardCheckbox = () => (
  <Label className="flex max-w-xs items-start gap-3 rounded-lg border p-3 has-data-checked:bg-accent/50">
    <Checkbox />
    <span className="flex flex-col gap-1">
      Label text
      <span className="font-normal text-muted-foreground text-xs">
        Describe what checking the box does.
      </span>
    </span>
  </Label>
)

export const FieldCheckbox = ({
  required = false,
}: Readonly<FieldCheckboxProps>) => (
  <Field name="option">
    <FieldLabel>
      <Checkbox required={required} />
      Label text
    </FieldLabel>
    <FieldDescription>Describe what checking the box does.</FieldDescription>
    <FieldError match="valueMissing">Check the box to continue.</FieldError>
  </Field>
)
