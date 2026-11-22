import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { ProductivityDashboardCanvas } from './productivity-canvas.tsx'
import {
  Agenda,
  Clocks,
  DesignWebsite,
  ProductMeeting,
  TaskProgress,
} from './productivity-layouts.tsx'

const meta = {
  decorators: [ProductivityDashboardCanvas],
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Widgets/Productivity/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Overview: Story = {
  render: () => (
    <div className="grid w-full gap-4 md:grid-cols-2">
      <div className="grid content-start gap-4">
        <Clocks />
        <TaskProgress tone="inverted" />
        <ProductMeeting live />
      </div>
      <div className="grid content-start gap-4">
        <DesignWebsite />
        <Agenda />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('region', { name: 'Task progress' }),
    ).toHaveTextContent('12.00%')
    await expect(
      canvas.getByRole('meter', { name: 'Progresso' }),
    ).toHaveAttribute('aria-valuenow', '60')
    await expect(
      canvas.getByRole('region', { name: 'World clock' }),
    ).toHaveTextContent('10:11:20 PM')
  },
}
