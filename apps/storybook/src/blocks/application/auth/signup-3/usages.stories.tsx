import type { Meta, StoryObj } from '@storybook/react-vite'
import { signup3ControlArgs } from './signup-3-controls.ts'
import { ComposedSignup3 } from './signup-3-layouts.tsx'

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Register/Register3/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const TrialSignup: Story = {
  render: () => <ComposedSignup3 {...signup3ControlArgs} />,
}

export const EmailAlreadyTaken: Story = {
  render: () => (
    <ComposedSignup3
      {...signup3ControlArgs}
      emailError="Este e-mail já tem uma conta."
    />
  ),
}

export const CreatingAccount: Story = {
  render: () => <ComposedSignup3 {...signup3ControlArgs} pending />,
}
