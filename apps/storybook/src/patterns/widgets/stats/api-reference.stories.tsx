import type { Meta, StoryObj } from '@storybook/react-vite'
import { MetricWidget } from '@tc96/parttens'
import { Slot } from '../../../test-utils/anatomy-slot.tsx'

const meta = {
  decorators: [
    (Story) => (
      <div className="w-96 p-4">
        <Story />
      </div>
    ),
  ],
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/Widgets/Stats/API Reference',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: () => (
    <MetricWidget
      change={0.12}
      changeLabel={<Slot name="changeLabel" />}
      icon={<Slot name="icon" />}
      label="MetricWidget"
      value={1234.5}
    >
      <Slot name="children" />
    </MetricWidget>
  ),
}
