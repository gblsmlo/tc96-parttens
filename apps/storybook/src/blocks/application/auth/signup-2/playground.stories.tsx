import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Signup2Controls,
  signup2ControlArgs,
  signup2ControlArgTypes,
} from './signup-2-controls.ts'
import { ComposedSignup2 } from './signup-2-layouts.tsx'

const meta = {
  args: signup2ControlArgs,
  argTypes: signup2ControlArgTypes,
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedSignup2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Register/Register2/Playground',
} satisfies Meta<Signup2Controls>

export default meta

type Story = StoryObj<Signup2Controls>

export const Playground: Story = {}
