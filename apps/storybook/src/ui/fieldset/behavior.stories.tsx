import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { fieldsetControlArgs } from './fieldset-controls.ts'
import { FieldsetCanvas } from './fieldset-frame.tsx'
import {
  ComposedFieldset,
  NestedFieldset,
  RadioGroupFieldset,
} from './fieldset-layouts.tsx'

const meta = {
  decorators: [FieldsetCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Fieldset/Behavior',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const NamedByLegend: Story = {
  render: () => <ComposedFieldset {...fieldsetControlArgs} />,
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByRole('group', {
      name: 'Billing details',
    })
    await expect(group.tagName).toBe('FIELDSET')
    await expect(group).toHaveAttribute('data-slot', 'fieldset')
    const legend = within(group).getByText('Billing details')
    await expect(legend.tagName).toBe('DIV')
    await expect(legend).toHaveAttribute('data-slot', 'fieldset-legend')
    await expect(group).toHaveAttribute('aria-labelledby', legend.id)
  },
}

export const EnabledByDefault: Story = {
  render: () => <ComposedFieldset {...fieldsetControlArgs} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const group = canvas.getByRole('group', { name: 'Billing details' })
    await expect(group).not.toBeDisabled()
    await expect(group).not.toHaveAttribute('data-disabled')
    const company = canvas.getByRole('textbox', { name: 'Company' })
    await userEvent.type(company, 'Acme Inc.')
    await expect(company).toHaveValue('Acme Inc.')
  },
}

export const DisablesControls: Story = {
  render: () => <ComposedFieldset {...fieldsetControlArgs} disabled />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('group', { name: 'Billing details' }),
    ).toBeDisabled()
    const inputs = canvas.getAllByRole('textbox')
    await expect(inputs).toHaveLength(2)
    for (const input of inputs) await expect(input).toBeDisabled()
    const company = canvas.getByRole('textbox', { name: 'Company' })
    await userEvent.type(company, 'Acme Inc.')
    await expect(company).toHaveValue('')
  },
}

export const MarksDisabledState: Story = {
  render: () => <ComposedFieldset {...fieldsetControlArgs} disabled />,
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByRole('group', {
      name: 'Billing details',
    })
    await expect(group).toHaveAttribute('data-disabled')
    await expect(within(group).getByText('Billing details')).toHaveAttribute(
      'data-disabled',
    )
    const labels = group.querySelectorAll('[data-slot="field-label"]')
    await expect(labels).toHaveLength(2)
    for (const label of labels)
      await expect(label).toHaveAttribute('data-disabled')
  },
}

export const NestedInheritsDisabled: Story = {
  render: () => <NestedFieldset disabled />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const inner = canvas.getByRole('group', { name: 'Address' })
    await expect(inner).toHaveAttribute('data-disabled')
    await expect(within(inner).getByText('Address')).toHaveAttribute(
      'data-disabled',
    )
    await expect(
      within(inner).getByRole('textbox', { name: 'Street' }),
    ).toBeDisabled()
    await expect(
      within(inner).getByRole('textbox', { name: 'City' }),
    ).toBeDisabled()
  },
}

export const LabelsRadioGroup: Story = {
  render: () => <RadioGroupFieldset />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const legend = canvas.getByText('Billing cycle')
    const radioGroup = canvas.getByRole('radiogroup', { name: 'Billing cycle' })
    await expect(radioGroup).toHaveAttribute('aria-labelledby', legend.id)
    await expect(canvas.getByRole('radio', { name: 'Monthly' })).toBeChecked()
  },
}
