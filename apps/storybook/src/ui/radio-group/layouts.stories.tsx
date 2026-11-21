import type { Meta, StoryObj } from '@storybook/react-vite'
import { radioGroupControlArgs } from './radio-group-controls.ts'
import {
  CardRadioGroup,
  ComposedRadioGroup,
  FieldRadioGroup,
} from './radio-group-layouts.tsx'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/RadioGroup/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithDescription: Story = {
  render: () => <ComposedRadioGroup {...radioGroupControlArgs} description />,
}

export const AsCards: Story = {
  render: () => <CardRadioGroup />,
}

export const InField: Story = {
  render: () => <FieldRadioGroup />,
}
