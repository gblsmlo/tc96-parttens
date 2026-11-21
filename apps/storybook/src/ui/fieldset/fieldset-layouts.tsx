import { Field, FieldDescription, FieldLabel } from '@tc96/ui/field'
import { Fieldset, FieldsetLegend } from '@tc96/ui/fieldset'
import { Input } from '@tc96/ui/input'
import { Label } from '@tc96/ui/label'
import { Radio, RadioGroup } from '@tc96/ui/radio-group'
import type { FieldsetControls } from './fieldset-controls.ts'

interface NestedLayoutProps {
  disabled?: boolean
}

export const ComposedFieldset = ({
  disabled,
  legend,
}: Readonly<FieldsetControls>) => (
  <Fieldset className="flex flex-col gap-6" disabled={disabled}>
    {legend ? <FieldsetLegend>{legend}</FieldsetLegend> : null}
    <Field>
      <FieldLabel>Company</FieldLabel>
      <Input placeholder="Enter company name" type="text" />
      <FieldDescription>The name that appears on invoices.</FieldDescription>
    </Field>
    <Field>
      <FieldLabel>Tax ID</FieldLabel>
      <Input placeholder="Enter tax identification number" type="text" />
      <FieldDescription>
        Leave it empty if the company has none.
      </FieldDescription>
    </Field>
  </Fieldset>
)

export const NestedFieldset = ({ disabled }: Readonly<NestedLayoutProps>) => (
  <Fieldset className="flex flex-col gap-6" disabled={disabled}>
    <FieldsetLegend>Billing details</FieldsetLegend>
    <Field>
      <FieldLabel>Company</FieldLabel>
      <Input placeholder="Enter company name" type="text" />
    </Field>
    <Fieldset className="flex flex-col gap-4">
      <FieldsetLegend>Address</FieldsetLegend>
      <Field>
        <FieldLabel>Street</FieldLabel>
        <Input placeholder="Enter street and number" type="text" />
      </Field>
      <Field>
        <FieldLabel>City</FieldLabel>
        <Input placeholder="Enter city" type="text" />
      </Field>
    </Fieldset>
  </Fieldset>
)

export const RadioGroupFieldset = () => (
  <Fieldset className="flex flex-col gap-4">
    <FieldsetLegend>Billing cycle</FieldsetLegend>
    <RadioGroup defaultValue="monthly">
      <Label>
        <Radio value="monthly" />
        Monthly
      </Label>
      <Label>
        <Radio value="yearly" />
        Yearly
      </Label>
    </RadioGroup>
  </Fieldset>
)
