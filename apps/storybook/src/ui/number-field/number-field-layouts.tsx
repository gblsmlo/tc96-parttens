import { Button } from '@tc96/ui/button'
import { Field, FieldDescription, FieldError, FieldLabel } from '@tc96/ui/field'
import { Form } from '@tc96/ui/form'
import { Label } from '@tc96/ui/label'
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldScrubArea,
} from '@tc96/ui/number-field'
import { type ComponentProps, useId } from 'react'
import type { NumberFieldControls } from './number-field-controls.ts'
import { numberFieldFormats } from './number-field-variants.ts'

type NumberFieldProps = ComponentProps<typeof NumberField>

type ComposedNumberFieldProps = NumberFieldControls &
  Omit<NumberFieldProps, keyof NumberFieldControls | 'children'>

interface QuantityFormProps {
  onSubmit?: (quantity: FormDataEntryValue | null) => void
}

export const ComposedNumberField = ({
  defaultValue,
  disabled,
  format,
  invalid,
  label,
  readOnly,
  scrubArea,
  size,
  steppers,
  ...props
}: Readonly<ComposedNumberFieldProps>) => (
  <NumberField
    defaultValue={defaultValue}
    disabled={disabled}
    format={numberFieldFormats[format]}
    key={`${defaultValue}-${format}`}
    readOnly={readOnly}
    size={size}
    {...props}
  >
    {scrubArea && label ? <NumberFieldScrubArea label={label} /> : null}
    <NumberFieldGroup>
      {steppers ? <NumberFieldDecrement /> : null}
      <NumberFieldInput
        aria-invalid={invalid || undefined}
        aria-label={!scrubArea && label ? label : undefined}
      />
      {steppers ? <NumberFieldIncrement /> : null}
    </NumberFieldGroup>
  </NumberField>
)

export const LabeledNumberField = (props: Readonly<NumberFieldControls>) => {
  const id = useId()
  return (
    <div className="flex flex-col items-start gap-2">
      <Label htmlFor={id}>Label text</Label>
      <ComposedNumberField {...props} id={id} label="" scrubArea={false} />
    </div>
  )
}

export const FieldNumberField = (props: Readonly<NumberFieldControls>) => (
  <Field name="value">
    <FieldLabel>Label text</FieldLabel>
    <ComposedNumberField {...props} label="" scrubArea={false} />
    <FieldDescription>Help text for the value.</FieldDescription>
  </Field>
)

export const QuantityForm = ({ onSubmit }: Readonly<QuantityFormProps>) => (
  <Form
    className="flex w-full flex-col gap-4"
    onSubmit={(event) => {
      event.preventDefault()
      onSubmit?.(new FormData(event.currentTarget).get('quantity'))
    }}
  >
    <Field name="quantity">
      <NumberField max={100} min={1} required>
        <NumberFieldScrubArea label="Quantity" />
        <NumberFieldGroup>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>
      <FieldError>Please enter a quantity from 1 to 100.</FieldError>
    </Field>
    <Button type="submit">Add to cart</Button>
  </Form>
)
