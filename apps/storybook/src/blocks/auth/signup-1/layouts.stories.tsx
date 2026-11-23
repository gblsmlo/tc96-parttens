import type { Meta, StoryObj } from '@storybook/react-vite'
import { signupControlArgs } from './signup-1-controls.ts'
import { ComposedSignup } from './signup-1-layouts.tsx'

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Auth/Register/Register1/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithoutProviders: Story = {
  render: () => <ComposedSignup {...signupControlArgs} providers={false} />,
}

export const TermsOnly: Story = {
  render: () => <ComposedSignup {...signupControlArgs} privacy={false} />,
}

export const WithoutTermsNotice: Story = {
  render: () => (
    <ComposedSignup {...signupControlArgs} privacy={false} terms={false} />
  ),
}
