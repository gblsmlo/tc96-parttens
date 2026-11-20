import type { Meta, StoryObj } from '@storybook/react-vite'
import { Field, FieldDescription, FieldLabel } from '@tc96/ui/field'
import { Fieldset, FieldsetLegend } from '@tc96/ui/fieldset'
import { Input } from '@tc96/ui/input'
import { Label } from '@tc96/ui/label'
import { Radio, RadioGroup } from '@tc96/ui/radio-group'
import { expect, within } from 'storybook/test'
import { FieldsetCanvas } from './fieldset-frame.tsx'

const meta = {
  decorators: [FieldsetCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Fieldset/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const ShippingAddress: Story = {
  render: () => (
    <Fieldset className="flex flex-col gap-6">
      <FieldsetLegend>Shipping address</FieldsetLegend>
      <Field>
        <FieldLabel>Street address</FieldLabel>
        <Input autoComplete="street-address" type="text" />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel>City</FieldLabel>
          <Input autoComplete="address-level2" type="text" />
        </Field>
        <Field>
          <FieldLabel>Postal code</FieldLabel>
          <Input autoComplete="postal-code" type="text" />
        </Field>
      </div>
      <Field>
        <FieldLabel>Delivery notes</FieldLabel>
        <Input type="text" />
        <FieldDescription>
          Gate codes or where to leave the package.
        </FieldDescription>
      </Field>
    </Fieldset>
  ),
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByRole('group', {
      name: 'Shipping address',
    })
    await expect(within(group).getAllByRole('textbox')).toHaveLength(4)
  },
}

export const DeliverySpeed: Story = {
  render: () => (
    <Fieldset className="flex flex-col gap-4">
      <FieldsetLegend>Delivery speed</FieldsetLegend>
      <RadioGroup defaultValue="standard" name="delivery">
        <Label>
          <Radio value="standard" />
          Standard, 3 to 5 business days
        </Label>
        <Label>
          <Radio value="express" />
          Express, next business day
        </Label>
        <Label>
          <Radio value="pickup" />
          Pick up in store
        </Label>
      </RadioGroup>
    </Fieldset>
  ),
  play: async ({ canvasElement }) => {
    const radioGroup = within(canvasElement).getByRole('radiogroup', {
      name: 'Delivery speed',
    })
    await expect(within(radioGroup).getAllByRole('radio')).toHaveLength(3)
  },
}

export const ManagedByOrganization: Story = {
  render: () => (
    <Fieldset className="flex flex-col gap-6" disabled>
      <div className="flex flex-col gap-1">
        <FieldsetLegend>Billing contact</FieldsetLegend>
        <p className="text-muted-foreground text-sm">
          Your organization's admin manages these details.
        </p>
      </div>
      <Field>
        <FieldLabel>Name</FieldLabel>
        <Input defaultValue="Finance team" type="text" />
      </Field>
      <Field>
        <FieldLabel>Email</FieldLabel>
        <Input defaultValue="billing@northwind.example" type="email" />
      </Field>
    </Fieldset>
  ),
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByRole('group', {
      name: 'Billing contact',
    })
    await expect(
      within(group).getByRole('textbox', { name: 'Email' }),
    ).toHaveValue('billing@northwind.example')
  },
}
