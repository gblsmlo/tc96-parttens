import type { Meta, StoryObj } from '@storybook/react-vite'
import { login6ControlArgs } from './login-6-controls.ts'
import { ComposedLogin6 } from './login-6-layouts.tsx'

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Login/Login6/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithoutMedia: Story = {
  render: () => <ComposedLogin6 {...login6ControlArgs} media={false} />,
}

export const WithoutProviders: Story = {
  render: () => <ComposedLogin6 {...login6ControlArgs} providers={[]} />,
}
