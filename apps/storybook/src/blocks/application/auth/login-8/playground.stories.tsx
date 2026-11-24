import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Login8Controls,
  login8ControlArgs,
  login8ControlArgTypes,
} from './login-8-controls.ts'
import { ComposedLogin8 } from './login-8-layouts.tsx'

const meta = {
  args: login8ControlArgs,
  argTypes: login8ControlArgTypes,
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedLogin8 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Login/Login8/Playground',
} satisfies Meta<Login8Controls>

export default meta

type Story = StoryObj<Login8Controls>

export const Playground: Story = {}
