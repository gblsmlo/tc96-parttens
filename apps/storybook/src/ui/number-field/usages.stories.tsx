import type { Meta, StoryObj } from '@storybook/react-vite'
import { Field, FieldDescription, FieldLabel } from '@tc96/ui/field'
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldScrubArea,
} from '@tc96/ui/number-field'
import { expect, within } from 'storybook/test'
import { NumberFieldCanvas } from './number-field-frame.tsx'
import { QuantityForm } from './number-field-layouts.tsx'

const meta = {
  decorators: [NumberFieldCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/NumberField/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const CartQuantity: Story = {
  render: () => (
    <Field name="quantity">
      <FieldLabel>Quantity</FieldLabel>
      <NumberField defaultValue={2} max={10} min={1}>
        <NumberFieldGroup>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>
      <FieldDescription>Up to 10 per order.</FieldDescription>
    </Field>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('textbox', { name: 'Quantity' }),
    ).toHaveValue('2')
  },
}

export const ProductPrice: Story = {
  render: () => (
    <Field name="price">
      <FieldLabel>Price</FieldLabel>
      <NumberField
        defaultValue={24.9}
        format={{ currency: 'USD', style: 'currency' }}
        locale="en-US"
        min={0}
        step={0.5}
      >
        <NumberFieldGroup>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>
      <FieldDescription>Shown to customers at checkout.</FieldDescription>
    </Field>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('textbox', { name: 'Price' }),
    ).toHaveValue('$24.90')
  },
}

export const DiscountPercent: Story = {
  render: () => (
    <Field name="discount">
      <FieldLabel>Discount</FieldLabel>
      <NumberField
        defaultValue={0.15}
        format={{ style: 'percent' }}
        locale="en-US"
        max={1}
        min={0}
        step={0.05}
      >
        <NumberFieldGroup>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>
      <FieldDescription>Applied to every item in the cart.</FieldDescription>
    </Field>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('textbox', { name: 'Discount' }),
    ).toHaveValue('15%')
  },
}

export const CanvasSize: Story = {
  render: () => (
    <div className="flex gap-3">
      <NumberField defaultValue={1280} locale="en-US" min={1} size="sm">
        <NumberFieldScrubArea label="Width" />
        <NumberFieldGroup>
          <NumberFieldInput />
        </NumberFieldGroup>
      </NumberField>
      <NumberField defaultValue={720} locale="en-US" min={1} size="sm">
        <NumberFieldScrubArea label="Height" />
        <NumberFieldGroup>
          <NumberFieldInput />
        </NumberFieldGroup>
      </NumberField>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('textbox', { name: 'Width' })).toHaveValue(
      '1,280',
    )
    await expect(canvas.getByRole('textbox', { name: 'Height' })).toHaveValue(
      '720',
    )
  },
}

export const AddToCartForm: Story = {
  render: () => <QuantityForm />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('textbox', { name: 'Quantity' }),
    ).toBeRequired()
    await expect(
      canvas.getByRole('button', { name: 'Add to cart' }),
    ).toBeVisible()
  },
}
