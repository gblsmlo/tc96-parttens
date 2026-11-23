import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type ResetPassword2Controls,
  resetPassword2ControlArgs,
  resetPassword2ControlArgTypes,
} from './reset-password-2-controls.ts'
import { ComposedResetPassword2 } from './reset-password-2-layouts.tsx'

const meta = {
  args: resetPassword2ControlArgs,
  argTypes: resetPassword2ControlArgTypes,
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedResetPassword2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/ResetPassword2/Playground',
} satisfies Meta<ResetPassword2Controls>

export default meta

type Story = StoryObj<ResetPassword2Controls>

export const Playground: Story = {}
