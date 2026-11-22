import type { Meta, StoryObj } from '@storybook/react-vite'
import { SelectCanvas } from './select-canvas.tsx'
import {
  type SelectControls,
  selectControlArgs,
  selectControlArgTypes,
} from './select-controls.ts'
import { ComposedSelect } from './select-layouts.tsx'

const meta = {
  args: selectControlArgs,
  argTypes: selectControlArgTypes,
  decorators: [SelectCanvas],
  parameters: {
    controls: { exclude: ['disabled', 'value', 'variant'] },
  },
  render: (args) => <ComposedSelect {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Select/Stories',
} satisfies Meta<SelectControls>

export default meta

type Story = StoryObj<SelectControls>

export const Default: Story = {}

export const Plain: Story = {
  args: { variant: 'plain' },
}

export const Empty: Story = {
  args: { value: 'none' },
}

export const OutsideCatalog: Story = {
  args: { value: 'unknown' },
}

export const Disabled: Story = {
  args: { disabled: true },
}
