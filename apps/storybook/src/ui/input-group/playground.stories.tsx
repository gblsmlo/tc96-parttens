import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type InputGroupControls,
  inputGroupControlArgs,
  inputGroupControlArgTypes,
} from './input-group-controls.ts'
import { InputGroupCanvas } from './input-group-frame.tsx'
import { ComposedInputGroup } from './input-group-layouts.tsx'

const meta = {
  args: inputGroupControlArgs,
  argTypes: inputGroupControlArgTypes,
  decorators: [InputGroupCanvas],
  parameters: { layout: 'centered' },
  render: (args) => <ComposedInputGroup {...args} />,
  tags: ['!autodocs'],
  title: 'UI/InputGroup/Playground',
} satisfies Meta<InputGroupControls>

export default meta

type Story = StoryObj<InputGroupControls>

export const Playground: Story = {}
