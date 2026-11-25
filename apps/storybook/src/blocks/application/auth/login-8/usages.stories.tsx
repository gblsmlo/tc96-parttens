import type { Meta, StoryObj } from '@storybook/react-vite'
import { login8ControlArgs } from './login-8-controls.ts'
import { ComposedLogin8 } from './login-8-layouts.tsx'

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Login/Login8/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const MagicLinkWithMedia: Story = {
  render: () => <ComposedLogin8 {...login8ControlArgs} />,
}
