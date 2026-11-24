import type { Meta, StoryObj } from '@storybook/react-vite'
import { authProviders } from '../fixtures/auth-data'
import { login7ControlArgs } from './login-7-controls.ts'
import { ComposedLogin7 } from './login-7-layouts.tsx'

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Login/Login7/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithoutFooterLinks: Story = {
  render: () => <ComposedLogin7 {...login7ControlArgs} footerLinks={false} />,
}

export const WithoutProviders: Story = {
  render: () => <ComposedLogin7 {...login7ControlArgs} providers={[]} />,
}

export const ThreeProviders: Story = {
  render: () => (
    <ComposedLogin7
      {...login7ControlArgs}
      providers={[...authProviders, { id: 'apple', label: 'Apple' }]}
    />
  ),
}
