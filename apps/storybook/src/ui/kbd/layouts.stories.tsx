import type { Meta, StoryObj } from '@storybook/react-vite'
import { kbdControlArgs } from './kbd-controls.ts'
import { ComposedKbd } from './kbd-layouts.tsx'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Kbd/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Group: Story = {
  render: () => <ComposedKbd {...kbdControlArgs} keys="Ctrl Shift P" />,
}

export const IconKey: Story = {
  render: () => <ComposedKbd {...kbdControlArgs} icon keys="" />,
}

export const GroupWithIconKey: Story = {
  render: () => <ComposedKbd {...kbdControlArgs} icon />,
}
