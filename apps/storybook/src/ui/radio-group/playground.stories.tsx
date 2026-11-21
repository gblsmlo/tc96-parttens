import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type RadioGroupControls,
  radioGroupControlArgs,
  radioGroupControlArgTypes,
} from './radio-group-controls.ts'
import { ComposedRadioGroup } from './radio-group-layouts.tsx'

const meta = {
  args: radioGroupControlArgs,
  argTypes: radioGroupControlArgTypes,
  parameters: { layout: 'centered' },
  render: (args) => <ComposedRadioGroup {...args} />,
  tags: ['!autodocs'],
  title: 'UI/RadioGroup/Playground',
} satisfies Meta<RadioGroupControls>

export default meta

type Story = StoryObj<RadioGroupControls>

export const Playground: Story = {}
