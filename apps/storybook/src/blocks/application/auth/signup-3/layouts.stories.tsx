import type { Meta, StoryObj } from '@storybook/react-vite'
import { signup3ControlArgs } from './signup-3-controls.ts'
import { ComposedSignup3 } from './signup-3-layouts.tsx'

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Register/Register3/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithoutProviders: Story = {
  render: () => <ComposedSignup3 {...signup3ControlArgs} providers={false} />,
}

export const WithoutBadgeAndBrands: Story = {
  render: () => (
    <ComposedSignup3 {...signup3ControlArgs} badge="" brands={false} />
  ),
}
