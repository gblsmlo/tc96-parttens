import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type ForgotPassword1Controls,
  forgotPassword1ControlArgs,
  forgotPassword1ControlArgTypes,
} from './forgot-password-1-controls.ts'
import { ComposedForgotPassword1 } from './forgot-password-1-layouts.tsx'

const meta = {
  args: forgotPassword1ControlArgs,
  argTypes: forgotPassword1ControlArgTypes,
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedForgotPassword1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Auth/ForgotPassword1/Playground',
} satisfies Meta<ForgotPassword1Controls>

export default meta

type Story = StoryObj<ForgotPassword1Controls>

export const Playground: Story = {}
