import type { Meta, StoryObj } from '@storybook/react-vite'
import { checkboxControlArgs } from './checkbox-controls.ts'
import {
  AriaLabelCheckbox,
  CardCheckbox,
  ComposedCheckbox,
  FieldCheckbox,
  WrappedLabelCheckbox,
} from './checkbox-layouts.tsx'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Checkbox/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithDescription: Story = {
  render: () => (
    <ComposedCheckbox
      {...checkboxControlArgs}
      description="Describe what checking the box does."
    />
  ),
}

export const InsideLabel: Story = {
  render: () => <WrappedLabelCheckbox />,
}

export const WithoutVisibleLabel: Story = {
  render: () => <AriaLabelCheckbox />,
}

export const AsCard: Story = {
  render: () => <CardCheckbox />,
}

export const InField: Story = {
  render: () => <FieldCheckbox />,
}
