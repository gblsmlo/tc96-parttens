import type { Meta, StoryObj } from '@storybook/react-vite'
import { checkboxGroupControlArgs } from './checkbox-group-controls.ts'
import {
  ComposedCheckboxGroup,
  FieldCheckboxGroup,
} from './checkbox-group-layouts.tsx'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/CheckboxGroup/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithParent: Story = {
  render: () => <ComposedCheckboxGroup {...checkboxGroupControlArgs} parent />,
}

export const InField: Story = {
  render: () => <FieldCheckboxGroup />,
}
