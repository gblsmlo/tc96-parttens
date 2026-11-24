import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Login3Controls,
  login3ControlArgs,
  login3ControlArgTypes,
} from './login-3-controls.ts'
import { ComposedLogin3 } from './login-3-layouts.tsx'

const meta = {
  args: login3ControlArgs,
  argTypes: login3ControlArgTypes,
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedLogin3 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Auth/Login/Login3/Playground',
} satisfies Meta<Login3Controls>

export default meta

type Story = StoryObj<Login3Controls>

export const Playground: Story = {}
