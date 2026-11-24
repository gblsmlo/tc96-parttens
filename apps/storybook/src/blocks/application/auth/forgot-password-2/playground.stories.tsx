import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type ForgotPassword2Controls,
  forgotPassword2ControlArgs,
  forgotPassword2ControlArgTypes,
} from './forgot-password-2-controls.ts'
import { ComposedForgotPassword2 } from './forgot-password-2-layouts.tsx'

const meta = {
  args: forgotPassword2ControlArgs,
  argTypes: forgotPassword2ControlArgTypes,
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedForgotPassword2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/ForgotPassword/ForgotPassword2/Playground',
} satisfies Meta<ForgotPassword2Controls>

export default meta

type Story = StoryObj<ForgotPassword2Controls>

export const Playground: Story = {}
