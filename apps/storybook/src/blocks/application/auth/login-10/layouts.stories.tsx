import type { Meta, StoryObj } from '@storybook/react-vite'
import { login10ControlArgs } from './login-10-controls.ts'
import { ComposedLogin10 } from './login-10-layouts.tsx'

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Login/Login10/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithoutTestimonials: Story = {
  render: () => (
    <ComposedLogin10
      {...login10ControlArgs}
      rating={false}
      testimonials={false}
    />
  ),
}

export const WithoutProvidersAndFooter: Story = {
  render: () => (
    <ComposedLogin10 {...login10ControlArgs} footer={false} providers={false} />
  ),
}
