import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type LoginControls,
  loginControlArgs,
  loginControlArgTypes,
} from './login-1-controls.ts'
import { ComposedLogin } from './login-1-layouts.tsx'

const meta = {
  args: loginControlArgs,
  argTypes: loginControlArgTypes,
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedLogin {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Login/Login1/Playground',
} satisfies Meta<LoginControls>

export default meta

type Story = StoryObj<LoginControls>

export const Playground: Story = {}
