import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type InputControls,
  inputControlArgs,
  inputControlArgTypes,
} from './input-controls.ts'
import { InputCanvas } from './input-frame.tsx'
import { ComposedInput } from './input-layouts.tsx'

const meta = {
  args: inputControlArgs,
  argTypes: inputControlArgTypes,
  decorators: [InputCanvas],
  parameters: { layout: 'centered' },
  render: (args) => <ComposedInput {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Input/Playground',
} satisfies Meta<InputControls>

export default meta

type Story = StoryObj<InputControls>

export const Playground: Story = {}
