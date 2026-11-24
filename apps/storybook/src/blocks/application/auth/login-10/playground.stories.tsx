import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Login10Controls,
  login10ControlArgs,
  login10ControlArgTypes,
} from './login-10-controls.ts'
import { ComposedLogin10 } from './login-10-layouts.tsx'

const meta = {
  args: login10ControlArgs,
  argTypes: login10ControlArgTypes,
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedLogin10 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Login/Login10/Playground',
} satisfies Meta<Login10Controls>

export default meta

type Story = StoryObj<Login10Controls>

export const Playground: Story = {}
