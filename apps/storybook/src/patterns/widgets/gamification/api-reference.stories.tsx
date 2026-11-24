import type { Meta, StoryObj } from '@storybook/react-vite'
import { QuestsWidget } from '@tc96/ui/patterns'
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
  title: 'Patterns/Widgets/Gamification/API Reference',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: () => (
    <QuestsWidget
      action={<Slot name="action" />}
      quests={[
        {
          detail: <Slot name="detail" />,
          done: false,
          icon: <Slot name="icon" />,
          id: 'one',
          label: 'label',
        },
      ]}
      title="QuestsWidget"
    />
  ),
}
