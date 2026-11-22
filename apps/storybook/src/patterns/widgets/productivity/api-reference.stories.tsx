import type { Meta, StoryObj } from '@storybook/react-vite'
import { ProjectCardWidget } from '@tc96/parttens'
import { Slot } from '../../../test-utils/anatomy-slot.tsx'
import { initialSubtasks, projectPeople } from './productivity-data.ts'

const meta = {
  decorators: [
    (Story) => (
      <div className="w-96 p-4">
        <Story />
      </div>
    ),
  ],
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/Widgets/Productivity/API Reference',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: () => (
    <ProjectCardWidget
      action={<Slot name="action" />}
      description={<Slot name="description" />}
      footer={<Slot name="footer" />}
      meta={<Slot name="meta" />}
      people={projectPeople}
      subtasks={initialSubtasks.slice(0, 2)}
      tags={[{ id: 'tag', label: <Slot name="tag" /> }]}
      title="ProjectCardWidget"
    />
  ),
}
