import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Signup3Controls,
  signup3ControlArgs,
  signup3ControlArgTypes,
} from './signup-3-controls.ts'
import { ComposedSignup3 } from './signup-3-layouts.tsx'

const meta = {
  args: signup3ControlArgs,
  argTypes: signup3ControlArgTypes,
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedSignup3 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Register/Register3/Playground',
} satisfies Meta<Signup3Controls>

export default meta

type Story = StoryObj<Signup3Controls>

export const Playground: Story = {}
