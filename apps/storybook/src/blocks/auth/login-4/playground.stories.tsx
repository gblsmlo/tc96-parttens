import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Login4Controls,
  login4ControlArgs,
  login4ControlArgTypes,
} from './login-4-controls.ts'
import { ComposedLogin4 } from './login-4-layouts.tsx'

const meta = {
  args: login4ControlArgs,
  argTypes: login4ControlArgTypes,
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedLogin4 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Auth/Login/Login4/Playground',
} satisfies Meta<Login4Controls>

export default meta

type Story = StoryObj<Login4Controls>

export const Playground: Story = {}
