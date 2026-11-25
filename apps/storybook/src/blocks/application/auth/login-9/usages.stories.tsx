import type { Meta, StoryObj } from '@storybook/react-vite'
import { login9ControlArgs } from './login-9-controls.ts'
import { ComposedLogin9 } from './login-9-layouts.tsx'

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Login/Login9/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const MagicLinkWithTestimonial: Story = {
  render: () => <ComposedLogin9 {...login9ControlArgs} />,
}
