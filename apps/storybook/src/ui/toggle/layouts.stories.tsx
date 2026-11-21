import type { Meta, StoryObj } from '@storybook/react-vite'
import { toggleControlArgs } from './toggle-controls.ts'
import { ComposedToggle } from './toggle-layouts.tsx'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Toggle/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const IconOnly: Story = {
  render: () => <ComposedToggle {...toggleControlArgs} iconOnly />,
}

export const LeadingIcon: Story = {
  render: () => <ComposedToggle {...toggleControlArgs} icon />,
}
