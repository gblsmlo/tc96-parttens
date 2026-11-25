import type { Meta, StoryObj } from '@storybook/react-vite'
import { assignedControlArgs } from './assigned-controls'
import { ComposedAssigned } from './assigned-layouts'

const meta = {
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Assigned/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <ComposedAssigned {...assignedControlArgs} />,
}
