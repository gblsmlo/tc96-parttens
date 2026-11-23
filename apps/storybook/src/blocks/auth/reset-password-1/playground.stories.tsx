import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type ResetPasswordControls,
  resetPasswordControlArgs,
  resetPasswordControlArgTypes,
} from './reset-password-1-controls.ts'
import { ComposedResetPassword1 } from './reset-password-1-layouts.tsx'

const meta = {
  args: resetPasswordControlArgs,
  argTypes: resetPasswordControlArgTypes,
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedResetPassword1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Auth/ResetPassword1/Playground',
} satisfies Meta<ResetPasswordControls>

export default meta

type Story = StoryObj<ResetPasswordControls>

export const Playground: Story = {}
