import type { Decorator } from '@storybook/react-vite'

export const KanbanCardCanvas: Decorator = (Story) => (
  <div className="w-80 max-w-full p-4">
    <Story />
  </div>
)
