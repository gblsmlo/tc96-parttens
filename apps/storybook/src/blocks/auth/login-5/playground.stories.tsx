import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Login5Controls,
  login5ControlArgs,
  login5ControlArgTypes,
} from './login-5-controls.ts'
import { ComposedLogin5 } from './login-5-layouts.tsx'

const meta = {
  args: login5ControlArgs,
  argTypes: login5ControlArgTypes,
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedLogin5 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Auth/Login/Login5/Playground',
} satisfies Meta<Login5Controls>

export default meta

type Story = StoryObj<Login5Controls>

export const Playground: Story = {}
