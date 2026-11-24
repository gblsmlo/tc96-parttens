import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Login2Controls,
  login2ControlArgs,
  login2ControlArgTypes,
} from './login-2-controls.ts'
import { ComposedLogin2 } from './login-2-layouts.tsx'

const meta = {
  args: login2ControlArgs,
  argTypes: login2ControlArgTypes,
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedLogin2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Login/Login2/Playground',
} satisfies Meta<Login2Controls>

export default meta

type Story = StoryObj<Login2Controls>

export const Playground: Story = {}
