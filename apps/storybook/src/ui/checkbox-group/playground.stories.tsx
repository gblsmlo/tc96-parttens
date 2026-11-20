import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type CheckboxGroupControls,
  checkboxGroupControlArgs,
  checkboxGroupControlArgTypes,
} from './checkbox-group-controls.ts'
import { ComposedCheckboxGroup } from './checkbox-group-layouts.tsx'

const meta = {
  args: checkboxGroupControlArgs,
  argTypes: checkboxGroupControlArgTypes,
  parameters: { layout: 'centered' },
  render: (args) => <ComposedCheckboxGroup {...args} />,
  tags: ['!autodocs'],
  title: 'UI/CheckboxGroup/Playground',
} satisfies Meta<CheckboxGroupControls>

export default meta

type Story = StoryObj<CheckboxGroupControls>

export const Playground: Story = {}
