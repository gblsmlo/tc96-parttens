import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Login9Controls,
  login9ControlArgs,
  login9ControlArgTypes,
} from './login-9-controls.ts'
import { ComposedLogin9 } from './login-9-layouts.tsx'

const meta = {
  args: login9ControlArgs,
  argTypes: login9ControlArgTypes,
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedLogin9 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Login/Login9/Playground',
} satisfies Meta<Login9Controls>

export default meta

type Story = StoryObj<Login9Controls>

export const Playground: Story = {}
